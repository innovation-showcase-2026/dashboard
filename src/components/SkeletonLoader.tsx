import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div style={{ maxWidth: 1520, margin: '0 auto', padding: '16px 0' }}>
      {/* KPI Skeletons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 24
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="white-card"
            style={{ padding: '24px', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '50%', height: 16, background: '#E2E8F0', borderRadius: 4 }} />
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F1F5F9' }} />
            </div>
            <div style={{ width: '40%', height: 44, background: '#E2E8F0', borderRadius: 6 }} />
            <div style={{ width: '80%', height: 14, background: '#F1F5F9', borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="white-card" style={{ padding: '24px', height: 380 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ width: 240, height: 24, background: '#E2E8F0', borderRadius: 4 }} />
          <div style={{ width: 180, height: 32, borderRadius: 16, background: '#F1F5F9' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ width: '100%', height: 42, borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }} />
          ))}
        </div>
      </div>
    </div>
  );
};
