import React from 'react';
import { Trophy, Award, Sparkles, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { Participant } from '../types';
import confetti from 'canvas-confetti';

interface PrizeSpotlightProps {
  prizeWinners: Participant[];
  onSelectParticipant: (participant: Participant) => void;
}

export const PrizeSpotlight: React.FC<PrizeSpotlightProps> = ({
  prizeWinners,
  onSelectParticipant
}) => {
  const handleCelebrate = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#269E9B', '#10B981', '#FFFFFF', '#D71E28']
    });
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: "🥇", label: "Grand Champion", border: "rgba(245, 158, 11, 0.7)", glow: "var(--shadow-glow-gold)" };
    if (rank === 2) return { emoji: "🥈", label: "1st Runner Up", border: "rgba(203, 213, 225, 0.6)", glow: "0 0 16px rgba(203, 213, 225, 0.3)" };
    if (rank === 3) return { emoji: "🥉", label: "2nd Runner Up", border: "rgba(217, 119, 6, 0.5)", glow: "0 0 14px rgba(217, 119, 6, 0.25)" };
    return { emoji: "🎖️", label: `Rank #${rank}`, border: "rgba(38, 158, 155, 0.4)", glow: "none" };
  };

  if (prizeWinners.length === 0) {
    return (
      <div className="glass-card" style={{
        padding: '32px',
        textAlign: 'center',
        marginBottom: 28,
        border: '1px dashed var(--wf-navy-border)'
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: 'rgba(217, 119, 6, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px auto',
          border: '1px solid rgba(217, 119, 6, 0.25)'
        }}>
          <Trophy size={28} color="var(--wf-gold-bright)" />
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          color: '#FFFFFF',
          marginBottom: 6
        }}>
          Prize Eligibility In Progress
        </h3>
        <p style={{
          color: 'var(--wf-slate-400)',
          fontSize: '0.88rem',
          maxWidth: 480,
          margin: '0 auto'
        }}>
          Participants qualify for the Innovation Showcase 2026 Executive Prize Drawing as soon as they complete <strong>4 or more booths</strong>.
        </p>
      </div>
    );
  }

  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={18} color="var(--wf-gold-bright)" />
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0
            }}>
              Prize Winners Spotlight (Completed ≥ 4 Booths)
            </h2>
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--wf-slate-400)',
              margin: '2px 0 0 0'
            }}>
              {prizeWinners.length} Elite attendee{prizeWinners.length > 1 ? 's' : ''} have unlocked executive prize drawing eligibility
            </p>
          </div>
        </div>

        <button
          onClick={handleCelebrate}
          className="btn-secondary"
          style={{
            borderColor: 'var(--wf-gold)',
            color: 'var(--wf-gold-bright)',
            fontSize: '0.82rem'
          }}
        >
          <Sparkles size={16} />
          <span>Celebrate Qualified Achievers</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 18
      }}>
        {prizeWinners.map((winner, idx) => {
          const rank = winner.rank || idx + 1;
          const badge = getRankBadge(rank);
          const testsCount = winner.totalTestsAppeared;

          return (
            <div
              key={winner.id || winner.entId}
              className="glass-card"
              onClick={() => onSelectParticipant(winner)}
              style={{
                padding: '20px 22px',
                border: `1px solid ${badge.border}`,
                boxShadow: badge.glow !== 'none' ? badge.glow : undefined,
                background: rank <= 3 
                  ? 'linear-gradient(145deg, rgba(24, 44, 70, 0.9) 0%, rgba(35, 30, 20, 0.75) 100%)' 
                  : 'rgba(24, 44, 70, 0.8)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Header inside card */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 14
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{badge.emoji}</span>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0
                    }}>
                      {winner.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.76rem',
                        color: 'var(--wf-teal-light)',
                        background: 'rgba(38, 158, 155, 0.15)',
                        padding: '1px 6px',
                        borderRadius: 4
                      }}>
                        {winner.entId}
                      </span>
                      <span style={{
                        fontSize: '0.74rem',
                        color: 'var(--wf-slate-400)'
                      }}>
                        {winner.lob}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(217, 119, 6, 0.15)',
                  border: '1px solid rgba(217, 119, 6, 0.35)',
                  color: 'var(--wf-gold-bright)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 12,
                  textTransform: 'uppercase'
                }}>
                  {badge.label}
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1.2fr',
                gap: 8,
                background: 'rgba(11, 25, 44, 0.6)',
                padding: '12px',
                borderRadius: 10,
                border: '1px solid rgba(35, 62, 98, 0.5)',
                marginBottom: 14
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--wf-slate-400)', textTransform: 'uppercase' }}>
                    Score
                  </span>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }}>
                    {winner.totalScore}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--wf-slate-400)', textTransform: 'uppercase' }}>
                    Accuracy
                  </span>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#10B981'
                  }}>
                    {winner.overallAccuracy}%
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--wf-slate-400)', textTransform: 'uppercase' }}>
                    Booths Conquered
                  </span>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--wf-gold-bright)'
                  }}>
                    {testsCount} / 9
                  </div>
                </div>
              </div>

              {/* Visual Booth Pills */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {winner.tests && winner.tests.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      title={`${t.boothTitle}: ${t.score} pts (${t.percentage}%)`}
                      style={{
                        background: 'rgba(38, 158, 155, 0.2)',
                        border: '1px solid rgba(38, 158, 155, 0.4)',
                        color: 'var(--wf-teal-light)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4
                      }}
                    >
                      B{t.boothNumber}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.75rem',
                  color: 'var(--wf-teal-light)',
                  fontWeight: 600
                }}>
                  <span>Details</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
