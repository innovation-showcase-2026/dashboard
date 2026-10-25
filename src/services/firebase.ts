import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  getDocsFromServer,
  Unsubscribe,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { Participant } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBaweGLFMHeReP5GlqXOUA5Gro5ZahFqVE",
  authDomain: "innovation-showcase-2026.firebaseapp.com",
  projectId: "innovation-showcase-2026",
  storageBucket: "innovation-showcase-2026.firebasestorage.app",
  messagingSenderId: "577856466009",
  appId: "1:577856466009:web:7fe373b4d1771de3655548",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

/**
 * Parses raw Firestore document snapshots into typed, sorted and ranked Participant records.
 */
export function parseParticipantSnapshot(snapshot: QuerySnapshot<DocumentData>): Participant[] {
  const records: Participant[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    records.push({
      id: doc.id,
      entId: data.entId || doc.id,
      name: data.name || 'Anonymous Attendee',
      lob: data.lob || 'General Tech',
      registeredAt: data.registeredAt || new Date().toISOString(),
      totalTestsAppeared: Number(data.totalTestsAppeared) || 0,
      totalScore: Number(data.totalScore) || 0,
      totalQuestions: Number(data.totalQuestions) || 0,
      overallAccuracy: Number(data.overallAccuracy) || 0,
      isPrizeEligible: Boolean(data.isPrizeEligible ?? (Number(data.totalTestsAppeared) >= 4)),
      lastUpdated: data.lastUpdated || data.registeredAt || new Date().toISOString(),
      tests: Array.isArray(data.tests) ? data.tests : []
    });
  });

  // Sort by totalScore desc, then overallAccuracy desc, then totalTestsAppeared desc
  records.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.overallAccuracy !== a.overallAccuracy) return b.overallAccuracy - a.overallAccuracy;
    return b.totalTestsAppeared - a.totalTestsAppeared;
  });

  // Assign dynamic ranks
  records.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  return records;
}

/**
 * Subscribes to real-time updates of the 'participants' collection in Firestore.
 */
export function subscribeToParticipants(
  onData: (participants: Participant[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const participantsCol = collection(db, 'participants');

  return onSnapshot(
    participantsCol,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const records = parseParticipantSnapshot(snapshot);
      onData(records);
    },
    (err) => {
      console.error("Firestore participants subscription error:", err);
      onError(err);
    }
  );
}

/**
 * Explicitly queries Firebase Firestore directly on demand (bypassing local client cache)
 * for the manual Refresh action.
 */
export async function fetchParticipantsFromServer(): Promise<Participant[]> {
  const participantsCol = collection(db, 'participants');
  let snapshot: QuerySnapshot<DocumentData>;

  try {
    // Try forcing direct server fetch to ensure 100% fresh data
    snapshot = await getDocsFromServer(participantsCol);
  } catch (err) {
    // Fall back to standard getDocs if network restricts forced-server fetch
    console.warn("getDocsFromServer fallback to getDocs:", err);
    snapshot = await getDocs(participantsCol);
  }

  return parseParticipantSnapshot(snapshot);
}
