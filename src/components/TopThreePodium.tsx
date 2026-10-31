import React from 'react';
import { Crown, Trophy, Users, Store, Target } from 'lucide-react';
import { Participant } from '../types';

interface TopThreePodiumProps {
  participants: Participant[];
  onSelectParticipant?: (participant: Participant) => void;
}

/* ── Helper: Glossy 3D Pedestal Block ── */
const GlossyPedestal: React.FC<{
  height: number;
  gradient: string;
  highlightColor: string;
  plaqueText: string;
  plaqueBg: string;
  plaqueColor: string;
  glowColor: string;
  children: React.ReactNode;
}> = ({ height, gradient, highlightColor, plaqueText, plaqueBg, plaqueColor, glowColor, children }) => (
  <div
    style={{
      width: '100%',
      height,
      background: gradient,
      borderRadius: '14px 14px 6px 6px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '14px 8px 10px 8px',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.5),
        0 0 30px ${glowColor},
        inset 0 2px 0 ${highlightColor}
      `,
      border: `1px solid ${highlightColor}`
    }}
  >
    {/* Glossy top highlight bar — the key "shine" effect */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: `linear-gradient(180deg, ${highlightColor} 0%, transparent 100%)`,
        borderRadius: '14px 14px 0 0'
      }}
    />
    {/* Diagonal shimmer sweep — adds the "glossy" moving light feel */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        borderRadius: '14px 14px 6px 6px',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40%',
          height: '100%',
          background: `linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`,
          animation: 'shimmerSlide 4s ease-in-out infinite'
        }}
      />
    </div>
    {/* Vertical side highlight (left edge reflection) */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 3,
        height: '100%',
        background: `linear-gradient(180deg, ${highlightColor} 0%, transparent 60%)`,
        opacity: 0.7
      }}
    />

    {/* Content */}
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, justifyContent: 'space-between', width: '100%' }}>
      {children}

      {/* Plaque button at bottom */}
      <div
        style={{
          background: plaqueBg,
          borderRadius: 14,
          padding: '5px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.6)',
          marginTop: 'auto'
        }}
      >
        <Trophy size={11} color={plaqueColor} />
        <span style={{ fontSize: '0.68rem', fontWeight: 900, color: plaqueColor, letterSpacing: '0.04em' }}>
          {plaqueText}
        </span>
      </div>
    </div>
  </div>
);


export const TopThreePodium: React.FC<TopThreePodiumProps> = ({
  participants,
  onSelectParticipant
}) => {
  const first = participants[0];
  const second = participants[1];
  const third = participants[2];

  const getInitials = (name?: string, fallback: string = '??') => {
    if (!name) return fallback;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const totalContenders = participants.length;
  const maxBooths = participants.reduce((m, p) => Math.max(m, p.totalTestsAppeared || 0), 0);
  const topAccuracy = participants.length > 0 ? `${participants[0]?.overallAccuracy || 0}%` : '0%';

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #2A1B6B 0%, #130D3A 40%, #0A0620 70%, #06041A 100%)',
        borderRadius: 24,
        padding: '22px 24px 0 24px',
        color: '#FFFFFF',
        boxShadow: '0 20px 60px rgba(10, 6, 32, 0.6)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
        border: '1px solid rgba(139, 92, 246, 0.25)'
      }}
    >
      {/* ─── ATMOSPHERIC EFFECTS ─── */}

      {/* Top purple/blue atmospheric glow */}
      <div style={{ position: 'absolute', top: -60, left: '20%', width: '60%', height: 180, background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Wide cyan floor arc light */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Smaller warm gold floor glow under podiums */}
      <div style={{ position: 'absolute', bottom: 0, left: '25%', width: '50%', height: 70, background: 'radial-gradient(ellipse at 50% 100%, rgba(245, 158, 11, 0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Floating golden confetti pieces */}
      <div style={{ position: 'absolute', top: 30, left: '58%', width: 20, height: 8, background: '#FBBF24', borderRadius: 2, transform: 'rotate(-30deg)', opacity: 0.8, animation: 'confettiFall1 3s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 50, right: '25%', width: 8, height: 16, background: '#F59E0B', borderRadius: 2, transform: 'rotate(20deg)', opacity: 0.7, animation: 'confettiFall2 4s ease-in-out infinite 0.5s', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 25, left: '32%', width: 6, height: 14, background: '#FDE047', borderRadius: 2, transform: 'rotate(45deg)', opacity: 0.6, animation: 'confettiFall2 3.5s ease-in-out infinite 1s', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 60, left: '72%', width: 12, height: 5, background: '#FBBF24', borderRadius: 2, transform: 'rotate(-15deg)', opacity: 0.7, animation: 'confettiFall1 4.5s ease-in-out infinite 0.8s', pointerEvents: 'none' }} />

      {/* Curved golden ribbon (top right) */}
      <div style={{ position: 'absolute', top: 35, right: '22%', width: 30, height: 18, border: '3px solid #F59E0B', borderTop: 'none', borderRight: 'none', borderRadius: '0 0 0 18px', transform: 'rotate(-30deg)', opacity: 0.75, pointerEvents: 'none' }} />
      {/* Second ribbon (left side) */}
      <div style={{ position: 'absolute', top: 55, left: '18%', width: 22, height: 14, border: '3px solid #FBBF24', borderBottom: 'none', borderLeft: 'none', borderRadius: '0 14px 0 0', transform: 'rotate(20deg)', opacity: 0.6, pointerEvents: 'none' }} />


      {/* ─── MAIN GRID: Left branding | Center podium | Right overview ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(170px, 1fr) minmax(380px, 2.2fr) minmax(155px, 0.85fr)',
          alignItems: 'start',
          gap: 16,
          position: 'relative',
          zIndex: 2,
          paddingBottom: 10
        }}
      >
        {/* ══════════ LEFT: Trophy & Header ══════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.12) 100%)',
              border: '1.5px solid rgba(253,224,71,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 28px rgba(245,158,11,0.35)'
            }}
          >
            <Trophy size={30} color="#FACC15" />
          </div>

          <div>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#FBBF24', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 3 }}>
              WELLS FARGO INNOVATION SHOWCASE
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em', margin: 0, lineHeight: 1.15 }}>
              Top Contenders Podium
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', margin: '5px 0 0 0', fontWeight: 500, fontStyle: 'italic' }}>
              Innovation. Skill. Excellence.
            </p>
          </div>
        </div>


        {/* ══════════ CENTER: The 3D Glossy Podium ══════════ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr 1fr',
            alignItems: 'end',
            gap: 10,
            paddingBottom: 20
          }}
        >
          {/* ── 2ND PLACE (LEFT) ── */}
          <div
            onClick={() => second && onSelectParticipant?.(second)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: second ? 'pointer' : 'default', transition: 'transform 0.2s', transform: 'translateY(16px)' }}
            onMouseEnter={e => { if (second) e.currentTarget.style.transform = 'translateY(12px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(16px)'; }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', marginBottom: 6 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #818CF8 0%, #4338CA 100%)', padding: 2, boxShadow: '0 0 18px rgba(129,140,248,0.6)' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0C0A20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900 }}>
                  {second ? getInitials(second.name) : 'MA'}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', background: '#1E1B4B', border: '1.5px solid #818CF8', color: '#FFFFFF', borderRadius: 8, padding: '1px 7px', fontSize: '0.64rem', fontWeight: 900, whiteSpace: 'nowrap' as const }}>
                #2
              </div>
            </div>

            {/* GLOSSY PEDESTAL */}
            <GlossyPedestal
              height={135}
              gradient="linear-gradient(180deg, #5B4A1E 0%, #3D2E0A 30%, #2A1F08 60%, #1C1605 100%)"
              highlightColor="rgba(253, 224, 71, 0.5)"
              plaqueText="2ND PLACE"
              plaqueBg="linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%)"
              plaqueColor="#0F172A"
              glowColor="rgba(99, 102, 241, 0.2)"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 3 }} title={second?.name}>
                  {second ? second.name : 'Manikumar'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {second ? `${second.totalScore} pts` : '4 pts'}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
                  {second ? `${second.totalTestsAppeared} Booths • ${second.overallAccuracy}% Acc` : '2 Booths • 40% Acc'}
                </div>
              </div>
            </GlossyPedestal>
          </div>

          {/* ── 1ST PLACE (CENTER — TALLEST) ── */}
          <div
            onClick={() => first && onSelectParticipant?.(first)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: first ? 'pointer' : 'default', transition: 'transform 0.2s', zIndex: 4 }}
            onMouseEnter={e => { if (first) e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Crown */}
            <div style={{ animation: 'crownFloat 2.5s ease-in-out infinite', marginBottom: -4, filter: 'drop-shadow(0 0 12px rgba(250,204,21,0.9))' }}>
              <Crown size={30} color="#FEF08A" fill="#FACC15" />
            </div>

            {/* Avatar */}
            <div style={{ position: 'relative', marginBottom: 6 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 50%, #B45309 100%)', padding: 3, boxShadow: '0 0 30px rgba(245,158,11,0.7), 0 0 60px rgba(250,204,21,0.3)', animation: 'glowPulse 3s ease-in-out infinite' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0C0A20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900 }}>
                  {first ? getInitials(first.name) : 'CJ'}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 100%)', color: '#451A03', borderRadius: 10, padding: '2px 8px', fontSize: '0.66rem', fontWeight: 900, whiteSpace: 'nowrap' as const, boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1.5px solid #FFFBEB' }}>
                #1 • 1ST
              </div>
            </div>

            {/* GLOSSY PEDESTAL (TALLEST) */}
            <GlossyPedestal
              height={170}
              gradient="linear-gradient(180deg, #8B6914 0%, #6B4E0A 20%, #4A3508 45%, #2C1F04 70%, #1A1303 100%)"
              highlightColor="rgba(253, 224, 71, 0.7)"
              plaqueText="★ 1ST PLACE ★"
              plaqueBg="linear-gradient(180deg, #FDE047 0%, #EAB308 100%)"
              plaqueColor="#451A03"
              glowColor="rgba(245, 158, 11, 0.35)"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.96rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 4 }} title={first?.name}>
                  {first ? first.name : 'Chandra Javalkar'}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FACC15', textShadow: '0 0 16px rgba(250,204,21,0.5)', lineHeight: 1.1 }}>
                  {first ? `${first.totalScore} Points` : '7 Points'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#FDE68A', marginTop: 4, fontWeight: 600 }}>
                  {first ? `${first.totalTestsAppeared} Booths • ${first.overallAccuracy}% Acc` : '4 Booths • 35% Acc'}
                </div>
              </div>
            </GlossyPedestal>
          </div>

          {/* ── 3RD PLACE (RIGHT) ── */}
          <div
            onClick={() => third && onSelectParticipant?.(third)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: third ? 'pointer' : 'default', transition: 'transform 0.2s', transform: 'translateY(22px)' }}
            onMouseEnter={e => { if (third) e.currentTarget.style.transform = 'translateY(18px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(22px)'; }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', marginBottom: 6 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #FB923C 0%, #C2410C 100%)', padding: 2, boxShadow: '0 0 18px rgba(251,146,60,0.5)' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0C0A20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 900 }}>
                  {third ? getInitials(third.name) : 'SA'}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', background: '#1E1B4B', border: '1.5px solid #FB923C', color: '#FFFFFF', borderRadius: 8, padding: '1px 7px', fontSize: '0.64rem', fontWeight: 900, whiteSpace: 'nowrap' as const }}>
                #3
              </div>
            </div>

            {/* GLOSSY PEDESTAL */}
            <GlossyPedestal
              height={115}
              gradient="linear-gradient(180deg, #5B4A1E 0%, #3D2E0A 30%, #2A1F08 60%, #1C1605 100%)"
              highlightColor="rgba(253, 224, 71, 0.5)"
              plaqueText="3RD PLACE"
              plaqueBg="linear-gradient(180deg, #FDBA74 0%, #EA580C 100%)"
              plaqueColor="#FFFFFF"
              glowColor="rgba(234, 88, 12, 0.2)"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 3 }} title={third?.name}>
                  {third ? third.name : 'Satya'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {third ? `${third.totalScore} pts` : '4 pts'}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
                  {third ? `${third.totalTestsAppeared} Booths • ${third.overallAccuracy}% Acc` : '2 Booths • 40% Acc'}
                </div>
              </div>
            </GlossyPedestal>
          </div>
        </div>


        {/* ══════════ RIGHT: Contest Overview ══════════ */}
        <div
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: 18,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            marginTop: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="5" width="4" height="16" rx="1"/><rect x="17" y="9" width="4" height="12" rx="1"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>Contest Overview</span>
          </div>

          {/* Total Contenders */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={17} color="#C084FC" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>{totalContenders}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Total Contenders</div>
            </div>
          </div>

          {/* Booths Visited */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Store size={17} color="#60A5FA" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>{maxBooths}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Booths Visited</div>
            </div>
          </div>

          {/* Top Accuracy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={17} color="#4ADE80" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>{topAccuracy}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Top Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
