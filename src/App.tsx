import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Participant } from './types';
import { fetchParticipants } from './services/participants';
import { AttendeeModal } from './components/AttendeeModal';
import { KPICards } from './components/KPICards';
import { BoothAnalytics } from './components/BoothAnalytics';
import { LobBreakdown } from './components/LobBreakdown';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  // Fetch participants
  const loadParticipants = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchParticipants();
      setParticipants(data);
      setDataError(null);
    } catch (error) {
      console.error('Failed to load participants:', error);
      setDataError(error instanceof Error ? error.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadParticipants();
  }, [loadParticipants]);

  // Top 3 contenders
  const p1 = participants[0];
  const p2 = participants[1];
  const p3 = participants[2];

  // Overview stats
  const totalContenders = participants.length;
  const maxBooths = participants.length > 0 ? Math.max(...participants.map((p) => p.totalTestsAppeared)) : 0;
  const topAccuracy = participants.length > 0 ? (participants[0]?.overallAccuracy ?? 0) : 0;
  const prizeReadyCount = useMemo(
    () => participants.filter((p) => p.totalTestsAppeared >= TOTAL_BOOTHS || p.isPrizeEligible).length,
    [participants]
  );

  // Contenders starting from rank 4
  const restWithRanks = useMemo(() => {
    return participants.slice(3).map((p, idx) => ({
      ...p,
      rank: idx + 4
    }));
  }, [participants]);

  // Filtered leaderboard contenders
  const filteredRest = useMemo(() => {
    return restWithRanks.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        p.lob.toLowerCase().includes(filterQuery.toLowerCase());
      const matchesPrize = !filterPrizeOnly || (p.totalTestsAppeared >= TOTAL_BOOTHS || p.isPrizeEligible);
      return matchesSearch && matchesPrize;
    });
  }, [restWithRanks, filterQuery, filterPrizeOnly]);

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
            className={`sync-btn ${isLoading ? 'spinning' : ''}`}
            title="Refresh Leaderboard"
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

      {/* ── HERO PODIUM & OVERVIEW ── */}
      <section className="hero">
        <div className="glow-top"></div>
        <div className="glow-cyan"></div>
        <div className="glow-floor"></div>
        <div className="ring"></div>

        {/* Confetti decorations */}
        <span className="conf" style={{ top: 70, left: '38%', width: 16, height: 6, background: '#fbbf24', ['--r' as any]: '-30deg' }}></span>
        <span className="conf" style={{ top: 80, left: '62%', width: 6, height: 14, background: '#f59e0b', ['--r' as any]: '20deg', animationDelay: '.5s' }}></span>
        <span className="conf" style={{ top: 30, left: '68%', width: 6, height: 12, background: '#fde047', ['--r' as any]: '45deg', animationDelay: '1s' }}></span>
        <span className="conf" style={{ top: 150, left: '1%', width: 18, height: 5, background: '#fbbf24', ['--r' as any]: '-15deg', animationDelay: '.8s' }}></span>
        <div
          style={{
            position: 'absolute',
            top: 100,
            right: '25%',
            width: 26,
            height: 18,
            border: '3px solid #f59e0b',
            borderTop: 0,
            borderRight: 0,
            borderRadius: '0 0 0 18px',
            transform: 'rotate(-30deg)',
            opacity: 0.8
          }}
        ></div>

        <div className="grid">
          {/* Brand Col */}
          <div className="brand">
            <div className="trophy">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.5" strokeLinejoin="round">
                <path fill="rgba(250,204,21,.25)" d="M7 4h10v5a5 5 0 0 1-10 0z" />
                <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6v3H9z" />
              </svg>
            </div>
            <div className="kick">WELLS FARGO INNOVATION SHOWCASE</div>
            <h2>Top Contenders <em>Podium</em></h2>
            <p>Innovation. Skill. Excellence.</p>
            <div className="line"></div>
          </div>

          {/* Podium Col */}
          <div className="podium">
            {/* 2nd Place */}
            <div
              className="col s2 cl"
              id="pod2"
              onClick={() => p2 && setSelectedParticipant(p2)}
              title={p2 ? `View details for ${p2.name}` : ''}
            >
              <div className="av">
                <div className="c c2">
                  <i data-i="2">{p2 ? ini(p2.name) : '--'}</i>
                </div>
                <span className="tag tag2">#2</span>
              </div>
              <div className="ped p2">
                <div>
                  <div className="nm" data-n="2">{p2 ? p2.name : 'Awaiting Contender'}</div>
                  <div className="pts" data-p="2">{p2 ? `${p2.totalScore} pts` : '--'}</div>
                  <div className="sub" data-s="2">
                    {p2 ? `${p2.totalTestsAppeared} Booths • ${p2.overallAccuracy}% Acc` : ''}
                  </div>
                </div>
                <div className="plaque pl2">🏆 2ND PLACE</div>
              </div>
              <div className="base b2"></div>
            </div>

            {/* 1st Place */}
            <div
              className="col cl cl1"
              id="pod1"
              onClick={() => p1 && setSelectedParticipant(p1)}
              title={p1 ? `View details for ${p1.name}` : ''}
            >
              <div className="crown">
                <svg width="34" height="30" viewBox="0 0 24 24" fill="#facc15" stroke="#fef08a" strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M2 19 4 7l5 5 3-8 3 8 5-5 2 12z" />
                </svg>
              </div>
              <div className="av">
                <div className="c c1">
                  <i data-i="1">{p1 ? ini(p1.name) : '--'}</i>
                </div>
                <span className="tag tag1">#1 • 1ST</span>
              </div>
              <div className="ped p1">
                <div>
                  <div className="nm" data-n="1" style={{ fontSize: '0.96rem' }}>
                    {p1 ? p1.name : 'Awaiting Winner'}
                  </div>
                  <div className="big" data-p="1">
                    {p1 ? `${p1.totalScore} Points` : '--'}
                  </div>
                  <div className="sub" data-s="1" style={{ color: '#fde68a', fontWeight: 600 }}>
                    {p1 ? `${p1.totalTestsAppeared} Booths • ${p1.overallAccuracy}% Acc` : ''}
                  </div>
                </div>
                <div className="plaque pl1">★ 1ST PLACE ★</div>
              </div>
              <div className="base b1"></div>
            </div>

            {/* 3rd Place */}
            <div
              className="col s3 cl"
              id="pod3"
              onClick={() => p3 && setSelectedParticipant(p3)}
              title={p3 ? `View details for ${p3.name}` : ''}
            >
              <div className="av">
                <div className="c c3">
                  <i data-i="3">{p3 ? ini(p3.name) : '--'}</i>
                </div>
                <span className="tag tag3">#3</span>
              </div>
              <div className="ped p3">
                <div>
                  <div className="nm" data-n="3">{p3 ? p3.name : 'Awaiting Contender'}</div>
                  <div className="pts" data-p="3">{p3 ? `${p3.totalScore} pts` : '--'}</div>
                  <div className="sub" data-s="3">
                    {p3 ? `${p3.totalTestsAppeared} Booths • ${p3.overallAccuracy}% Acc` : ''}
                  </div>
                </div>
                <div className="plaque pl3">🏆 3RD PLACE</div>
              </div>
              <div className="base b3"></div>
            </div>
          </div>

          {/* Overview Col */}
          <div className="ov">
            <h3>
              <b>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="12" width="4" height="9" rx="1" />
                  <rect x="10" y="5" width="4" height="16" rx="1" />
                  <rect x="17" y="9" width="4" height="12" rx="1" />
                </svg>
              </b>
              Contest Overview
            </h3>

            <div className="st">
              <div className="ic" style={{ background: 'rgba(168,85,247,.2)', border: '1px solid rgba(168,85,247,.4)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#c084fc">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M2 20c0-4 3-6 7-6s7 2 7 6z" />
                  <circle cx="17" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <strong id="ovTotal">{totalContenders}</strong>
                <small>Total Contenders</small>
              </div>
            </div>

            <div className="st">
              <div className="ic" style={{ background: 'rgba(59,130,246,.2)', border: '1px solid rgba(59,130,246,.4)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#60a5fa">
                  <path d="M3 9 5 4h14l2 5v2H3zM5 12h14v8H5z" />
                </svg>
              </div>
              <div>
                <strong id="ovBooths">{maxBooths}</strong>
                <small>Booths Visited</small>
              </div>
            </div>

            <div className="st">
              <div className="ic" style={{ background: 'rgba(34,197,94,.2)', border: '1px solid rgba(34,197,94,.4)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <strong id="ovAcc">{topAccuracy}%</strong>
                <small>Top Accuracy</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERBOARD TABLE (RANKS 4+) ── */}
      <section className="lb">
        <div className="lbh">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#7c3aed">
            <rect x="3" y="12" width="4" height="9" rx="1" />
            <rect x="10" y="4" width="4" height="17" rx="1" />
            <rect x="17" y="9" width="4" height="12" rx="1" />
          </svg>
          <div>
            <h3>Leaderboard Contenders</h3>
            <small>
              Ranks 4 – {Math.min(15, participants.length)} •{' '}
              <span className="dot" style={{ width: 7, height: 7 }}></span>{' '}
              <span id="activeCt">{filteredRest.length}</span> active
            </small>
          </div>

          <div className="sp search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              id="filter"
              placeholder="Filter names..."
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
          {filteredRest.map((p) => {
            const c = pastel[(p.rank - 4) % pastel.length];
            const cls = p.totalScore >= 3 ? 'hi' : p.totalScore > 0 ? 'lo' : 'z';
            const isRank4 = p.rank === 4;

            return (
              <div
                key={p.entId || p.name + p.rank}
                className="row"
                onClick={() => setSelectedParticipant(p)}
                title={`Click to view deep dive for ${p.name}`}
              >
                <span>
                  <span className="rk">#{p.rank}</span>
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
                    {isRank4 ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
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

          {filteredRest.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: '0.85rem' }}>
              No contenders match your search filter.
            </div>
          )}
        </div>

        <div className="foot">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 11v6M12 7v1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span id="showing">
            Showing ranks 4 through {Math.min(filteredRest.length + 3, participants.length)} of {participants.length}
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
