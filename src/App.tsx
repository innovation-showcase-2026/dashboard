import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Participant } from './types';
import { fetchParticipants, fetchAllSlotsParallel } from './services/participants';
import { AttendeeModal } from './components/AttendeeModal';
import { KPICards } from './components/KPICards';
import { BoothAnalytics } from './components/BoothAnalytics';
import { LobBreakdown } from './components/LobBreakdown';
import { TimeSlotPodiums } from './components/TimeSlotPodiums';
import { computeKPIs, computeBoothStats, computeLobStats } from './utils/analytics';

const TOTAL_BOOTHS = 4;
const pastel: [string, string][] = [
  ['#fbcfe8', '#9d174d'],
  ['#fed7aa', '#9a3412'],
  ['#bfdbfe', '#1e40af'],
  ['#a7f3d0', '#065f46'],
  ['#ddd6fe', '#5b21b6'],
  ['#fecaca', '#991b1b']
];

const ini = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
};

export const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [slotsData, setSlotsData] = useState<Record<string, Participant[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [, setDataError] = useState<string | null>(null);
  const [clock, setClock] = useState<string>(() => new Date().toLocaleTimeString());
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterPrizeOnly, setFilterPrizeOnly] = useState<boolean>(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch participants and all time slots in parallel
  const loadParticipants = useCallback(async () => {
    setIsLoading(true);
    setIsLoadingSlots(true);
    try {
      const [leaderboardData, slotsResult] = await Promise.all([
        fetchParticipants().catch((err) => {
          console.warn('Failed to fetch leaderboard:', err);
          return [];
        }),
        fetchAllSlotsParallel().catch((err) => {
          console.warn('Failed to fetch slots parallel:', err);
          return {};
        })
      ]);

      setParticipants(leaderboardData);
      setSlotsData(slotsResult);
      setDataError(null);
    } catch (error) {
      console.error('Failed to load participants and slots:', error);
      setDataError(error instanceof Error ? error.message : 'Failed to load');
    } finally {
      setIsLoading(false);
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    void loadParticipants();
  }, [loadParticipants]);

  // Overview stats
  const totalContenders = participants.length;
  const maxBooths = participants.length > 0 ? Math.max(...participants.map((p) => p.totalTestsAppeared)) : 0;
  const topAccuracy = participants.length > 0 ? (participants[0]?.overallAccuracy ?? 0) : 0;
  const prizeReadyCount = useMemo(
    () => participants.filter((p) => p.totalTestsAppeared >= TOTAL_BOOTHS || p.isPrizeEligible).length,
    [participants]
  );

  // Filtered leaderboard contenders (all participants with rank)
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        p.lob.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (p.entId && p.entId.toLowerCase().includes(filterQuery.toLowerCase()));
      const matchesPrize = !filterPrizeOnly || (p.totalTestsAppeared >= TOTAL_BOOTHS || p.isPrizeEligible);
      return matchesSearch && matchesPrize;
    });
  }, [participants, filterQuery, filterPrizeOnly]);

  // Analytics helpers
  const kpis = useMemo(() => computeKPIs(participants), [participants]);
  const boothStats = useMemo(() => computeBoothStats(participants), [participants]);
  const lobStats = useMemo(() => computeLobStats(participants), [participants]);

  return (
    <div className="wrap">
      {/* ── TOP STATUS BAR ── */}
      <div className="top">
        <div className="pill vpt">VPT</div>
        <div className="pill live">
          <span className="dot"></span>LIVE STANDINGS
        </div>
        <div className="pill active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563eb">
            <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
          </svg>
          Active
        </div>
        <div className="pill prize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#b45309">
            <path d="M6 3h12v3a6 6 0 0 1-5 5.9V15h3v3H8v-3h3v-3.1A6 6 0 0 1 6 6z" />
          </svg>
          {prizeReadyCount} Prize Ready
        </div>

        <div className="sync">
          <span>🕘 Synced: <span id="clock">{clock}</span></span>
          <i className="sep"></i>
          <button
            onClick={() => void loadParticipants()}
            className={`sync-btn ${isLoading || isLoadingSlots ? 'spinning' : ''}`}
            title="Refresh Leaderboard & Time Slots"
          >
            <span className="red">⟳</span>
            <span>Sync</span>
          </button>
          <i className="sep"></i>
          <button
            onClick={() => setShowAnalytics((prev) => !prev)}
            className="sync-btn"
            style={{ color: showAnalytics ? '#6d28d9' : '#312e81' }}
            title="Toggle Analytics View"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#4338ca">
              <rect x="3" y="12" width="4" height="9" rx="1" />
              <rect x="10" y="5" width="4" height="16" rx="1" />
              <rect x="17" y="9" width="4" height="12" rx="1" />
            </svg>
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* ── CONTEST OVERVIEW HEADER (LIGHT THEME) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(250px, 1.4fr) repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 18,
          alignItems: 'stretch'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)'
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              border: '1.5px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8">
              <path fill="#fef08a" d="M7 4h10v5a5 5 0 0 1-10 0z" />
              <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6v3H9z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.06em' }}>
              WELLS FARGO INNOVATION SHOWCASE
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
              Contestant Standings &amp; Podiums
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
              Innovation. Skill. Excellence.
            </p>
          </div>
        </div>

        <div className="st" style={{ margin: 0, padding: '14px 16px', borderRadius: 16, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)' }}>
          <div className="ic" style={{ background: '#f3e8ff', border: '1px solid #d8b4fe' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#7c3aed">
              <circle cx="9" cy="8" r="3.5" />
              <path d="M2 20c0-4 3-6 7-6s7 2 7 6z" />
              <circle cx="17" cy="9" r="2.5" />
            </svg>
          </div>
          <div>
            <strong id="ovTotal" style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>{totalContenders}</strong>
            <small style={{ color: '#475569', fontSize: '0.74rem', fontWeight: 600 }}>Total Contenders</small>
          </div>
        </div>

        <div className="st" style={{ margin: 0, padding: '14px 16px', borderRadius: 16, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)' }}>
          <div className="ic" style={{ background: '#dbeafe', border: '1px solid #93c5fd' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb">
              <path d="M3 9 5 4h14l2 5v2H3zM5 12h14v8H5z" />
            </svg>
          </div>
          <div>
            <strong id="ovBooths" style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>{maxBooths} / {TOTAL_BOOTHS}</strong>
            <small style={{ color: '#475569', fontSize: '0.74rem', fontWeight: 600 }}>Max Booths Visited</small>
          </div>
        </div>

        <div className="st" style={{ margin: 0, padding: '14px 16px', borderRadius: 16, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)' }}>
          <div className="ic" style={{ background: '#dcfce7', border: '1px solid #86efac' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <strong id="ovAcc" style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>{topAccuracy}%</strong>
            <small style={{ color: '#475569', fontSize: '0.74rem', fontWeight: 600 }}>Top Accuracy</small>
          </div>
        </div>
      </div>

      {/* ── TIME-SLOT COLLAPSIBLE PODIUMS (10:00 - 18:00) ── */}
      <TimeSlotPodiums
        slotsData={slotsData}
        isLoading={isLoadingSlots}
        onSelectParticipant={setSelectedParticipant}
      />

      {/* ── OVERALL LEADERBOARD TABLE ── */}
      <section className="lb">
        <div className="lbh">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#7c3aed">
            <rect x="3" y="12" width="4" height="9" rx="1" />
            <rect x="10" y="4" width="4" height="17" rx="1" />
            <rect x="17" y="9" width="4" height="12" rx="1" />
          </svg>
          <div>
            <h3>Overall Leaderboard Standings</h3>
            <small>
              All Attendees • <span className="dot" style={{ width: 7, height: 7 }}></span>{' '}
              <span id="activeCt">{filteredParticipants.length}</span> active
            </small>
          </div>

          <div className="sp search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              id="filter"
              placeholder="Filter names or LOB..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={`btn ${filterPrizeOnly ? 'active' : ''}`}
            onClick={() => setFilterPrizeOnly((prev) => !prev)}
            title="Filter participants who completed 4 booths"
          >
            🏆 Prize Ready
          </button>
        </div>

        <div className="th">
          <span>#</span>
          <span>Contender</span>
          <span>Booths &amp; Accuracy</span>
          <span style={{ textAlign: 'center' }}>Points</span>
          <span></span>
        </div>

        <div id="rows">
          {filteredParticipants.map((p, idx) => {
            const rank = p.rank || idx + 1;
            const c = pastel[(rank - 1) % pastel.length];
            const cls = p.totalScore >= 3 ? 'hi' : p.totalScore > 0 ? 'lo' : 'z';
            const isRank1 = rank === 1;
            const isRank2 = rank === 2;
            const isRank3 = rank === 3;

            return (
              <div
                key={p.entId || p.name + rank}
                className="row"
                onClick={() => setSelectedParticipant(p)}
                title={`Click to view deep dive for ${p.name}`}
              >
                <span>
                  <span
                    className="rk"
                    style={{
                      color: isRank1 ? '#facc15' : isRank2 ? '#c7d2fe' : isRank3 ? '#fdba74' : undefined,
                      fontWeight: rank <= 3 ? 900 : 700
                    }}
                  >
                    #{rank} {isRank1 ? '🥇' : isRank2 ? '🥈' : isRank3 ? '🥉' : ''}
                  </span>
                </span>
                <div className="who">
                  <div className="a" style={{ background: c[0], color: c[1] }}>
                    {ini(p.name)}
                  </div>
                  <div>
                    <b>{p.name}</b>
                    <span>{p.lob || 'Technology'}</span>
                  </div>
                </div>
                <div className="ba">
                  <span className="ic">
                    {rank <= 3 ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#2563eb">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb">
                        <path d="M3 9 5 4h14l2 5v2H3zM5 12h14v8H5z" />
                      </svg>
                    )}
                  </span>
                  <span className="n">{p.totalTestsAppeared}/{TOTAL_BOOTHS}</span>
                  <span className="acc">{p.overallAccuracy}%</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className={`pt ${cls}`} style={{ display: 'inline-block' }}>
                    {p.totalScore} {p.totalScore === 1 ? 'pt' : 'pts'}
                  </span>
                </div>
                <span className="chev">›</span>
              </div>
            );
          })}

          {filteredParticipants.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: '0.85rem' }}>
              No contenders match your search filter.
            </div>
          )}
        </div>

        <div className="foot">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb">
            <circle cx="12" cy="10" r="10" />
            <path d="M12 11v6M12 7v1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span id="showing">
            Showing {filteredParticipants.length} of {participants.length} Contenders
          </span>
          <div className="q">⭐ 4 booths to qualify for Prize Drawing</div>
        </div>
      </section>

      {/* ── OPTIONAL ANALYTICS EXPANSION ── */}
      {showAnalytics && (
        <div style={{ marginTop: 20, animation: 'fadeIn 0.3s ease' }}>
          <KPICards kpis={kpis} onFilterPrizeWinners={() => setFilterPrizeOnly(true)} />
          <div style={{ marginTop: 14 }}>
            <BoothAnalytics boothStats={boothStats} />
          </div>
          <div style={{ marginTop: 14 }}>
            <LobBreakdown lobStats={lobStats} />
          </div>
        </div>
      )}

      {/* ── ATTENDEE DEEP DIVE MODAL ── */}
      {selectedParticipant && (
        <AttendeeModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </div>
  );
};

export default App;
