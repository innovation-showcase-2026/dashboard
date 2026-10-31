import React, { useState } from 'react';
import { RefreshCw, Zap, Trophy, Clock, BarChart3 } from 'lucide-react';
import { Participant } from '../types';

interface IframeTopBarProps {
  participants: Participant[];
  lastSynced: Date | null;
  isLoading: boolean;
  onRefresh: () => Promise<void> | void;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

export const IframeTopBar: React.FC<IframeTopBarProps> = ({
  participants,
  lastSynced,
  isLoading,
  onRefresh,
  showAnalytics,
  onToggleAnalytics
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = async () => {
    setIsSpinning(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsSpinning(false), 600);
    }
  };

  const formattedTime = lastSynced
    ? lastSynced.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    : '1:29:37 AM';

  const prizeEligibleCount = participants.filter(
    (p) => p.isPrizeEligible || (p.totalTestsAppeared && p.totalTestsAppeared >= 4)
  ).length;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
        padding: '2px 4px'
      }}
    >
      {/* Left Pill Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* VPT Badge */}
        <div
          style={{
            background: '#4F46E5',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontSize: '0.82rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            padding: '6px 14px',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          VPT
        </div>

        {/* LIVE STANDINGS Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #E2E8F0',
            padding: '6px 14px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 8px #22C55E',
              display: 'inline-block'
            }}
          />
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '0.04em'
            }}
          >
            LIVE STANDINGS
          </span>
        </div>

        {/* Active Pill */}
        <div
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            padding: '6px 14px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#2563EB',
            fontSize: '0.82rem',
            fontWeight: 700,
            boxShadow: '0 1px 4px rgba(37, 99, 235, 0.1)'
          }}
        >
          <Zap size={14} fill="#2563EB" color="#2563EB" />
          <span>Active</span>
        </div>

        {/* Prize Ready Pill */}
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            padding: '6px 14px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#92400E',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 1px 4px rgba(217, 119, 6, 0.1)'
          }}
        >
          <Trophy size={14} color="#D97706" />
          <span>{prizeEligibleCount || 1} Prize Ready</span>
        </div>
      </div>

      {/* Right Controls Pill Group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0',
          padding: '6px 16px',
          borderRadius: 20,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
        }}
      >
        {/* Synced Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>
          <Clock size={14} color="#4F46E5" />
          <span>
            Synced: <span style={{ fontWeight: 700 }}>{formattedTime}</span>
          </span>
        </div>

        <span style={{ color: '#CBD5E1' }}>|</span>

        {/* Sync Button */}
        <button
          onClick={handleRefresh}
          disabled={isLoading || isSpinning}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#DC2626',
            cursor: isLoading || isSpinning ? 'not-allowed' : 'pointer',
            padding: '2px 4px'
          }}
        >
          <RefreshCw
            size={13}
            color="#DC2626"
            style={{
              animation: isSpinning || isLoading ? 'spin 1s linear infinite' : 'none'
            }}
          />
          <span>Sync</span>
        </button>

        <span style={{ color: '#CBD5E1' }}>|</span>

        {/* Analytics Button */}
        <button
          onClick={onToggleAnalytics}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: showAnalytics ? '#4F46E5' : '#475569',
            cursor: 'pointer',
            padding: '2px 4px'
          }}
        >
          <BarChart3 size={14} color={showAnalytics ? '#4F46E5' : '#475569'} />
          <span>Analytics</span>
        </button>
      </div>
    </div>
  );
};
