import React from 'react';
import { 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  Database, 
  GitMerge, 
  Layers, 
  Radio, 
  Link, 
  Sparkles, 
  Flame
} from 'lucide-react';
import { BoothStats, SUMMIT_BOOTHS } from '../types';

interface BoothAnalyticsProps {
  boothStats: BoothStats[];
}

export const BoothAnalytics: React.FC<BoothAnalyticsProps> = ({ boothStats }) => {
  const getIcon = (name: string, color: string) => {
    switch (name) {
      case 'Cpu': return <Cpu size={22} color={color} strokeWidth={2.2} />;
      case 'Cloud': return <Cloud size={22} color={color} strokeWidth={2.2} />;
      case 'ShieldCheck': return <ShieldCheck size={22} color={color} strokeWidth={2.2} />;
      case 'Database': return <Database size={22} color={color} strokeWidth={2.2} />;
      case 'GitMerge': return <GitMerge size={22} color={color} strokeWidth={2.2} />;
      case 'Layers': return <Layers size={22} color={color} strokeWidth={2.2} />;
      case 'Radio': return <Radio size={22} color={color} strokeWidth={2.2} />;
      case 'Link': return <Link size={22} color={color} strokeWidth={2.2} />;
      case 'Sparkles': return <Sparkles size={22} color={color} strokeWidth={2.2} />;
      default: return <Sparkles size={22} color={color} strokeWidth={2.2} />;
    }
  };

  return (
    <section style={{ marginBottom: 32 }}>
      {/* Section Title */}
      <div style={{ marginBottom: 18 }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#740C15',
            margin: 0,
            letterSpacing: '-0.01em'
          }}
        >
          Booth Competition Telemetry (Booths 1–9)
        </h2>
        <p
          style={{
            fontSize: '0.8rem',
            color: '#64748B',
            margin: '2px 0 0 0'
          }}
        >
          Real-time submission volumes, average benchmark scores, and leading domain specialists
        </p>
      </div>

      {/* Grid of 9 Booth Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 18
        }}
      >
        {SUMMIT_BOOTHS.map((booth) => {
          const stats = boothStats.find(s => s.boothNumber === booth.number) || {
            boothNumber: booth.number,
            boothTitle: booth.title,
            totalAttempts: 0,
            averageScore: 0,
            averageAccuracy: 0,
            averageTimeSeconds: 0
          };

          return (
            <div
              key={booth.id}
              className="white-card"
              style={{
                padding: '22px',
                borderTop: `4px solid ${booth.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#FFFFFF'
              }}
            >
              <div>
                {/* Header inside booth card */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${booth.color}15`,
                      border: `1px solid ${booth.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getIcon(booth.iconName, booth.color)}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: booth.color,
                      background: `${booth.color}10`,
                      padding: '3px 9px',
                      borderRadius: 6,
                      border: `1px solid ${booth.color}25`
                    }}
                  >
                    Booth {booth.number}
                  </span>
                </div>

                {/* Booth Title - High Contrast Dark */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 6px 0',
                    lineHeight: 1.3
                  }}
                >
                  {booth.title}
                </h3>

                {/* Booth Description */}
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#475569',
                    margin: '0 0 16px 0',
                    lineHeight: 1.45,
                    minHeight: 34
                  }}
                >
                  {booth.description}
                </p>
              </div>

              <div>
                {/* Metrics Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    background: '#F8FAFC',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    marginBottom: 12
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                      ATTEMPTS
                    </span>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0F172A'
                      }}
                    >
                      {stats.totalAttempts}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                      AVG SCORE
                    </span>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#D97706'
                      }}
                    >
                      {stats.averageScore}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                      AVG ACCURACY
                    </span>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#059669'
                      }}
                    >
                      {stats.averageAccuracy}%
                    </div>
                  </div>
                </div>

                {/* Top Performer Badge */}
                <div
                  style={{
                    background: stats.topPerformer ? '#FEF3C7' : '#F8FAFC',
                    border: `1px solid ${stats.topPerformer ? '#FDE68A' : '#E2E8F0'}`,
                    borderRadius: 8,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Flame size={14} color={stats.topPerformer ? "#D97706" : "#94A3B8"} />
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: stats.topPerformer ? "#92400E" : "#64748B",
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      TOP PERFORMER
                    </span>
                  </div>

                  {stats.topPerformer ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#0F172A'
                        }}
                      >
                        {stats.topPerformer.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#0F766E',
                          background: '#E6F8F3',
                          border: '1px solid #A7F3D0',
                          padding: '1px 7px',
                          borderRadius: 4
                        }}
                      >
                        {stats.topPerformer.score} pts ({stats.topPerformer.timeTakenSeconds}s)
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontStyle: 'italic' }}>
                      Awaiting attempts
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
