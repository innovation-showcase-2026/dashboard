import React from 'react';
import { 
  X, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Award,
  Sparkles
} from 'lucide-react';
import { Participant, SUMMIT_BOOTHS } from '../types';

interface AttendeeModalProps {
  participant: Participant | null;
  onClose: () => void;
}

export const AttendeeModal: React.FC<AttendeeModalProps> = ({ participant, onClose }) => {
  if (!participant) return null;

  const isPrize = participant.isPrizeEligible || (participant.totalTestsAppeared && participant.totalTestsAppeared >= 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="white-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
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
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#0F172A';
            e.currentTarget.style.background = '#E2E8F0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.background = '#F1F5F9';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: isPrize 
                ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                : 'linear-gradient(135deg, #740C15 0%, #B3141E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(0,0,0,0.15)'
            }}
          >
            {isPrize ? <Trophy size={28} color="#FFFFFF" /> : <Award size={28} color="#FFFFFF" />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0
                }}
              >
                {participant.name}
              </h2>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0F766E',
                  background: '#E6F8F3',
                  padding: '2px 8px',
                  borderRadius: 6
                }}
              >
                {participant.entId}
              </span>

              {isPrize && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#78350F',
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    padding: '2px 8px',
                    borderRadius: 12,
                    textTransform: 'uppercase'
                  }}
                >
                  <Sparkles size={12} color="#D97706" />
                  Prize Eligible
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 6,
                color: '#64748B',
                fontSize: '0.85rem',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={14} color="#740C15" />
                {participant.lob}
              </span>

              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} color="#94A3B8" />
                {participant.registeredAt ? new Date(participant.registeredAt).toLocaleDateString() : 'Active Summit'}
              </span>
            </div>
          </div>
        </div>

        {/* Aggregate Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            background: '#F8FAFC',
            padding: '16px',
            borderRadius: 14,
            border: '1px solid #E2E8F0',
            marginBottom: 26
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Rank
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
              #{participant.rank || '-'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Score
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#D97706' }}>
              {participant.totalScore}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Accuracy
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#D71E28' }}>
              {participant.overallAccuracy}%
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Booths Conquered
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
              {participant.totalTestsAppeared} / 9
            </div>
          </div>
        </div>

        {/* 9 Booth Telemetry Breakdown */}
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 14
            }}
          >
            Summit Booth Performance Telemetry (Booths 1–9)
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 12
            }}
          >
            {SUMMIT_BOOTHS.map((booth) => {
              const test = participant.tests?.find(
                (t) => t.boothNumber === booth.number || 
                       t.boothId === booth.id || 
                       (t.boothTitle && t.boothTitle.toLowerCase().includes(booth.shortTitle.toLowerCase()))
              );

              const completed = !!test;

              return (
                <div
                  key={booth.id}
                  style={{
                    background: completed ? '#FFFFFF' : '#F8FAFC',
                    border: `1.5px solid ${completed ? '#B3141E' : '#E2E8F0'}`,
                    borderRadius: 12,
                    padding: '14px',
                    boxShadow: completed ? '0 2px 8px rgba(179, 20, 30, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        color: completed ? '#B3141E' : '#94A3B8',
                        textTransform: 'uppercase'
                      }}
                    >
                      Booth {booth.number}
                    </span>

                    {completed ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 700, color: '#0F766E' }}>
                        <CheckCircle2 size={13} />
                        Completed
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                        Not Attempted
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', margin: '0 0 8px 0' }}>
                    {booth.title}
                  </h4>

                  {completed && test ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 3 }}>
                        <span style={{ color: '#64748B' }}>Score:</span>
                        <strong style={{ color: '#0F172A' }}>{test.score} pts ({test.percentage}%)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: '#64748B' }}>Time:</span>
                        <strong style={{ color: '#475569' }}>{test.timeTakenSeconds}s</strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontStyle: 'italic' }}>
                      Awaiting completion
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              fontWeight: 700,
              fontSize: '0.85rem',
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
