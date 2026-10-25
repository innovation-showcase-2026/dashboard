import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Trophy, 
  Award, 
  Star, 
  Users, 
  ChevronRight 
} from 'lucide-react';
import { Participant } from '../types';

interface LeaderboardTableProps {
  participants: Participant[];
  onSelectParticipant: (participant: Participant) => void;
  filterMode: 'all' | 'prize' | 'lob';
  onFilterChange: (mode: 'all' | 'prize' | 'lob') => void;
}

type SortField = 'rank' | 'entId' | 'name' | 'lob' | 'totalTestsAppeared' | 'totalScore' | 'overallAccuracy';
type SortDirection = 'asc' | 'desc';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  participants,
  onSelectParticipant,
  filterMode,
  onFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' || field === 'name' ? 'asc' : 'desc');
    }
  };

  // Filter and sort
  const filteredParticipants = useMemo(() => {
    let result = [...participants];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) ||
             p.entId.toLowerCase().includes(q) ||
             p.lob.toLowerCase().includes(q)
      );
    }

    // Tab filter
    if (filterMode === 'prize') {
      result = result.filter(p => p.isPrizeEligible || (p.totalTestsAppeared && p.totalTestsAppeared >= 4));
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'rank') {
        valA = a.rank ?? 9999;
        valB = b.rank ?? 9999;
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' 
        ? (valA || 0) - (valB || 0) 
        : (valB || 0) - (valA || 0);
    });

    return result;
  }, [participants, searchTerm, filterMode, sortField, sortDirection]);

  const getRankBadge = (rank?: number) => {
    if (!rank) return '-';
    if (rank === 1) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Award size={18} color="#D97706" />
          <span style={{ fontWeight: 800, color: '#D97706', fontSize: '0.95rem' }}>1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Award size={18} color="#94A3B8" />
          <span style={{ fontWeight: 800, color: '#64748B', fontSize: '0.95rem' }}>2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Award size={18} color="#B45309" />
          <span style={{ fontWeight: 800, color: '#B45309', fontSize: '0.95rem' }}>3</span>
        </div>
      );
    }
    return (
      <span style={{ fontWeight: 700, color: '#64748B', paddingLeft: 6 }}>
        {rank}
      </span>
    );
  };

  return (
    <div className="white-card" style={{ padding: '24px 28px', marginBottom: 28 }}>
      {/* 1. Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20
        }}
      >
        {/* Left: Trophy Badge + Title & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Circular Burgundy Trophy Badge */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #740C15 0%, #580309 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(116, 12, 21, 0.25)'
            }}
          >
            <Trophy size={22} color="#FFD700" strokeWidth={2.4} />
          </div>

          <div>
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
              Summit Attendee Leaderboard
            </h2>
            <p
              style={{
                fontSize: '0.78rem',
                color: '#64748B',
                margin: '2px 0 0 0'
              }}
            >
              Real-time standings across all participants • Click any row to view comprehensive booth telemetry
            </p>
          </div>
        </div>

        {/* Right: 3 Filter Toggle Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* All Attendees */}
          <button
            onClick={() => onFilterChange('all')}
            style={{
              background: filterMode === 'all' ? '#7A0C14' : '#FFFFFF',
              color: filterMode === 'all' ? '#FFFFFF' : '#475569',
              border: filterMode === 'all' ? 'none' : '1px solid #E2E8F0',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: filterMode === 'all' ? '0 2px 6px rgba(122, 12, 20, 0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            All Attendees ({participants.length})
          </button>

          {/* Prize Eligible Only */}
          <button
            onClick={() => onFilterChange('prize')}
            style={{
              background: filterMode === 'prize' ? '#7A0C14' : '#FFFFFF',
              color: filterMode === 'prize' ? '#FFFFFF' : '#475569',
              border: filterMode === 'prize' ? 'none' : '1px solid #E2E8F0',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: filterMode === 'prize' ? '0 2px 6px rgba(122, 12, 20, 0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Star size={13} color={filterMode === 'prize' ? '#FFFFFF' : '#64748B'} />
            <span>Prize Eligible Only</span>
          </button>

          {/* By LOB */}
          <button
            onClick={() => onFilterChange('lob')}
            style={{
              background: filterMode === 'lob' ? '#7A0C14' : '#FFFFFF',
              color: filterMode === 'lob' ? '#FFFFFF' : '#475569',
              border: filterMode === 'lob' ? 'none' : '1px solid #E2E8F0',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: filterMode === 'lob' ? '0 2px 6px rgba(122, 12, 20, 0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={13} color={filterMode === 'lob' ? '#FFFFFF' : '#64748B'} />
            <span>By LOB</span>
          </button>
        </div>
      </div>

      {/* 2. Search Bar Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
          flexWrap: 'wrap'
        }}
      >
        {/* Search input field */}
        <div style={{ position: 'relative', flex: '1 1 340px' }}>
          <Search
            size={16}
            color="#94A3B8"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Enterprise ID, Full Name, or Line of Business"
            style={{
              width: '100%',
              padding: '9px 14px 9px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              fontSize: '0.84rem',
              fontFamily: 'var(--font-sans)',
              color: '#1E293B',
              outline: 'none',
              background: '#FFFFFF'
            }}
          />
        </div>

        {/* Counter */}
        <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
          Showing <strong>{filteredParticipants.length} of {participants.length}</strong>
        </div>
      </div>

      {/* 3. Data Table */}
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <table className="pixel-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rank')} style={{ cursor: 'pointer', width: 75 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>RANK</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th onClick={() => handleSort('entId')} style={{ cursor: 'pointer', width: 140 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>ENTERPRISE ID</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>ATTENDEE NAME</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th onClick={() => handleSort('lob')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>LINE OF BUSINESS</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th onClick={() => handleSort('totalTestsAppeared')} style={{ cursor: 'pointer', width: 110 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>BOOTHS</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th onClick={() => handleSort('totalScore')} style={{ cursor: 'pointer', width: 110, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <span>TOTAL SCORE</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th onClick={() => handleSort('overallAccuracy')} style={{ cursor: 'pointer', width: 100, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <span>ACCURACY</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th style={{ width: 130, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <span>PRIZE STATUS</span>
                  <ArrowUpDown size={11} color="rgba(255,255,255,0.7)" />
                </div>
              </th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px 20px', color: '#64748B' }}>
                  No participants matched your search criteria.
                </td>
              </tr>
            ) : (
              filteredParticipants.map((p) => {
                const boothsCount = p.totalTestsAppeared || 0;
                const isPrize = p.isPrizeEligible || boothsCount >= 4;
                const needed = Math.max(0, 4 - boothsCount);

                return (
                  <tr
                    key={p.id || p.entId}
                    onClick={() => onSelectParticipant(p)}
                  >
                    {/* Rank */}
                    <td>{getRankBadge(p.rank)}</td>

                    {/* Enterprise ID Pill */}
                    <td>
                      <span
                        style={{
                          background: '#E6F8F3',
                          color: '#0F766E',
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {p.entId}
                      </span>
                    </td>

                    {/* Attendee Name */}
                    <td>
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>
                        {p.name}
                      </span>
                    </td>

                    {/* Line of Business */}
                    <td>
                      <span style={{ color: '#334155', fontSize: '0.84rem' }}>
                        {p.lob}
                      </span>
                    </td>

                    {/* Booths (with red miniature progress bar) */}
                    <td>
                      <div style={{ width: 75 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1E293B', marginBottom: 3 }}>
                          {boothsCount} / 9
                        </div>
                        {/* Miniature Progress Bar */}
                        <div
                          style={{
                            width: '100%',
                            height: 4,
                            background: '#E2E8F0',
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${(boothsCount / 9) * 100}%`,
                              height: '100%',
                              background: '#B3141E',
                              borderRadius: 2
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Total Score */}
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          minWidth: 34,
                          padding: '3px 10px',
                          borderRadius: 8,
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-sans)',
                          background: p.totalScore > 0 ? '#FDE68A' : '#F1F5F9',
                          color: '#0F172A'
                        }}
                      >
                        {p.totalScore}
                      </span>
                    </td>

                    {/* Accuracy */}
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.86rem', color: '#1E293B' }}>
                      {p.overallAccuracy}%
                    </td>

                    {/* Prize Status Pill */}
                    <td style={{ textAlign: 'center' }}>
                      {isPrize ? (
                        <span
                          style={{
                            background: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #FDE68A',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: 14
                          }}
                        >
                          Eligible
                        </span>
                      ) : (
                        <span
                          style={{
                            background: '#E6F8F3',
                            color: '#0F766E',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: 14
                          }}
                        >
                          {needed} more needed
                        </span>
                      )}
                    </td>

                    {/* Chevron */}
                    <td style={{ textAlign: 'right' }}>
                      <ChevronRight size={16} color="#94A3B8" />
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
