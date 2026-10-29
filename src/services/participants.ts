import { Participant } from '../types';

export const LEADERBOARD_URL =
  import.meta.env.VITE_LEADERBOARD_URL ||
  'https://innovation-showcase-2026.github.io/quiz_sync/data/leaderboard.json';

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

  return {
    id: typeof item.id === 'string' ? item.id : entId,
    entId,
    name,
    lob,
    registeredAt,
    totalTestsAppeared,
    totalScore,
    totalQuestions,
    overallAccuracy,
    isPrizeEligible,
    lastUpdated,
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
