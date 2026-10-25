import React from 'react';
import { 
  Users, 
  UserPlus, 
  Trophy, 
  Award, 
  ChevronRight, 
  Target
} from 'lucide-react';
import { SummitKPIs } from '../types';

interface KPICardsProps {
  kpis: SummitKPIs;
  onFilterPrizeWinners?: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, onFilterPrizeWinners }) => {
  // SVG Donut calculation for Card 4
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, kpis.averageAccuracy)) / 100) * circumference;

  // Bar heights for Card 1 histogram sparkline
  const barHeights = [18, 28, 14, 22, 34, 16, 26, 38, 20, 32, 44, 26, 18, 30, 22, 14, 10];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        marginBottom: 24
      }}
    >
      {/* Card 1: TOTAL REGISTERED ATTENDEES */}
      <div
        className="white-card"
        style={{
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 175
        }}
      >
        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={17} color="#1E293B" strokeWidth={2.4} />
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#1E293B',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                TOTAL REGISTERED ATTENDEES
              </span>
            </div>

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#FDF1F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserPlus size={16} color="#D71E28" strokeWidth={2.2} />
            </div>
          </div>

          {/* Value & Histogram Bar Sparkline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                fontWeight: 900,
                color: '#1E293B',
                lineHeight: 1
              }}
            >
              {kpis.totalRegistered}
            </span>

            {/* Red Histogram Waveform Sparkline */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 44, paddingTop: 4 }}>
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3.5,
                    height: `${h}px`,
                    backgroundColor: i === 10 ? '#D71E28' : 'rgba(215, 30, 40, 0.45)',
                    borderRadius: 2
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
          Enterprise participants registered in the summit session
        </p>
      </div>

      {/* Card 2: TOTAL BOOTH SUBMISSIONS (Dark Crimson Gradient Card) */}
      <div
        style={{
          borderRadius: 16,
          background: 'radial-gradient(ellipse at 85% 15%, rgba(215, 30, 40, 0.4) 0%, rgba(116, 12, 21, 0.98) 60%, #580309 100%)',
          color: '#FFFFFF',
          padding: '22px 24px',
          boxShadow: '0 4px 16px rgba(116, 12, 21, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 175,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative curved arc in background */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, zIndex: 1 }}>
          <Trophy size={17} color="#FFD700" strokeWidth={2.4} />
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}
          >
            TOTAL BOOTH SUBMISSIONS
          </span>
        </div>

        {/* Big Number & Gold Trendline Sparkline */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 1, marginBottom: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3rem',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1
            }}
          >
            {kpis.totalSubmissions}
          </span>

          {/* Golden Curved Trendline Sparkline with Nodes */}
          <div style={{ width: 140, height: 46 }}>
            <svg width="100%" height="100%" viewBox="0 0 140 46" fill="none">
              <path
                d="M 5 40 Q 30 35, 55 24 T 95 18 T 135 6"
                stroke="#FBBF24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="5" cy="40" r="3" fill="#FBBF24" />
              <circle cx="40" cy="30" r="3" fill="#FBBF24" />
              <circle cx="75" cy="20" r="3" fill="#FBBF24" />
              <circle cx="105" cy="16" r="3" fill="#FBBF24" />
              <circle cx="135" cy="6" r="4" fill="#FFFFFF" stroke="#FBBF24" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)', zIndex: 1 }}>
          Live submissions tracked across 9 booths
        </div>
      </div>

      {/* Card 3: PRIZE-ELIGIBLE ACHIEVERS */}
      <div
        className="white-card"
        onClick={onFilterPrizeWinners}
        style={{
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 175,
          cursor: onFilterPrizeWinners ? 'pointer' : 'default'
        }}
      >
        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Ribbon Medal Icon */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Award size={16} color="#D97706" strokeWidth={2.4} />
              </div>

              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#1E293B',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                PRIZE-ELIGIBLE ACHIEVERS
              </span>
            </div>

            <ChevronRight size={18} color="#94A3B8" />
          </div>

          {/* Big Number & "Eligible: 4 Booths" Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                fontWeight: 900,
                color: '#1E293B',
                lineHeight: 1
              }}
            >
              {kpis.prizeEligibleCount}
            </span>

            {/* Gold / Beige Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--wf-gold-light)',
                border: '1px solid var(--wf-gold-border)',
                color: 'var(--wf-gold-text)',
                padding: '4px 12px',
                borderRadius: 16,
                fontSize: '0.74rem',
                fontWeight: 700
              }}
            >
              <Award size={13} color="var(--wf-gold-bright)" />
              <span>Eligible: 4 Booths</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.76rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
          Participants qualify for the Innovation Showcase 2026 Executive Prize Drawing as soon as they complete 4 or more booths.
        </p>
      </div>

      {/* Card 4: SUMMIT AVERAGE ACCURACY (With Radial Gauge) */}
      <div
        className="white-card"
        style={{
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 175
        }}
      >
        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Target size={17} color="#D71E28" strokeWidth={2.4} />
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#1E293B',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              SUMMIT AVERAGE ACCURACY
            </span>
          </div>

          {/* Big Red Number & Donut Radial Progress Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: '#D71E28',
                  lineHeight: 1
                }}
              >
                {kpis.averageAccuracy}%
              </span>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 4 }}>
                Total accumulated points: <strong>{kpis.totalScoreSum}</strong>
              </div>
            </div>

            {/* Circular Gauge */}
            <div style={{ position: 'relative', width: 78, height: 78 }}>
              <svg width="78" height="78" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="7"
                  fill="none"
                />
                {/* Red Value Arc */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#D71E28"
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center percentage label */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#1E293B'
                }}
              >
                {kpis.averageAccuracy}%
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>
          Accuracy calculated across all submitted questions
        </div>
      </div>
    </div>
  );
};
