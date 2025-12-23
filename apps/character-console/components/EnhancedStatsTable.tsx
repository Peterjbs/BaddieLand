'use client';

import { useState, useMemo } from 'react';
import { StatSheet } from '@/lib/stat-utils';
import { 
  STATS, 
  calculateDerived, 
  calculateGrandTotal,
  validateGrid,
  getStatByKey
} from '@/lib/stat-constants';
import {
  updateStatValue,
  updateMultiplier,
  updateBoundary,
  toggleLock,
  scaleRow,
  scaleColumn
} from '@/lib/stat-utils';

interface EnhancedStatsTableProps {
  statSheet: StatSheet;
  onChange: (statSheet: StatSheet) => void;
}

export default function EnhancedStatsTable({ statSheet, onChange }: EnhancedStatsTableProps) {
  const [editingCell, setEditingCell] = useState<{ stat: string; level: number } | null>(null);
  const [editingMultiplier, setEditingMultiplier] = useState<{ stat: string; index: number } | null>(null);

  // Calculate grand total and validation errors
  const grandTotal = useMemo(() => calculateGrandTotal(statSheet.stats), [statSheet.stats]);
  const errors = useMemo(() => validateGrid(statSheet.stats), [statSheet.stats]);
  const isOverCap = grandTotal > statSheet.cap;

  // Handle cell value change
  const handleCellChange = (statKey: string, level: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const updated = updateStatValue(statSheet, statKey, level, numValue);
    onChange(updated);
  };

  // Handle multiplier change
  const handleMultiplierChange = (statKey: string, index: number, value: string) => {
    const updated = updateMultiplier(statSheet, statKey, index, value);
    onChange(updated);
  };

  // Handle boundary change
  const handleBoundaryChange = (statKey: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const updated = updateBoundary(statSheet, statKey, numValue);
    onChange(updated);
  };

  // Handle lock toggle
  const handleLockToggle = (statKey: string) => {
    const updated = toggleLock(statSheet, statKey);
    onChange(updated);
  };

  // Handle row scaling
  const handleScaleRow = (level: number, factor: number) => {
    const updated = scaleRow(statSheet, level, factor);
    onChange(updated);
  };

  // Handle column scaling
  const handleScaleColumn = (statKey: string, factor: number) => {
    const updated = scaleColumn(statSheet, statKey, factor);
    onChange(updated);
  };

  // Check if cell is manually overridden
  const isManualOverride = (statKey: string, level: number): boolean => {
    return !!statSheet.manual?.[statKey]?.[level];
  };

  // Get cell background color based on stat hue and value
  const getCellStyle = (statKey: string, level: number, value: number) => {
    const stat = getStatByKey(statKey);
    if (!stat) return {};

    const isLocked = statSheet.locks?.[statKey];
    const isManual = isManualOverride(statKey, level);

    if (isLocked) {
      return {
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        color: 'rgba(128, 128, 128, 0.6)'
      };
    }

    if (value === 0) {
      return {
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 6px)',
        color: 'rgba(0,0,0,0.65)'
      };
    }

    if (value < 0) {
      return {
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(244,63,94,0.28) 0, rgba(244,63,94,0.28) 2px, transparent 2px, transparent 6px)',
        color: 'rgba(159,18,57,0.9)'
      };
    }

    // Color based on stat hue
    const hue = stat.hue;
    const saturation = isManual ? '70%' : '50%';
    const lightness = '95%';
    const borderColor = `hsl(${hue}, 60%, 50%)`;

    return {
      backgroundColor: `hsl(${hue}, ${saturation}, ${lightness})`,
      border: isManual ? `2px solid ${borderColor}` : undefined
    };
  };

  return (
    <div className="enhanced-stats-table-container">
      {/* Header with total and warnings */}
      <div className="stats-header">
        <div className="stats-info">
          <span className={`grand-total ${isOverCap ? 'over-cap' : ''}`}>
            Total: {grandTotal} / {statSheet.cap}
          </span>
          {isOverCap && (
            <span className="warning-badge">⚠️ Over Cap!</span>
          )}
          {errors.length > 0 && (
            <button 
              className="button button-small button-secondary"
              onClick={() => alert(errors.join('\n'))}
            >
              {errors.length} Validation Error{errors.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable table container */}
      <div className="stat-grid-wrapper">
        <table className="stat-grid">
          <thead>
            <tr>
              <th className="sticky-header stat-name-col">Stat</th>
              <th className="sticky-header">Lock</th>
              <th className="sticky-header">Lv1 Base</th>
              {Array.from({ length: 9 }, (_, i) => (
                <th key={i} className="sticky-header level-col">
                  <div className="level-header">
                    <span>Lv{i + 1}</span>
                    <div className="scale-buttons">
                      <button
                        className="scale-btn"
                        onClick={() => handleScaleRow(i, 1.1)}
                        title="Scale +10%"
                      >
                        +
                      </button>
                      <button
                        className="scale-btn"
                        onClick={() => handleScaleRow(i, 0.9)}
                        title="Scale -10%"
                      >
                        −
                      </button>
                    </div>
                  </div>
                </th>
              ))}
              <th className="sticky-header derived-col">M1→2</th>
              <th className="sticky-header derived-col">M2→3</th>
              <th className="sticky-header derived-col">M3→4</th>
              <th className="sticky-header derived-col">M4→5</th>
              <th className="sticky-header derived-col">M5→6</th>
              <th className="sticky-header derived-col">M6→7</th>
              <th className="sticky-header derived-col">M7→8</th>
              <th className="sticky-header derived-col">M8→9</th>
            </tr>
          </thead>
          <tbody>
            {STATS.map(stat => {
              const values = statSheet.stats[stat.k] || Array(9).fill(0);
              const multipliers = statSheet.multipliers[stat.k] || Array(8).fill('1.150');
              const isLocked = statSheet.locks?.[stat.k];

              return (
                <tr key={stat.k} className={isLocked ? 'locked-row' : ''}>
                  {/* Stat name */}
                  <td className="stat-name-cell">
                    <div 
                      className="stat-label"
                      style={{ 
                        borderLeft: `4px solid hsl(${stat.hue}, 60%, 50%)`,
                        paddingLeft: '8px'
                      }}
                    >
                      {stat.label}
                    </div>
                  </td>

                  {/* Lock button */}
                  <td className="lock-cell">
                    <button
                      className={`lockbtn ${isLocked ? 'locked' : ''}`}
                      onClick={() => handleLockToggle(stat.k)}
                      title={isLocked ? 'Unlock' : 'Lock to zero'}
                    >
                      {isLocked ? '🔒' : '🔓'}
                    </button>
                  </td>

                  {/* Lv1 Base boundary */}
                  <td className="boundary-cell">
                    <input
                      type="number"
                      className="boundary-input"
                      value={statSheet.boundaries?.[stat.k] ?? stat.lv1Exp}
                      onChange={(e) => handleBoundaryChange(stat.k, e.target.value)}
                      min={stat.lv1Low}
                      max={stat.lv1Limit}
                      disabled={isLocked}
                    />
                  </td>

                  {/* Level values */}
                  {values.map((value, level) => (
                    <td
                      key={level}
                      className="stat-cell"
                      style={getCellStyle(stat.k, level, value)}
                    >
                      <input
                        type="number"
                        className="stat-input"
                        value={value}
                        onChange={(e) => handleCellChange(stat.k, level, e.target.value)}
                        onFocus={() => setEditingCell({ stat: stat.k, level })}
                        onBlur={() => setEditingCell(null)}
                        disabled={isLocked}
                        min={0}
                        max={stat.limit}
                      />
                    </td>
                  ))}

                  {/* Multipliers */}
                  {multipliers.map((mult, index) => (
                    <td key={`mult-${index}`} className="multiplier-cell">
                      <input
                        type="text"
                        className="multiplier-input"
                        value={mult}
                        onChange={(e) => handleMultiplierChange(stat.k, index, e.target.value)}
                        onFocus={() => setEditingMultiplier({ stat: stat.k, index })}
                        onBlur={() => setEditingMultiplier(null)}
                        disabled={isLocked}
                        placeholder="1.000"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Derived rows */}
            <tr className="derived-row">
              <td colSpan={3} className="derived-label">ATK_SUM</td>
              {Array.from({ length: 9 }, (_, level) => {
                const derived = calculateDerived(statSheet.stats, level);
                return (
                  <td key={level} className="derived-cell">
                    {derived.ATK_SUM}
                  </td>
                );
              })}
              <td colSpan={8}></td>
            </tr>

            <tr className="derived-row">
              <td colSpan={3} className="derived-label">ATK_TOP</td>
              {Array.from({ length: 9 }, (_, level) => {
                const derived = calculateDerived(statSheet.stats, level);
                return (
                  <td key={level} className="derived-cell">
                    {derived.ATK_TOP}
                  </td>
                );
              })}
              <td colSpan={8}></td>
            </tr>

            <tr className="derived-row">
              <td colSpan={3} className="derived-label">DEF_SUM</td>
              {Array.from({ length: 9 }, (_, level) => {
                const derived = calculateDerived(statSheet.stats, level);
                return (
                  <td key={level} className="derived-cell">
                    {derived.DEF_SUM}
                  </td>
                );
              })}
              <td colSpan={8}></td>
            </tr>

            <tr className="derived-row">
              <td colSpan={3} className="derived-label">DEF_TOP</td>
              {Array.from({ length: 9 }, (_, level) => {
                const derived = calculateDerived(statSheet.stats, level);
                return (
                  <td key={level} className="derived-cell">
                    {derived.DEF_TOP}
                  </td>
                );
              })}
              <td colSpan={8}></td>
            </tr>

            <tr className="derived-row total-row">
              <td colSpan={3} className="derived-label">LV_TOTAL</td>
              {Array.from({ length: 9 }, (_, level) => {
                const derived = calculateDerived(statSheet.stats, level);
                return (
                  <td key={level} className="derived-cell total-cell">
                    {derived.LV_TOTAL}
                  </td>
                );
              })}
              <td colSpan={8}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Column scaling buttons */}
      <div className="column-scale-section">
        <h4>Scale Stats (Column-wise)</h4>
        <div className="column-scale-grid">
          {STATS.map(stat => (
            <div key={stat.k} className="column-scale-item">
              <span className="stat-key">{stat.k}</span>
              <button
                className="scale-btn"
                onClick={() => handleScaleColumn(stat.k, 1.1)}
                title="Scale +10%"
              >
                +10%
              </button>
              <button
                className="scale-btn"
                onClick={() => handleScaleColumn(stat.k, 0.9)}
                title="Scale -10%"
              >
                -10%
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-box" style={{ border: '2px solid blue' }}></span>
            <span>Manual Override</span>
          </div>
          <div className="legend-item">
            <span className="legend-box zero-cell"></span>
            <span>Zero Value</span>
          </div>
          <div className="legend-item">
            <span className="legend-box neg-cell"></span>
            <span>Negative Value</span>
          </div>
          <div className="legend-item">
            <span className="legend-box" style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)' }}></span>
            <span>Locked Stat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
