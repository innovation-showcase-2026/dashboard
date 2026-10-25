import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { WinnersHero } from './components/WinnersHero';
import { KPICards } from './components/KPICards';
import { LeaderboardTable } from './components/LeaderboardTable';
import { BoothAnalytics } from './components/BoothAnalytics';
import { LobBreakdown } from './components/LobBreakdown';
import { AttendeeModal } from './components/AttendeeModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { Participant } from './types';
import { subscribeToParticipants, fetchParticipantsFromServer } from './services/firebase';
import { INITIAL_MOCK_PARTICIPANTS } from './services/mockData';
import { computeKPIs, computeBoothStats, computeLobStats } from './utils/analytics';
import { WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const [firestoreParticipants, setFirestoreParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [useMockFallback, setUseMockFallback] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'prize' | 'lob'>('all');
  const [activeNavTab, setActiveNavTab] = useState<string>('Dashboard');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Setup real-time listener to Firestore
  useEffect(() => {
    setIsLoading(true);
    setFirebaseError(null);

    const unsubscribe = subscribeToParticipants(
      (data) => {
        setFirestoreParticipants(data);
        setLastSynced(new Date());
        setIsLoading(false);
        setFirebaseError(null);
      },
      (err) => {
        console.error("Firestore connection notice:", err);
        setFirebaseError(err.message || "Unable to connect to Firestore");
        setIsLoading(false);
        setUseMockFallback(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Compute active dataset (either pure live Firestore or augmented demo preview)
  const activeParticipants = useMemo(() => {
    if (useMockFallback && firestoreParticipants.length === 0) {
      return INITIAL_MOCK_PARTICIPANTS;
    }
    if (useMockFallback && firestoreParticipants.length > 0) {
      const map = new Map<string, Participant>();
      INITIAL_MOCK_PARTICIPANTS.forEach(p => map.set(p.entId, p));
      firestoreParticipants.forEach(p => map.set(p.entId, p));
      const list = Array.from(map.values());
      list.sort((a, b) => b.totalScore - a.totalScore);
      list.forEach((p, idx) => { p.rank = idx + 1; });
      return list;
    }
    return firestoreParticipants;
  }, [firestoreParticipants, useMockFallback]);

  // Derived metrics
  const kpis = useMemo(() => computeKPIs(activeParticipants), [activeParticipants]);
  const boothStats = useMemo(() => computeBoothStats(activeParticipants), [activeParticipants]);
  const lobStats = useMemo(() => computeLobStats(activeParticipants), [activeParticipants]);

  const handleManualRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const freshData = await fetchParticipantsFromServer();
      setFirestoreParticipants(freshData);
      setLastSynced(new Date());
      setFirebaseError(null);
    } catch (err: any) {
      console.error("Manual refresh from Firestore error:", err);
      setFirebaseError(err.message || "Failed to fetch from Firestore");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleMock = useCallback(() => {
    setUseMockFallback(prev => !prev);
  }, []);

  const handleSelectPrizeWinnersFilter = useCallback(() => {
    setFilterMode('prize');
    const tableElem = document.getElementById('leaderboard-section');
    if (tableElem) {
      tableElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNavTabChange = useCallback((tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'Attendees') {
      const elem = document.getElementById('leaderboard-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'Analytics') {
      const elem = document.getElementById('booth-analytics-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'Dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F4F5F8' }}>
      {/* 1. Deep Burgundy Top Header & 4 Status Pills */}
      <Header
        participants={activeParticipants}
        lastSynced={lastSynced}
        isLoading={isLoading}
        onRefresh={handleManualRefresh}
        usingMockData={useMockFallback}
        onToggleMockData={handleToggleMock}
        activeNavTab={activeNavTab}
        onNavTabChange={handleNavTabChange}
      />

      {/* Optional Firebase error notice */}
      {firebaseError && (
        <div
          style={{
            background: '#FEF2F2',
            borderBottom: '1px solid #FCA5A5',
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#991B1B',
            fontSize: '0.82rem'
          }}
        >
          <WifiOff size={15} />
          <span>Firestore offline/notice ({firebaseError}). Showing cached state.</span>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: 1520, width: '100%', margin: '0 auto', padding: '0 32px 48px 32px' }}>
        {isLoading && firestoreParticipants.length === 0 && !useMockFallback ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* 2. Hero Banner: WINNERS & LEADERS 3D Podium */}
            <WinnersHero 
              topParticipants={activeParticipants} 
              onSelectParticipant={setSelectedParticipant} 
            />

            {/* 3. Executive KPI Cards Row (4 Cards) */}
            <KPICards 
              kpis={kpis} 
              onFilterPrizeWinners={handleSelectPrizeWinnersFilter} 
            />

            {/* 4. Summit Attendee Leaderboard Card */}
            <div id="leaderboard-section">
              <LeaderboardTable
                participants={activeParticipants}
                onSelectParticipant={setSelectedParticipant}
                filterMode={filterMode}
                onFilterChange={setFilterMode}
              />
            </div>

            {/* 5. Additional Sections */}
            <div id="booth-analytics-section" style={{ marginTop: 24 }}>
              <BoothAnalytics boothStats={boothStats} />
            </div>

            <div id="lob-section" style={{ marginTop: 12 }}>
              <LobBreakdown lobStats={lobStats} />
            </div>
          </>
        )}
      </main>

      {/* Attendee Deep-Dive Telemetry Modal */}
      {selectedParticipant && (
        <AttendeeModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}

      {/* Corporate Wells Fargo Footer */}
      <footer
        style={{
          borderTop: '1px solid #E2E8F0',
          background: '#FFFFFF',
          padding: '20px 32px',
          color: '#64748B',
          fontSize: '0.8rem'
        }}
      >
        <div
          style={{
            maxWidth: 1520,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, color: '#D71E28' }}>WELLS FARGO</span>
            <span>•</span>
            <span style={{ color: '#1E293B', fontWeight: 600 }}>Technology Summit 2026 Innovation Showcase</span>
          </div>
          <div>
            Real-Time Google Firebase Firestore Synchronized Leaderboard & Competition Telemetry
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
