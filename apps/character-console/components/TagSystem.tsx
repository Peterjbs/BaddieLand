'use client';

import { useState, useMemo } from 'react';
import { StatSheet } from '@/lib/stat-utils';
import { 
  TAGS, 
  detectActiveTags, 
  filterConflictingTags, 
  applyTags,
  computeGrid
} from '@/lib/stat-constants';

interface TagSystemProps {
  statSheet: StatSheet;
  onChange: (statSheet: StatSheet) => void;
}

export default function TagSystem({ statSheet, onChange }: TagSystemProps) {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  // Detect auto tags from current grid
  const autoTags = useMemo(
    () => detectActiveTags(statSheet.stats),
    [statSheet.stats]
  );

  // Filter selected tags for conflicts
  const { active: activeTags, ignored: ignoredTags } = useMemo(
    () => filterConflictingTags(statSheet.tags.selected),
    [statSheet.tags.selected]
  );

  // Handle tag selection/deselection
  const handleToggleTag = (tagName: string) => {
    const isSelected = statSheet.tags.selected.includes(tagName);
    
    const newSelected = isSelected
      ? statSheet.tags.selected.filter(t => t !== tagName)
      : [...statSheet.tags.selected, tagName];

    onChange({
      ...statSheet,
      tags: {
        ...statSheet.tags,
        selected: newSelected
      }
    });
  };

  // Move tag up in priority
  const handleMoveUp = (tagName: string) => {
    const index = statSheet.tags.selected.indexOf(tagName);
    if (index > 0) {
      const newSelected = [...statSheet.tags.selected];
      [newSelected[index - 1], newSelected[index]] = [newSelected[index], newSelected[index - 1]];
      
      onChange({
        ...statSheet,
        tags: {
          ...statSheet.tags,
          selected: newSelected
        }
      });
    }
  };

  // Move tag down in priority
  const handleMoveDown = (tagName: string) => {
    const index = statSheet.tags.selected.indexOf(tagName);
    if (index < statSheet.tags.selected.length - 1) {
      const newSelected = [...statSheet.tags.selected];
      [newSelected[index], newSelected[index + 1]] = [newSelected[index + 1], newSelected[index]];
      
      onChange({
        ...statSheet,
        tags: {
          ...statSheet.tags,
          selected: newSelected
        }
      });
    }
  };

  // Generate stats by applying tags
  const handleGenerate = () => {
    // Filter for active tags (no conflicts)
    const { active } = filterConflictingTags(statSheet.tags.selected);
    
    // Apply tags to current grid
    const boundaries = statSheet.boundaries || {};
    const multipliers = statSheet.multipliers;
    const manual = statSheet.manual || {};
    const locks = statSheet.locks || {};
    
    // Start with base grid
    let grid = computeGrid(boundaries, multipliers, manual, locks);
    
    // Apply each active tag
    grid = applyTags(grid, active);
    
    onChange({
      ...statSheet,
      stats: grid,
      tags: {
        selected: statSheet.tags.selected,
        active,
        ignored: ignoredTags
      }
    });
  };

  // Check if tag is in conflict
  const isIgnored = (tagName: string): boolean => {
    return ignoredTags.includes(tagName);
  };

  // Check if tag is active
  const isActive = (tagName: string): boolean => {
    return activeTags.includes(tagName);
  };

  return (
    <div className="tag-system-container">
      <div className="tag-system-header">
        <h3>Tag System</h3>
        <button 
          className="button button-primary"
          onClick={handleGenerate}
          disabled={statSheet.tags.selected.length === 0}
        >
          🎯 Generate Stats from Tags
        </button>
      </div>

      <div className="tag-system-layout">
        {/* Available tags */}
        <div className="tag-section">
          <h4>Available Tags ({TAGS.length})</h4>
          <p className="section-description">
            Click to select tags. Order matters for priority.
          </p>
          
          <div className="tag-list">
            {TAGS.map(tag => {
              const isSelected = statSheet.tags.selected.includes(tag.name);
              const isAuto = autoTags.includes(tag.name);
              
              return (
                <div key={tag.name} className="tag-item">
                  <div className="tag-item-header">
                    <label className="tag-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTag(tag.name)}
                      />
                      <span className={`tag-name ${isAuto ? 'auto-detected' : ''}`}>
                        {tag.name}
                        {isAuto && ' ⚡'}
                      </span>
                    </label>
                    <button
                      className="tag-expand-btn"
                      onClick={() => setExpandedTag(expandedTag === tag.name ? null : tag.name)}
                    >
                      {expandedTag === tag.name ? '−' : '+'}
                    </button>
                  </div>
                  
                  {expandedTag === tag.name && (
                    <div className="tag-description">
                      {tag.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected tags with priority */}
        <div className="tag-section">
          <h4>Selected Tags ({statSheet.tags.selected.length})</h4>
          <p className="section-description">
            Priority order (top = highest priority). Use arrows to reorder.
          </p>
          
          {statSheet.tags.selected.length === 0 ? (
            <div className="empty-state">
              <p>No tags selected</p>
            </div>
          ) : (
            <div className="selected-tags-list">
              {statSheet.tags.selected.map((tagName, index) => {
                const tag = TAGS.find(t => t.name === tagName);
                const ignored = isIgnored(tagName);
                const active = isActive(tagName);
                
                return (
                  <div 
                    key={tagName} 
                    className={`selected-tag-item ${ignored ? 'ignored' : ''} ${active ? 'active' : ''}`}
                  >
                    <div className="tag-priority">#{index + 1}</div>
                    <div className="tag-content">
                      <div className="tag-name-with-status">
                        <span className="tag-name">{tagName}</span>
                        {ignored && <span className="status-badge ignored-badge">⚠️ Ignored (Conflict)</span>}
                        {active && <span className="status-badge active-badge">✓ Active</span>}
                      </div>
                      {tag && (
                        <div className="tag-description-small">
                          {tag.description}
                        </div>
                      )}
                    </div>
                    <div className="tag-controls">
                      <button
                        className="tag-control-btn"
                        onClick={() => handleMoveUp(tagName)}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        className="tag-control-btn"
                        onClick={() => handleMoveDown(tagName)}
                        disabled={index === statSheet.tags.selected.length - 1}
                        title="Move down"
                      >
                        ▼
                      </button>
                      <button
                        className="tag-control-btn remove"
                        onClick={() => handleToggleTag(tagName)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Auto-detected tags */}
        <div className="tag-section">
          <h4>Auto-Detected Tags ({autoTags.length})</h4>
          <p className="section-description">
            Tags automatically detected from current stat values (read-only).
          </p>
          
          {autoTags.length === 0 ? (
            <div className="empty-state">
              <p>No auto-detected tags</p>
            </div>
          ) : (
            <div className="auto-tags-list">
              {autoTags.map(tagName => {
                const tag = TAGS.find(t => t.name === tagName);
                return (
                  <div key={tagName} className="auto-tag-item">
                    <span className="auto-tag-name">⚡ {tagName}</span>
                    {tag && (
                      <span className="auto-tag-description">{tag.description}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ignored tags warning */}
        {ignoredTags.length > 0 && (
          <div className="tag-section warning-section">
            <h4>⚠️ Ignored Tags Due to Conflicts</h4>
            <div className="ignored-tags-list">
              {ignoredTags.map(tagName => (
                <div key={tagName} className="ignored-tag-item">
                  <span className="ignored-tag-name">{tagName}</span>
                  <span className="ignored-reason">
                    Conflicts with higher-priority tags
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help section */}
      <div className="tag-help">
        <h4>How Tags Work</h4>
        <ul>
          <li><strong>Selection:</strong> Click checkboxes to select tags you want to apply</li>
          <li><strong>Priority:</strong> Use ▲▼ arrows to reorder. Higher priority tags apply first</li>
          <li><strong>Conflicts:</strong> Some tags conflict (e.g., "glass_cannon" vs "tank"). Lower priority conflicting tags are ignored</li>
          <li><strong>Auto-Detection:</strong> Tags marked with ⚡ are automatically detected from your current stats</li>
          <li><strong>Generate:</strong> Click "Generate Stats from Tags" to apply all active tags to your stat grid</li>
        </ul>
      </div>
    </div>
  );
}
