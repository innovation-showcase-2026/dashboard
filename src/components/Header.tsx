import React, { useState } from 'react';
import { 
  Home, 
  Radio, 
  Users, 
  BarChart2, 
  Download, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { Participant } from '../types';
import { exportParticipantsToCSV } from '../utils/analytics';

interface HeaderProps {
  participants: Participant[];
  lastSynced: Date | null;
  isLoading: boolean;
  onRefresh: () => Promise<void> | void;
  activeNavTab?: string;
  onNavTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  participants,
  lastSynced,
  isLoading,
  onRefresh,
  activeNavTab = 'Dashboard',
  onNavTabChange
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleManualRefresh = async () => {
    setIsRotating(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRotating(false), 600);
    }
  };

  const formattedTime = lastSynced 
    ? lastSynced.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }) 
    : 'Not loaded';

  const navItems = [
    { label: 'Dashboard', icon: Home },
    { label: 'Live Feed', icon: Radio },
    { label: 'Attendees', icon: Users },
    { label: 'Analytics', icon: BarChart2 },
    { label: 'Export CSV', icon: Download, action: () => exportParticipantsToCSV(participants) }
  ];

  return (
    <div>
      {/* 1. Deep Burgundy Top Header Bar */}
      <header
        style={{
          background: 'linear-gradient(90deg, #62040C 0%, #750A14 50%, #62040C 100%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
          padding: '12px 32px',
          color: '#FFFFFF'
        }}
      >
        <div
          style={{
            maxWidth: 1520,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          {/* Left: Wells Fargo Logo Box & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Wells Fargo Red Box Logo */}
            <div
              style={{
                background: 'var(--wf-red-primary)',
                padding: '6px 10px',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.86rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  color: '#FFFFFF'
                }}
              >
                WELLS
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.86rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  color: '#FFFFFF',
                  marginTop: 2
                }}
              >
                FARGO
              </span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.38rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  margin: 0
                }}
              >
                Innovation Showcase 2026
              </h1>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: '#F9D5D7',
                  margin: '3px 0 0 0',
                  fontWeight: 500
                }}
              >
                Summit Analytics • Booths | 9 Competition Telemetry
              </p>
            </div>
          </div>

          {/* Right: Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeNavTab === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else if (onNavTabChange) {
                        onNavTabChange(item.label);
                      }
                    }}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer'
                    }}
                  >
                    <IconComponent size={16} strokeWidth={isActive ? 2.4 : 1.9} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 2. Sub-Header: 4 Status Badges Row */}
      <div
        style={{
          maxWidth: 1520,
          margin: '0 auto',
          padding: '16px 32px 14px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap'
        }}
      >
        {/* Badge 1: Live Leaderboard data source */}
        <div
          className="status-pill"
          style={{
            background: 'var(--badge-green-bg)',
            color: 'var(--badge-green-text)',
            border: '1px solid rgba(14, 162, 89, 0.2)'
          }}
        >
          <span className="pulsing-green-dot" />
          <span>LIVE LEADERBOARD SYNC</span>
        </div>

        {/* Badge 2: Synced Timestamp */}
        <div
          className="status-pill"
          style={{
            background: 'var(--badge-cyan-bg)',
            color: 'var(--badge-cyan-text)',
            border: '1px solid rgba(23, 115, 112, 0.2)'
          }}
        >
          <RefreshCw size={13} color="var(--badge-cyan-text)" strokeWidth={2.4} />
          <span>Loaded: {formattedTime}</span>
        </div>

        {/* Badge 3: Active Attendees Counter */}
        <div
          className="status-pill"
          style={{
            background: 'var(--badge-pink-bg)',
            color: 'var(--badge-pink-text)',
            border: '1px solid rgba(145, 27, 27, 0.2)'
          }}
        >
          <AlertCircle size={14} color="var(--badge-pink-text)" strokeWidth={2.2} />
          <span>{participants.length} Active Attendees</span>
        </div>

        {/* Badge 4: Refresh Button */}
        <button
          onClick={handleManualRefresh}
          className="status-pill"
          style={{
            background: '#FAF1F1',
            color: '#911B1B',
            border: '1px solid rgba(145, 27, 27, 0.25)',
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
        >
          <RefreshCw 
            size={13} 
            color="#911B1B" 
            strokeWidth={2.4}
            style={{
              transition: 'transform 0.6s ease',
              transform: isRotating || isLoading ? 'rotate(360deg)' : 'none'
            }}
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};
