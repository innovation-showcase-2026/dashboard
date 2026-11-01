import React, { useEffect } from 'react';
import { X, Trophy, Clock, ExternalLink, Award, User, Target, CheckCircle } from 'lucide-react';
import { Participant } from '../types';
import { getSlotUrl } from '../services/participants';

interface SlotRecordsModalProps {
  slot: string;
  participants: Participant[];
  onClose: () => void;
  onSelectParticipant?: (participant: Participant) => void;
}

const pastel: [string, string][] = [
  ['#fbcfe8', '#9d174d'],
  ['#fed7aa', '#9a3412'],
  ['#bfdbfe', '#1e40af'],
  ['#a7f3d0', '#065f46'],
  ['#ddd6fe', '#5b21b6'],
  ['#fecaca', '#991b1b']
];

const getInitials = (name?: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
};

export const SlotRecordsModal: React.FC<SlotRecordsModalProps> = ({
  slot,
  participants,
  onClose,
  onSelectParticipant
}) => {
  const code = slot.replace(':', '');
  const slotUrl = getSlotUrl(code);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const topScorer = participants[0];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        className="white-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* ── Modal Header ── */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: participants.length > 0
                  ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
                  : 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                border: participants.length > 0 ? '1.5px solid #F59E0B' : '1.5px solid #818CF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: participants.length > 0 ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none'
              }}
            >
              {participants.length > 0 ? (
                <Trophy size={24} color="#D97706" />
              ) : (
                <Clock size={24} color="#4F46E5" />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#FFFFFF',
                    padding: '2px 9px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em'
                  }}
                >
                  🕒 {slot} Slot
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#0F172A'
                  }}
                >
                  Leaderboard Records
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    padding: '2px 8px',
                    borderRadius: 10
                  }}
                >
                  {participants.length} {participants.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.78rem',
                  color: '#64748B',
                  fontWeight: 500
                }}
              >
                Displaying all contenders fetched from{' '}
                <a
                  href={slotUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}
                >
                  {code}.json ↗
                </a>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={slotUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.74rem',
                color: '#4F46E5',
                textDecoration: 'none',
                background: '#EEF2FF',
                border: '1px solid #C7D2FE',
                padding: '6px 12px',
                borderRadius: 8,
                fontWeight: 700
              }}
              title="Open raw JSON file in new tab"
            >
              <span>Raw JSON</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={onClose}
              style={{
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0F172A';
                e.currentTarget.style.background = '#E2E8F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748B';
                e.currentTarget.style.background = '#F1F5F9';
              }}
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Summary Stats Pills (if records exist) ── */}
        {participants.length > 0 && (
          <div
            style={{
              padding: '12px 24px',
              background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              fontSize: '0.8rem',
              color: '#334155'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Top Contender:</span>
              <strong style={{ color: '#0F172A' }}>{topScorer?.name || '--'}</strong>
            </div>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Top Score:</span>
              <strong style={{ color: '#059669' }}>{topScorer?.totalScore ?? 0} pts</strong>
            </div>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Top Accuracy:</span>
              <strong style={{ color: '#2563EB' }}>{topScorer?.overallAccuracy ?? 0}%</strong>
            </div>
            {topScorer?.completionTime && (
              <>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Fastest Finish:</span>
                  <strong style={{ color: '#C2410C' }}>
                    ⏱ {topScorer.completionTime}
                    {topScorer.totalTimeSeconds ? ` (${topScorer.totalTimeSeconds}s)` : ''}
                  </strong>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Modal Content: Table of All Records from JSON ── */}
        <div
          style={{
            padding: '16px 24px',
            overflowY: 'auto',
            flexGrow: 1
          }}
        >
          {participants.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '2px solid #E2E8F0',
                      color: '#475569',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <th style={{ padding: '10px 12px', width: 60 }}># Rank</th>
                    <th style={{ padding: '10px 12px' }}>Contender</th>
                    <th style={{ padding: '10px 12px' }}>Booths Visited &amp; Scores</th>
                    <th style={{ padding: '10px 12px' }}>Accuracy</th>
                    <th style={{ padding: '10px 12px' }}>Time</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Points</th>
                    <th style={{ padding: '10px 12px', width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, idx) => {
                    const rank = p.rank || idx + 1;
                    const c = pastel[(rank - 1) % pastel.length];
                    const isRank1 = rank === 1;
                    const isRank2 = rank === 2;
                    const isRank3 = rank === 3;
                    const tests = p.tests || [];

                    return (
                      <tr
                        key={p.entId || p.id || p.name + idx}
                        onClick={() => {
                          onClose();
                          onSelectParticipant?.(p);
                        }}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        title={`Click to view booth details for ${p.name}`}
                      >
                        {/* Rank */}
                        <td style={{ padding: '14px 12px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: 12,
                              fontSize: '0.76rem',
                              fontWeight: 900,
                              background: isRank1
                                ? '#FEF3C7'
                                : isRank2
                                ? '#F1F5F9'
                                : isRank3
                                ? '#FFEDD5'
                                : '#EEF2FF',
                              border: isRank1
                                ? '1.5px solid #F59E0B'
                                : isRank2
                                ? '1.5px solid #CBD5E1'
                                : isRank3
                                ? '1.5px solid #FDBA74'
                                : '1px solid #C7D2FE',
                              color: isRank1
                                ? '#92400E'
                                : isRank2
                                ? '#334155'
                                : isRank3
                                ? '#9A3412'
                                : '#312E81'
                            }}
                          >
                            #{rank} {isRank1 ? '🥇' : isRank2 ? '🥈' : isRank3 ? '🥉' : ''}
                          </span>
                        </td>

                        {/* Contender Name & LOB */}
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                background: c[0],
                                color: c[1],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                flexShrink: 0,
                                border: '1.5px solid #FFFFFF',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                              }}
                            >
                              {getInitials(p.name)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                                {p.lob || 'Technology'}
                                {p.entId ? ` • ${p.entId}` : p.email ? ` • ${p.email}` : ''}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Booths Visited & Scores Breakdown */}
                        <td style={{ padding: '14px 12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <span
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  color: '#0F172A'
                                }}
                              >
                                {p.totalTestsAppeared} of 4 Booths
                              </span>
                              {p.isPrizeEligible && (
                                <span
                                  style={{
                                    fontSize: '0.64rem',
                                    fontWeight: 800,
                                    background: '#FEF3C7',
                                    color: '#B45309',
                                    padding: '1px 6px',
                                    borderRadius: 8,
                                    border: '1px solid #FCD34D'
                                  }}
                                >
                                  🏆 Prize Ready
                                </span>
                              )}
                            </div>

                            {/* Mini booth score pills */}
                            {tests.length > 0 && (
                              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {tests.map((t, tidx) => (
                                  <span
                                    key={tidx}
                                    style={{
                                      fontSize: '0.64rem',
                                      padding: '1px 5px',
                                      borderRadius: 4,
                                      background: '#F1F5F9',
                                      border: '1px solid #E2E8F0',
                                      color: '#334155',
                                      fontWeight: 600
                                    }}
                                    title={`Booth ${t.boothNumber || tidx + 1}: ${t.boothTitle} (${t.score}/${t.totalQuestions} pts • ${t.percentage}%)`}
                                  >
                                    B{t.boothNumber || tidx + 1}: <strong>{t.score}/{t.totalQuestions}</strong>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Overall Accuracy */}
                        <td style={{ padding: '14px 12px' }}>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              color: '#2563EB',
                              background: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              padding: '2px 8px',
                              borderRadius: 10
                            }}
                          >
                            {p.overallAccuracy}%
                          </span>
                        </td>

                        {/* Time */}
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
                            {p.completionTime ? (
                              <span style={{ color: '#C2410C', fontWeight: 700 }}>
                                ⏱ {p.completionTime}
                              </span>
                            ) : p.totalTimeSeconds ? (
                              <span>{p.totalTimeSeconds}s</span>
                            ) : (
                              <span style={{ color: '#94A3B8' }}>--</span>
                            )}
                          </div>
                        </td>

                        {/* Total Score */}
                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: 12,
                              fontSize: '0.84rem',
                              fontWeight: 900,
                              background: '#ECFDF5',
                              border: '1px solid #A7F3D0',
                              color: '#065F46'
                            }}
                          >
                            {p.totalScore} {p.totalScore === 1 ? 'pt' : 'pts'}
                          </span>
                        </td>

                        {/* Chevron action */}
                        <td style={{ padding: '14px 12px', textAlign: 'right', color: '#94A3B8' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800 }}>›</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                color: '#64748B'
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  color: '#94A3B8'
                }}
              >
                <Clock size={28} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
                No Records in {slot} Slot Yet
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B', maxWidth: 440, marginInline: 'auto' }}>
                As attendees complete their quiz booths for the {slot} window, their results will be synced to{' '}
                <code>{code}.json</code> and displayed here automatically.
              </p>
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
            Showing <strong>{participants.length}</strong> record{participants.length === 1 ? '' : 's'} from{' '}
            <strong>{code}.json</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 18px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
