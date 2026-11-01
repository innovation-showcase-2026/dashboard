import { Participant } from '../types';

export const LEADERBOARD_URL =
  import.meta.env.VITE_LEADERBOARD_URL ||
  'https://innovation-showcase-2026.github.io/quiz_sync/data/leaderboard.json';

export const TIME_SLOTS: string[] = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00'
];

function normalizeParticipant(value: unknown, index: number): Participant | null {
  if (typeof value !== 'object' || value === null) return null;

  const item = value as Record<string, unknown>;

  const name =
    typeof item.name === 'string' && item.name.trim()
      ? item.name.trim()
      : `Attendee #${index + 1}`;

  const entId =
    typeof item.entId === 'string' && item.entId.trim()
      ? item.entId.trim().toUpperCase()
      : typeof item.email === 'string' && item.email.includes('@')
        ? item.email.split('@')[0].toUpperCase()
        : name.toLowerCase().replace(/\s+/g, '_');

  const lob =
    typeof item.lob === 'string' && item.lob.trim()
      ? item.lob.trim()
      : 'Technology';

  const tests = Array.isArray(item.tests) ? item.tests : [];
  const totalTestsAppeared =
    typeof item.totalTestsAppeared === 'number'
      ? item.totalTestsAppeared
      : tests.length;

  const totalScore =
    typeof item.totalScore === 'number'
      ? item.totalScore
      : tests.reduce((acc: number, t: any) => acc + (Number(t?.score) || 0), 0);

  const totalQuestions =
    typeof item.totalQuestions === 'number'
      ? item.totalQuestions
      : tests.reduce((acc: number, t: any) => acc + (Number(t?.totalQuestions) || 5), 0) || (totalTestsAppeared * 5);

  const overallAccuracy =
    typeof item.overallAccuracy === 'number'
      ? item.overallAccuracy
      : totalQuestions > 0
        ? Math.round((totalScore / totalQuestions) * 100)
        : 0;

  const isPrizeEligible =
    typeof item.isPrizeEligible === 'boolean'
      ? item.isPrizeEligible
      : totalTestsAppeared >= 4;

  const registeredAt = typeof item.registeredAt === 'string' ? item.registeredAt : undefined;
  const lastUpdated = typeof item.lastUpdated === 'string' ? item.lastUpdated : registeredAt;
  const email = typeof item.email === 'string' ? item.email : undefined;

  const summary =
    typeof item.summary === 'object' && item.summary !== null
      ? (item.summary as Record<string, unknown>)
      : null;

  const completionTime =
    typeof item.completionTime === 'string' && item.completionTime.trim()
      ? item.completionTime.trim()
      : summary && typeof summary.completionTime === 'string' && summary.completionTime.trim()
        ? summary.completionTime.trim()
        : undefined;

  const totalTimeSeconds =
    typeof item.totalTimeSeconds === 'number'
      ? item.totalTimeSeconds
      : summary && typeof summary.totalTimeSeconds === 'number'
        ? summary.totalTimeSeconds
        : undefined;

  return {
    id: typeof item.id === 'string' ? item.id : entId,
    entId,
    name,
    lob,
    email,
    registeredAt,
    totalTestsAppeared,
    totalScore,
    totalQuestions,
    overallAccuracy,
    isPrizeEligible,
    lastUpdated,
    completionTime,
    totalTimeSeconds,
    tests,
    rank: index + 1
  };
}

export async function fetchParticipants(): Promise<Participant[]> {
  let data: unknown;

  try {
    const response = await fetch(LEADERBOARD_URL, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard (${response.status} ${response.statusText})`);
    }

    data = await response.json();
  } catch (fetchError) {
    console.warn(`Unable to fetch live leaderboard from ${LEADERBOARD_URL}. Trying local fallback...`, fetchError);
    try {
      const fallbackResponse = await fetch(`${import.meta.env.BASE_URL}participants.json`);
      if (fallbackResponse.ok) {
        data = await fallbackResponse.json();
      } else {
        throw fetchError;
      }
    } catch {
      throw fetchError;
    }
  }

  if (!Array.isArray(data)) {
    throw new Error('Leaderboard payload must be a JSON array of participant records');
  }

  const participants = data
    .map((item, index) => normalizeParticipant(item, index))
    .filter((p): p is Participant => p !== null);

  participants.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.overallAccuracy !== a.overallAccuracy) return b.overallAccuracy - a.overallAccuracy;
    return b.totalTestsAppeared - a.totalTestsAppeared;
  });

  participants.forEach((participant, index) => {
    participant.rank = index + 1;
  });

  return participants;
}

export function getSlotUrl(code: string): string {
  const baseUrl = LEADERBOARD_URL.substring(0, LEADERBOARD_URL.lastIndexOf('/') + 1);
  return `${baseUrl}${code}.json`;
}

export async function fetchSlotParticipants(codeOrUrl: string): Promise<Participant[]> {
  const url = codeOrUrl.startsWith('http') ? codeOrUrl : getSlotUrl(codeOrUrl);
  try {
    const response = await fetch(url, {
      cache: 'no-store'
    });

    if (!response.ok) {
      // 404 or other errors mean no entries generated yet for this time slot
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    const participants = data
      .map((item, index) => normalizeParticipant(item, index))
      .filter((p): p is Participant => p !== null);

    participants.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.overallAccuracy !== a.overallAccuracy) return b.overallAccuracy - a.overallAccuracy;
      return (a.totalTimeSeconds ?? 999999) - (b.totalTimeSeconds ?? 999999);
    });

    participants.forEach((participant, index) => {
      participant.rank = index + 1;
    });

    return participants;
  } catch (err) {
    console.warn(`Failed to fetch slot from ${url}:`, err);
    return [];
  }
}

export async function fetchAllSlotsParallel(): Promise<Record<string, Participant[]>> {
  const promises = TIME_SLOTS.map(async (slot) => {
    const code = slot.replace(':', '');
    const participants = await fetchSlotParticipants(code);
    return { slot, participants };
  });

  const results = await Promise.all(promises);
  const slotMap: Record<string, Participant[]> = {};
  for (const { slot, participants } of results) {
    slotMap[slot] = participants;
  }
  return slotMap;
}
