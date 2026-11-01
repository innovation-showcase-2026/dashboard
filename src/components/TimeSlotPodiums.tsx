import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { TIME_SLOTS, getSlotUrl } from '../services/participants';
import { SlotRecordsModal } from './SlotRecordsModal';

interface TimeSlotPodiumsProps {
  slotsData: Record<string, Participant[]>;
  isLoading: boolean;
  onSelectParticipant?: (participant: Participant) => void;
}

const getInitials = (name?: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
};

export const TimeSlotPodiums: React.FC<TimeSlotPodiumsProps> = ({
  slotsData,
  isLoading,
  onSelectParticipant
}) => {
  // Track modal popup for viewing slot records
  const [selectedSlotModal, setSelectedSlotModal] = useState<{ slot: string; participants: Participant[] } | null>(null);

  // Track open/collapsed state for each time slot
  // By default, open slots that have winners (e.g. 10:30, 15:30), plus 10:00
  const [openSlots, setOpenSlots] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    TIME_SLOTS.forEach((slot, index) => {
      const count = slotsData[slot]?.length || 0;
      initial[slot] = count > 0 || index === 0;
    });
    return initial;
  });

  const [filterWinnersOnly, setFilterWinnersOnly] = useState<boolean>(false);

  // Toggle slot accordion
  const toggleSlot = (slot: string) => {
    setOpenSlots((prev) => ({
      ...prev,
      [slot]: !prev[slot]
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    TIME_SLOTS.forEach((slot) => {
      allOpen[slot] = true;
    });
    setOpenSlots(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    TIME_SLOTS.forEach((slot) => {
      allClosed[slot] = false;
    });
    setOpenSlots(allClosed);
  };

  // Compute summary stats
  const totalSlotsCount = TIME_SLOTS.length;
  const activeSlotsCount = useMemo(() => {
    return TIME_SLOTS.filter((s) => (slotsData[s]?.length || 0) > 0).length;
  }, [slotsData]);

  const totalWinnersCount = useMemo(() => {
    return Object.values(slotsData).reduce((acc, list) => acc + (list?.length || 0), 0);
  }, [slotsData]);

  const visibleSlots = useMemo(() => {
    if (!filterWinnersOnly) return TIME_SLOTS;
    return TIME_SLOTS.filter((slot) => (slotsData[slot]?.length || 0) > 0);
  }, [filterWinnersOnly, slotsData]);

  return (
    <section className="slot-podiums-container" style={{ marginBottom: 24 }}>
      {/* ─── HEADER & CONTROLS (LIGHT THEME) ─── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 18,
          padding: '16px 20px',
          boxShadow: '0 4px 18px rgba(99, 102, 241, 0.08)',
          marginBottom: 14
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          {/* Title and Badges */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  border: '1.5px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(245, 158, 11, 0.2)'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <path fill="#fef08a" d="M7 4h10v5a5 5 0 0 1-10 0z" />
                  <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6v3H9z" />
                </svg>
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  Time-Slot Contenders <span style={{ color: '#4f46e5' }}>Podiums</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 12,
                      background: '#e0e7ff',
                      border: '1px solid #c7d2fe',
                      color: '#3730a3'
                    }}
                  >
                    10:00 – 18:00 (24h)
                  </span>
                </h2>
                <p
                  style={{
                    margin: '3px 0 0 0',
                    fontSize: '0.78rem',
                    color: '#475569',
                    fontWeight: 500
                  }}
                >
                  Live parallel data synced from 10:00 to 18:00 in 30-minute intervals
                </p>
              </div>
            </div>
          </div>

          {/* Quick stats & action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Active slots counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
              title="Time slots with confirmed contenders"
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }}
              />
              <span>{activeSlotsCount} of {totalSlotsCount} Slots Active</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#b45309' }}>🏆 {totalWinnersCount} Winners</span>
            </div>

            {/* Filter toggle */}
            <button
              type="button"
              onClick={() => setFilterWinnersOnly((prev) => !prev)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: filterWinnersOnly ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                background: filterWinnersOnly ? '#fef3c7' : '#ffffff',
                color: filterWinnersOnly ? '#92400e' : '#334155',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {filterWinnersOnly ? '★ Showing Active Only' : 'Show Active Only'}
            </button>

            {/* Expand / Collapse All */}
            <div style={{ display: 'inline-flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <button
                type="button"
                onClick={expandAll}
                style={{
                  padding: '6px 11px',
                  background: '#ffffff',
                  border: 'none',
                  borderRight: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                style={{
                  padding: '6px 11px',
                  background: '#ffffff',
                  border: 'none',
                  color: '#334155',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick Time Slots Ribbon ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            paddingTop: 12,
            marginTop: 12,
            borderTop: '1px solid #f1f5f9',
            scrollbarWidth: 'thin'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', fontWeight: 700, marginRight: 4 }}>
            Jump to:
          </span>
          {TIME_SLOTS.map((slot) => {
            const hasWinners = (slotsData[slot]?.length || 0) > 0;
            const isOpen = !!openSlots[slot];
            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  setOpenSlots((prev) => ({ ...prev, [slot]: true }));
                  const el = document.getElementById(`slot-card-${slot.replace(':', '')}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 9px',
                  borderRadius: 7,
                  border: hasWinners
                    ? '1.5px solid #f59e0b'
                    : isOpen
                    ? '1.5px solid #818cf8'
                    : '1px solid #cbd5e1',
                  background: hasWinners
                    ? '#fef3c7'
                    : isOpen
                    ? '#e0e7ff'
                    : '#ffffff',
                  color: hasWinners ? '#92400e' : isOpen ? '#312e81' : '#334155',
                  fontSize: '0.74rem',
                  fontWeight: hasWinners || isOpen ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: hasWinners ? '0 2px 6px rgba(245, 158, 11, 0.2)' : 'none'
                }}
              >
                {hasWinners && <span style={{ color: '#d97706', fontSize: '0.75rem' }}>★</span>}
                <span>{slot}</span>
                {hasWinners && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      background: '#d97706',
                      color: '#ffffff',
                      borderRadius: 10,
                      padding: '0 4px',
                      fontWeight: 800
                    }}
                  >
                    {slotsData[slot]?.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── LIST OF COLLAPSIBLE TIME SLOTS (LIGHT THEME) ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibleSlots.map((slot) => {
          const code = slot.replace(':', '');
          const slotUrl = getSlotUrl(code);
          const participants = slotsData[slot] || [];
          const isOpen = !!openSlots[slot];
          const hasWinners = participants.length > 0;
          const winner1 = participants[0];
          const winner2 = participants[1];
          const winner3 = participants[2];

          return (
            <div
              key={slot}
              id={`slot-card-${code}`}
              style={{
                borderRadius: 16,
                background: '#ffffff',
                border: hasWinners ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                boxShadow: hasWinners
                  ? '0 6px 20px rgba(245, 158, 11, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              {/* ── Collapsible Header Row ── */}
              <div
                onClick={() => toggleSlot(slot)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  background: isOpen ? '#f8fafc' : '#ffffff',
                  borderBottom: isOpen ? '1px solid #e2e8f0' : 'none',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Left: Time badge & Winner info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {/* Time Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: hasWinners
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      letterSpacing: '0.02em',
                      boxShadow: hasWinners
                        ? '0 2px 8px rgba(245, 158, 11, 0.35)'
                        : '0 2px 6px rgba(79, 70, 229, 0.25)'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>{slot}</span>
                  </div>

                  {/* Status & Winner pill */}
                  {hasWinners ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: '#fef3c7',
                          border: '1px solid #fcd34d',
                          color: '#92400e',
                          padding: '3px 10px',
                          borderRadius: 14,
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        🏆 {participants.length} {participants.length === 1 ? 'Winner' : 'Winners'}
                      </span>
                      {winner1 && (
                        <span
                          style={{
                            fontSize: '0.84rem',
                            color: '#0f172a',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span style={{ color: '#b45309' }}>🥇 {winner1.name}</span>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span style={{ color: '#059669', fontWeight: 800 }}>{winner1.totalScore} pts</span>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span style={{ color: '#2563eb' }}>{winner1.overallAccuracy}% Acc</span>
                          {winner1.completionTime && (
                            <>
                              <span style={{ color: '#cbd5e1' }}>•</span>
                              <span
                                style={{
                                  background: '#fff7ed',
                                  border: '1px solid #fed7aa',
                                  color: '#c2410c',
                                  padding: '1px 6px',
                                  borderRadius: 8,
                                  fontSize: '0.72rem'
                                }}
                              >
                                ⏱ {winner1.completionTime}
                              </span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: '#64748b',
                          padding: '3px 9px',
                          borderRadius: 12,
                          fontSize: '0.74rem',
                          fontWeight: 600
                        }}
                      >
                        Awaiting Contenders (0)
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: View Button, URL chip & Toggle Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* View Popup Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSlotModal({ slot, participants });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: hasWinners ? '#EEF2FF' : '#FFFFFF',
                      border: hasWinners ? '1.5px solid #818CF8' : '1px solid #CBD5E1',
                      color: hasWinners ? '#312E81' : '#334155',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: hasWinners ? '0 2px 6px rgba(99, 102, 241, 0.18)' : '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = hasWinners ? '#E0E7FF' : '#F1F5F9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = hasWinners ? '#EEF2FF' : '#FFFFFF';
                    }}
                    title={`View all ${participants.length} records in popup`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>View ({participants.length})</span>
                  </button>

                  <a
                    href={slotUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#4f46e5',
                      textDecoration: 'none',
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1'
                    }}
                    title={`View JSON source: ${slotUrl}`}
                  >
                    {code}.json ↗
                  </a>

                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#334155',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ── Collapsible Body (Light Podium Stage) ── */}
              {isOpen && (
                <div
                  style={{
                    padding: '18px 20px 24px 20px',
                    position: 'relative',
                    background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                    animation: 'fadeIn 0.25s ease'
                  }}
                >
                  {/* Quick Action: View All Records in Popup */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlotModal({ slot, participants })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#FFFFFF',
                        border: '1px solid #C7D2FE',
                        borderRadius: 8,
                        padding: '5px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#4338CA',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#EEF2FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                      }}
                      title="Open popup to view all records like leaderboard json"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                      <span>Open {slot} Standings Popup ({participants.length} records)</span>
                    </button>
                  </div>

                  {/* 3D Glossy Podium Grid (Light Theme) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(140px, 1fr) minmax(170px, 1.25fr) minmax(140px, 1fr)',
                      alignItems: 'end',
                      gap: 12,
                      maxWidth: 720,
                      margin: '0 auto',
                      paddingTop: 10
                    }}
                  >
                    {/* ══════ 2ND PLACE (SILVER) ══════ */}
                    <div
                      onClick={() => winner2 && onSelectParticipant?.(winner2)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: winner2 ? 'pointer' : 'default',
                        transition: 'transform 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (winner2) e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      title={winner2 ? `View details for ${winner2.name}` : ''}
                    >
                      {/* Avatar */}
                      <div style={{ position: 'relative', marginBottom: 10 }}>
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            padding: 2.5,
                            background: winner2
                              ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)'
                              : '#ffffff',
                            boxShadow: winner2 ? '0 4px 12px rgba(148, 163, 184, 0.4)' : 'none',
                            border: winner2 ? 'none' : '1.5px dashed #cbd5e1'
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              background: winner2 ? '#1e293b' : '#f8fafc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: winner2 ? '#ffffff' : '#94a3b8',
                              fontWeight: 800,
                              fontSize: '0.95rem'
                            }}
                          >
                            {winner2 ? getInitials(winner2.name) : '--'}
                          </div>
                        </div>
                        <span
                          style={{
                            position: 'absolute',
                            bottom: -6,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '1px 7px',
                            borderRadius: 8,
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            background: '#f1f5f9',
                            border: '1.5px solid #94a3b8',
                            color: '#334155'
                          }}
                        >
                          #2
                        </span>
                      </div>

                      {/* Pedestal */}
                      <div
                        style={{
                          width: '100%',
                          minHeight: 120,
                          borderRadius: '12px 12px 4px 4px',
                          background: winner2
                            ? 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #e2e8f0 100%)'
                            : '#ffffff',
                          border: winner2 ? '1.5px solid #cbd5e1' : '1.5px dashed #cbd5e1',
                          boxShadow: winner2
                            ? '0 6px 18px rgba(0, 0, 0, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.8)'
                            : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 8px 8px 8px',
                          textAlign: 'center'
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: '0.88rem',
                              color: winner2 ? '#1e293b' : '#64748b',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 130
                            }}
                          >
                            {winner2 ? winner2.name : 'Awaiting Contender'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: 800,
                              color: winner2 ? '#334155' : '#94a3b8',
                              marginTop: 2
                            }}
                          >
                            {winner2 ? `${winner2.totalScore} pts` : '--'}
                          </div>
                          {winner2 && (
                            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                              {winner2.totalTestsAppeared} Booths • {winner2.overallAccuracy}% Acc
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: winner2 ? '#e2e8f0' : '#f8fafc',
                            color: winner2 ? '#334155' : '#94a3b8',
                            border: '1px solid #cbd5e1',
                            marginTop: 8
                          }}
                        >
                          🥈 2ND PLACE
                        </div>
                      </div>
                    </div>

                    {/* ══════ 1ST PLACE (GOLD WINNER) ══════ */}
                    <div
                      onClick={() => winner1 && onSelectParticipant?.(winner1)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: winner1 ? 'pointer' : 'default',
                        transition: 'transform 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (winner1) e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      title={winner1 ? `View details for ${winner1.name}` : ''}
                    >
                      {/* Floating Crown */}
                      <div
                        style={{
                          marginBottom: -4,
                          animation: winner1 ? 'float 2.5s ease-in-out infinite' : 'none',
                          filter: winner1 ? 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.6))' : 'none',
                          opacity: winner1 ? 1 : 0.35
                        }}
                      >
                        <svg width="34" height="28" viewBox="0 0 24 24" fill="#facc15" stroke="#ca8a04" strokeWidth="1.6">
                          <path d="M2 19 4 7l5 5 3-8 3 8 5-5 2 12z" />
                        </svg>
                      </div>

                      {/* Avatar */}
                      <div style={{ position: 'relative', marginBottom: 10 }}>
                        <div
                          style={{
                            width: 66,
                            height: 66,
                            borderRadius: '50%',
                            padding: 3,
                            background: winner1
                              ? 'linear-gradient(135deg, #fde047, #f59e0b 50%, #d97706)'
                              : '#ffffff',
                            boxShadow: winner1
                              ? '0 6px 20px rgba(245, 158, 11, 0.4)'
                              : 'none',
                            border: winner1 ? 'none' : '1.5px dashed #cbd5e1'
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              background: winner1 ? '#1e1b4b' : '#f8fafc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: winner1 ? '#ffffff' : '#94a3b8',
                              fontWeight: 900,
                              fontSize: '1.25rem'
                            }}
                          >
                            {winner1 ? getInitials(winner1.name) : '--'}
                          </div>
                        </div>
                        <span
                          style={{
                            position: 'absolute',
                            bottom: -7,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '2px 9px',
                            borderRadius: 8,
                            fontSize: '0.66rem',
                            fontWeight: 900,
                            whiteSpace: 'nowrap',
                            background: winner1 ? 'linear-gradient(135deg, #fef08a, #f59e0b)' : '#f8fafc',
                            border: winner1 ? '1.5px solid #ffffff' : '1.5px solid #cbd5e1',
                            color: winner1 ? '#451a03' : '#94a3b8',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                          }}
                        >
                          #1 • 1ST
                        </span>
                      </div>

                      {/* Pedestal */}
                      <div
                        style={{
                          width: '100%',
                          minHeight: 156,
                          borderRadius: '14px 14px 4px 4px',
                          background: winner1
                            ? 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 40%, #fde68a 100%)'
                            : '#ffffff',
                          border: winner1 ? '1.5px solid #f59e0b' : '1.5px dashed #cbd5e1',
                          boxShadow: winner1
                            ? '0 8px 24px rgba(245, 158, 11, 0.25), inset 0 2px 0 #ffffff'
                            : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 10px 10px 10px',
                          textAlign: 'center'
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 900,
                              fontSize: '0.98rem',
                              color: winner1 ? '#78350f' : '#64748b',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 160
                            }}
                          >
                            {winner1 ? winner1.name : 'Awaiting Winner'}
                          </div>
                          <div
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 900,
                              color: winner1 ? '#92400e' : '#94a3b8',
                              margin: '2px 0'
                            }}
                          >
                            {winner1 ? `${winner1.totalScore} Points` : '--'}
                          </div>
                          {winner1 && (
                            <div
                              style={{
                                fontSize: '0.72rem',
                                color: '#b45309',
                                fontWeight: 700
                              }}
                            >
                              {winner1.totalTestsAppeared} Booths • {winner1.overallAccuracy}% Acc
                            </div>
                          )}
                          {winner1?.completionTime && (
                            <div
                              style={{
                                marginTop: 4,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                background: '#ffffff',
                                border: '1px solid #f59e0b',
                                borderRadius: 10,
                                padding: '2px 8px',
                                fontSize: '0.66rem',
                                color: '#92400e',
                                fontWeight: 700,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                              }}
                            >
                              <span>⏱ Time: {winner1.completionTime}</span>
                              {winner1.totalTimeSeconds ? ` (${winner1.totalTimeSeconds}s)` : ''}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            letterSpacing: '0.04em',
                            padding: '4px 12px',
                            borderRadius: 6,
                            background: winner1
                              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                              : '#f8fafc',
                            color: winner1 ? '#ffffff' : '#94a3b8',
                            boxShadow: winner1 ? '0 2px 8px rgba(245, 158, 11, 0.35)' : 'none',
                            marginTop: 10
                          }}
                        >
                          ★ 1ST PLACE ★
                        </div>
                      </div>
                    </div>

                    {/* ══════ 3RD PLACE (BRONZE) ══════ */}
                    <div
                      onClick={() => winner3 && onSelectParticipant?.(winner3)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: winner3 ? 'pointer' : 'default',
                        transition: 'transform 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (winner3) e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      title={winner3 ? `View details for ${winner3.name}` : ''}
                    >
                      {/* Avatar */}
                      <div style={{ position: 'relative', marginBottom: 10 }}>
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            padding: 2.5,
                            background: winner3
                              ? 'linear-gradient(135deg, #fed7aa, #f97316)'
                              : '#ffffff',
                            boxShadow: winner3 ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none',
                            border: winner3 ? 'none' : '1.5px dashed #cbd5e1'
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              background: winner3 ? '#1e293b' : '#f8fafc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: winner3 ? '#ffffff' : '#94a3b8',
                              fontWeight: 800,
                              fontSize: '0.95rem'
                            }}
                          >
                            {winner3 ? getInitials(winner3.name) : '--'}
                          </div>
                        </div>
                        <span
                          style={{
                            position: 'absolute',
                            bottom: -6,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '1px 7px',
                            borderRadius: 8,
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            background: '#fff7ed',
                            border: '1.5px solid #fdba74',
                            color: '#9a3412'
                          }}
                        >
                          #3
                        </span>
                      </div>

                      {/* Pedestal */}
                      <div
                        style={{
                          width: '100%',
                          minHeight: 100,
                          borderRadius: '12px 12px 4px 4px',
                          background: winner3
                            ? 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 45%, #fed7aa 100%)'
                            : '#ffffff',
                          border: winner3 ? '1.5px solid #fdba74' : '1.5px dashed #cbd5e1',
                          boxShadow: winner3
                            ? '0 6px 18px rgba(249, 115, 22, 0.12), inset 0 2px 0 rgba(255, 255, 255, 0.8)'
                            : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 8px 8px 8px',
                          textAlign: 'center'
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: '0.88rem',
                              color: winner3 ? '#7c2d12' : '#64748b',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 130
                            }}
                          >
                            {winner3 ? winner3.name : 'Awaiting Contender'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: 800,
                              color: winner3 ? '#9a3412' : '#94a3b8',
                              marginTop: 2
                            }}
                          >
                            {winner3 ? `${winner3.totalScore} pts` : '--'}
                          </div>
                          {winner3 && (
                            <div style={{ fontSize: '0.68rem', color: '#c2410c', fontWeight: 600, marginTop: 4 }}>
                              {winner3.totalTestsAppeared} Booths • {winner3.overallAccuracy}% Acc
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: winner3 ? '#fed7aa' : '#f8fafc',
                            color: winner3 ? '#7c2d12' : '#94a3b8',
                            border: '1px solid #fdba74',
                            marginTop: 8
                          }}
                        >
                          🥉 3RD PLACE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Additional Contenders in this Slot (Rank 4+) ── */}
                  {participants.length > 3 && (
                    <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: 8 }}>
                        Other Contenders in this Slot ({participants.length - 3})
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                        {participants.slice(3).map((p, idx) => (
                          <div
                            key={p.entId || p.name + idx}
                            onClick={() => onSelectParticipant?.(p)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 8,
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4f46e5' }}>
                                #{idx + 4}
                              </span>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                                {p.name}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>
                              {p.totalScore} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state note */}
                  {!hasWinners && (
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: 14,
                        fontSize: '0.76rem',
                        color: '#64748b',
                        fontWeight: 500,
                        fontStyle: 'italic'
                      }}
                    >
                      Awaiting contenders for the {slot} slot. Quiz submissions update in real-time as participants complete 4 booths.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── POPUP MODAL FOR SLOT RECORDS ── */}
      {selectedSlotModal && (
        <SlotRecordsModal
          slot={selectedSlotModal.slot}
          participants={selectedSlotModal.participants}
          onClose={() => setSelectedSlotModal(null)}
          onSelectParticipant={onSelectParticipant}
        />
      )}
    </section>
  );
};
