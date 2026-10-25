import React from 'react';
import { Trophy, Crown, User } from 'lucide-react';
import { Participant } from '../types';

interface WinnersHeroProps {
  topParticipants: Participant[];
  onSelectParticipant?: (participant: Participant) => void;
}

export const WinnersHero: React.FC<WinnersHeroProps> = ({
  topParticipants,
  onSelectParticipant
}) => {
  // Extract top 3 or default display
  const first = topParticipants[0];
  const second = topParticipants[1];
  const third = topParticipants[2];

  const getInitials = (name?: string, fallback: string = 'WF') => {
    if (!name) return fallback;
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const p1Initials = first ? getInitials(first.name, 'UB') : 'UB';
  const p2Initials = second ? getInitials(second.name, 'JM') : 'JM';

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 24,
        background: 'radial-gradient(ellipse at 50% 15%, rgba(255, 215, 0, 0.45) 0%, rgba(185, 20, 30, 0.95) 45%, #62040C 100%)',
        boxShadow: '0 8px 24px rgba(116, 12, 21, 0.25)',
        minHeight: 220,
        padding: '24px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24
      }}
    >
      {/* Background Gold Shimmer / Confetti particles effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255, 230, 150, 0.2) 0%, transparent 20%),
            radial-gradient(circle at 80% 30%, rgba(255, 230, 150, 0.25) 0%, transparent 25%),
            radial-gradient(circle at 50% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 30%)
          `,
          opacity: 0.9
        }}
      />

      {/* Floating subtle confetti elements */}
      <div style={{ position: 'absolute', top: 18, left: 320, width: 8, height: 14, background: '#FFD700', transform: 'rotate(25deg)', borderRadius: 2, opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 38, left: 290, width: 6, height: 10, background: '#FFF', transform: 'rotate(-15deg)', borderRadius: 2, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 22, right: 380, width: 8, height: 12, background: '#FFD700', transform: 'rotate(45deg)', borderRadius: 2, opacity: 0.7 }} />
      <div style={{ position: 'absolute', bottom: 30, left: 240, width: 10, height: 6, background: '#FFC107', transform: 'rotate(10deg)', borderRadius: 2, opacity: 0.6 }} />

      {/* Left: Text & Trophy */}
      <div style={{ zIndex: 2, maxWidth: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          {/* Trophy Icon */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(217, 119, 6, 0.15) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
            }}
          >
            <Trophy size={28} color="#FFD700" strokeWidth={2.2} />
          </div>

          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}
            >
              WINNERS & LEADERS
            </h2>
            <div
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#FFDE8A',
                letterSpacing: '0.02em',
                marginTop: 2
              }}
            >
              Innovation. Impact. Together.
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: '0.84rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.45,
            margin: '8px 0 0 0'
          }}
        >
          Celebrating our top innovators driving what's next at Wells Fargo.
        </p>
      </div>

      {/* Center: 3D Winner Podium */}
      <div
        style={{
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 16,
          flex: '1 1 auto',
          maxWidth: 480,
          margin: '0 auto'
        }}
      >
        {/* 2nd Place Podium (Left, Silver) */}
        <div
          onClick={() => second && onSelectParticipant && onSelectParticipant(second)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: second ? 'pointer' : 'default',
            transform: 'translateY(12px)'
          }}
        >
          {/* Silver Medallion with Laurel */}
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #D1D5DB 45%, #9CA3AF 85%, #6B7280 100%)',
              border: '3px solid #E5E7EB',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: 8
            }}
          >
            {/* Laurel wreath ring indicator */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '2px dashed rgba(255, 255, 255, 0.7)',
                background: '#4B5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em'
                }}
              >
                {p2Initials}
              </span>
            </div>
          </div>

          {/* Silver Pedestal Cylinder */}
          <div
            style={{
              width: 98,
              height: 52,
              background: 'linear-gradient(180deg, #E5E7EB 0%, #9CA3AF 100%)',
              borderRadius: '8px 8px 4px 4px',
              border: '1px solid #D1D5DB',
              boxShadow: '0 6px 14px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2937' }}>
              2nd Place
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#4B5563' }}>
              High Score
            </span>
          </div>
        </div>

        {/* 1st Place Podium (Center, Tallest Gold) */}
        <div
          onClick={() => first && onSelectParticipant && onSelectParticipant(first)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: first ? 'pointer' : 'default',
            zIndex: 3
          }}
        >
          {/* Gold Medallion with Crown */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #FFF5C0 0%, #F59E0B 40%, #D97706 75%, #92400E 100%)',
              border: '4px solid #FDE68A',
              boxShadow: '0 10px 24px rgba(245, 158, 11, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: 8
            }}
          >
            {/* Crown Icon on top */}
            <Crown
              size={18}
              color="#FFE885"
              fill="#FFD700"
              style={{ position: 'absolute', top: 4 }}
            />

            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                border: '2px dashed rgba(255, 235, 160, 0.8)',
                background: '#451A03',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em'
                }}
              >
                {p1Initials}
              </span>
            </div>
          </div>

          {/* Gold Pedestal Cylinder (Tallest) */}
          <div
            style={{
              width: 135,
              height: 68,
              background: 'linear-gradient(180deg, #FDE68A 0%, #D97706 100%)',
              borderRadius: '10px 10px 4px 4px',
              border: '1.5px solid #FEF3C7',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px'
            }}
          >
            <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#271003' }}>
              1st Place Winner
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#451A03' }}>
              High Score
            </span>
          </div>
        </div>

        {/* 3rd Place Podium (Right, Bronze) */}
        <div
          onClick={() => third && onSelectParticipant && onSelectParticipant(third)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: third ? 'pointer' : 'default',
            transform: 'translateY(16px)'
          }}
        >
          {/* Bronze Medallion with silhouette */}
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #FDBA74 0%, #C2410C 50%, #7C2D12 100%)',
              border: '3px solid #FED7AA',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: 8
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#431407',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={26} color="#FED7AA" />
            </div>
          </div>

          {/* Bronze Pedestal Cylinder */}
          <div
            style={{
              width: 98,
              height: 48,
              background: 'linear-gradient(180deg, #FDBA74 0%, #9A3412 100%)',
              borderRadius: '8px 8px 4px 4px',
              border: '1px solid #FED7AA',
              boxShadow: '0 6px 14px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#FFFFFF' }}>
              3rd Place
            </span>
            <span style={{ fontSize: '0.66rem', fontWeight: 600, color: '#FFEDD5' }}>
              High Score
            </span>
          </div>
        </div>
      </div>

      {/* Right: Wells Fargo Stagecoach Silhouette & Slogan */}
      <div
        style={{
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
          maxWidth: 240
        }}
      >
        {/* Stagecoach horses vector silhouette in gold/amber */}
        <div style={{ opacity: 0.45, marginBottom: 8 }}>
          <svg width="150" height="48" viewBox="0 0 200 65" fill="#FFE29A">
            {/* Stylized horses galloping silhouette */}
            <path d="M185 30 C180 20, 170 18, 160 22 C155 24, 150 20, 142 25 C135 22, 130 18, 120 23 C115 25, 110 20, 100 24 L90 28 C85 22, 75 24, 70 30 L55 35 L40 32 L35 40 L20 42 L15 50 L0 52 L5 56 L30 52 L50 48 L70 54 L90 48 L110 52 L130 46 L150 50 L170 45 L190 48 L200 42 Z" />
            <circle cx="178" cy="20" r="4" />
            <circle cx="138" cy="21" r="4" />
            <circle cx="98" cy="22" r="4" />
            <circle cx="58" cy="24" r="4" />
          </svg>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.25rem',
            color: '#FFFFFF',
            lineHeight: 1.25
          }}
        >
          Ideas that
        </div>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 800,
            fontSize: '1.35rem',
            color: '#FFFFFF',
            lineHeight: 1.2
          }}
        >
          move us forward
        </div>

        {/* Red accent line */}
        <div
          style={{
            width: 38,
            height: 3,
            background: 'var(--wf-red-primary)',
            borderRadius: 2,
            marginTop: 6
          }}
        />
      </div>
    </div>
  );
};
