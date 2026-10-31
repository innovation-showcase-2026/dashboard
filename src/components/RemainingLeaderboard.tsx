import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronRight, 
  Trophy, 
  BarChart2, 
  Store, 
  Info, 
  Star 
} from 'lucide-react';
import { Participant } from '../types';

interface RemainingLeaderboardProps {
  participants: Participant[];
  onSelectParticipant: (participant: Participant) => void;
}

export const RemainingLeaderboard: React.FC<RemainingLeaderboardProps> = ({
  participants,
  onSelectParticipant
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrizeOnly, setFilterPrizeOnly] = useState(false);

  // Extract ranks 4 to 15 (next members)
  const remainingContenders = useMemo(() => {
    return participants.slice(3, 15);
  }, [participants]);

  const filteredContenders = useMemo(() => {
    return remainingContenders.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.entId.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.lob.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const isPrize =
        p.isPrizeEligible || (p.totalTestsAppeared && p.totalTestsAppeared >= 4);

      if (filterPrizeOnly && !isPrize) return false;
      return matchesSearch;
    });
  }, [remainingContenders, searchQuery, filterPrizeOnly]);

  const getInitials = (name?: string) => {
    if (!name) return 'WF';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Pastel themes exactly matching the screenshot avatars
  const avatarThemes = [
    { bg: '#FEE2E2', text: '#DC2626' }, // #4 SA Pink/Red
    { bg: '#FEF3C7', text: '#D97706' }, // #5 RB Amber
    { bg: '#EFF6FF', text: '#2563EB' }, // #6 SA Blue
    { bg: '#ECFDF5', text: '#059669' }, // #7 LA Mint/Green
    { bg: '#F3E8FF', text: '#9333EA' }, // #8 SS Purple
    { bg: '#FFEDD5', text: '#EA580C' }  // #9 PN Orange
  ];

  const totalCount = participants.length || 9;
  const activeCount = remainingContenders.length;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 22,
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 30px rgba(79, 70, 229, 0.05), 0 2px 6px rgba(0, 0, 0, 0.02)',
        padding: '22px 24px 18px 24px',
        overflow: 'hidden'
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          marginBottom: 16
        }}
      >
        {/* Left: Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
            }}
          >
            <BarChart2 size={20} color="#FFFFFF" />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.22rem',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.15
              }}
            >
              Leaderboard Contenders
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                Ranks 4 – 15
              </span>
              <span style={{ color: '#94A3B8' }}>•</span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  display: 'inline-block'
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                {activeCount} active
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search Filter & Prize Ready Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={15}
              color="#94A3B8"
              style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter names..."
              style={{
                padding: '8px 14px 8px 36px',
                borderRadius: 24,
                border: '1px solid #E2E8F0',
                fontSize: '0.82rem',
                color: '#0F172A',
                outline: 'none',
                width: 200,
                background: '#F8FAFC',
                fontWeight: 500
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366F1';
                e.target.style.background = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2E8F0';
                e.target.style.background = '#F8FAFC';
              }}
            />
          </div>

          {/* Prize Ready Button */}
          <button
            onClick={() => setFilterPrizeOnly((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: filterPrizeOnly
                ? 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)'
                : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              border: 'none',
              borderRadius: 24,
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Trophy size={15} color="#FFFFFF" />
            <span>Prize Ready</span>
          </button>
        </div>
      </div>

      {/* ================= TABLE HEADER ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60px minmax(200px, 1.8fr) minmax(140px, 1fr) 110px 30px',
          padding: '10px 16px',
          background: '#F8FAFC',
          borderRadius: 12,
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#1E293B',
          letterSpacing: '0.02em',
          marginBottom: 6
        }}
      >
        <div>#</div>
        <div>Contender</div>
        <div style={{ textAlign: 'center' }}>Booths & Accuracy</div>
        <div style={{ textAlign: 'right' }}>Points</div>
        <div />
      </div>

      {/* ================= TABLE ROWS ================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filteredContenders.map((participant, index) => {
          const rank = participant.rank || index + 4;
          const theme = avatarThemes[index % avatarThemes.length];

          return (
            <div
              key={participant.id || participant.entId || index}
              onClick={() => onSelectParticipant(participant)}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px minmax(200px, 1.8fr) minmax(140px, 1fr) 110px 30px',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 12,
                background: '#FFFFFF',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#EEF2F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {/* Rank Column */}
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: '#0F172A'
                }}
              >
                #{rank}
              </div>

              {/* Contender Column: Avatar + Name + LOB */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: theme.bg,
                    color: theme.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}
                >
                  {getInitials(participant.name)}
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={participant.name}
                  >
                    {participant.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: '#64748B',
                      marginTop: 2
                    }}
                  >
                    {participant.lob || 'Technology'}
                  </div>
                </div>
              </div>

              {/* Booths & Accuracy Column */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155'
                  }}
                >
                  <Store size={15} color="#3B82F6" />
                  <span>{participant.totalTestsAppeared || 1}/4</span>
                </div>

                <div
                  style={{
                    background: '#EFF6FF',
                    color: '#2563EB',
                    borderRadius: 8,
                    padding: '3px 9px',
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}
                >
                  {participant.overallAccuracy}%
                </div>
              </div>

              {/* Points Column */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    background: '#FFEDD5',
                    color: '#C2410C',
                    borderRadius: 14,
                    padding: '4px 14px',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    minWidth: 54
                  }}
                >
                  {participant.totalScore} {participant.totalScore === 1 ? 'pt' : 'pts'}
                </div>
              </div>

              {/* Right Chevron */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        {/* Left: Showing ranks note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Info size={11} color="#FFFFFF" strokeWidth={3} />
          </div>
          <span>
            Showing ranks 4 through {Math.min(15, totalCount)} of {totalCount}
          </span>
        </div>

        {/* Right: Prize Drawing Milestone Pill */}
        <div
          style={{
            background: '#FAF5FF',
            border: '1px solid #E9D5FF',
            borderRadius: 20,
            padding: '5px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            color: '#7E22CE',
            fontWeight: 800
          }}
        >
          <Star size={14} fill="#FACC15" color="#EAB308" />
          <span>4 booths to qualify for Prize Drawing</span>
        </div>
      </div>
    </div>
  );
};
