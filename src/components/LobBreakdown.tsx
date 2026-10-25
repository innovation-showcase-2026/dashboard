import React from 'react';
import { Building2, Trophy, Award } from 'lucide-react';
import { LobStats } from '../types';

interface LobBreakdownProps {
  lobStats: LobStats[];
  onSelectLobFilter?: (lobName: string) => void;
}

export const LobBreakdown: React.FC<LobBreakdownProps> = ({ lobStats, onSelectLobFilter }) => {
  const maxScore = Math.max(...lobStats.map(l => l.totalScore), 1);

  return (
    <div className="white-card" style={{ padding: '24px 28px', marginBottom: 32 }}>
      <div style={{ marginBottom: 20 }}>
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
          Line of Business (LOB) Participation Breakdown
        </h2>
        <p
          style={{
            fontSize: '0.8rem',
            color: '#64748B',
            margin: '2px 0 0 0'
          }}
        >
          Cross-department engagement metrics, aggregate scores, and prize-qualified talent
        </p>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <table className="pixel-table">
          <thead>
            <tr>
              <th style={{ width: 45 }}>#</th>
              <th>LINE OF BUSINESS / DEPARTMENT</th>
              <th style={{ textAlign: 'center' }}>ATTENDEES</th>
              <th style={{ textAlign: 'center' }}>TOTAL BOOTHS COMPLETED</th>
              <th style={{ textAlign: 'right' }}>TOTAL POINTS</th>
              <th style={{ textAlign: 'right' }}>AVG SCORE</th>
              <th style={{ textAlign: 'right' }}>AVG ACCURACY</th>
              <th style={{ textAlign: 'center' }}>PRIZE ELIGIBLE</th>
              <th style={{ width: 180 }}>SCORE SHARE</th>
            </tr>
          </thead>
          <tbody>
            {lobStats.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                  No departmental submissions recorded yet.
                </td>
              </tr>
            ) : (
              lobStats.map((lob, idx) => {
                const percentShare = Math.round((lob.totalScore / maxScore) * 100);

                return (
                  <tr
                    key={lob.lob}
                    onClick={() => onSelectLobFilter && onSelectLobFilter(lob.lob)}
                    style={{ cursor: onSelectLobFilter ? 'pointer' : 'default' }}
                  >
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: idx === 0 ? '#D97706' : '#64748B'
                        }}
                      >
                        {idx + 1}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Building2 size={16} color="#740C15" />
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{lob.lob}</span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#1E293B' }}>
                        {lob.participantCount}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#1E293B' }}>
                        {lob.boothsCompleted}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: '#0F172A'
                        }}
                      >
                        {lob.totalScore.toLocaleString()}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: '#D97706' }}>
                        {lob.averageScore}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>
                        {lob.averageAccuracy}%
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: lob.prizeEligibleCount > 0 ? '#92400E' : '#64748B',
                          background: lob.prizeEligibleCount > 0 ? '#FEF3C7' : '#F1F5F9',
                          padding: '3px 10px',
                          borderRadius: 12
                        }}
                      >
                        {lob.prizeEligibleCount}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: '#E2E8F0',
                            borderRadius: 3,
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${percentShare}%`,
                              height: '100%',
                              background: idx === 0 
                                ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)' 
                                : 'linear-gradient(90deg, #D71E28 0%, #B3141E 100%)',
                              borderRadius: 3
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: '#64748B',
                            width: 32,
                            textAlign: 'right'
                          }}
                        >
                          {percentShare}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
