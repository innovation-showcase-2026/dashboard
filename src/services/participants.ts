import { Participant } from '../types';

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== 'object' || value === null) return false;

  const participant = value as Record<string, unknown>;
  return (
    typeof participant.entId === 'string' &&
    typeof participant.name === 'string' &&
    typeof participant.lob === 'string' &&
    typeof participant.totalTestsAppeared === 'number' &&
    typeof participant.totalScore === 'number' &&
    typeof participant.totalQuestions === 'number' &&
    typeof participant.overallAccuracy === 'number' &&
    typeof participant.isPrizeEligible === 'boolean' &&
    (participant.tests === undefined || Array.isArray(participant.tests))
  );
}

export async function fetchParticipants(): Promise<Participant[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}participants.json`);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isParticipant)) {
    throw new Error('participants.json must contain an array of valid participant records');
  }

  const participants = [...data];
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
