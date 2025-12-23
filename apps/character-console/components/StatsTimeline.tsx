'use client';

import { useState, useMemo } from 'react';
import { StatSheet } from '@/lib/stat-utils';
import { buildTimeline } from '@/lib/stat-constants';

interface StatsTimelineProps {
  statSheet: StatSheet;
}

export default function StatsTimeline({ statSheet }: StatsTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Build timeline from current stat grid
  const timelineData = useMemo(
    () => buildTimeline(statSheet.stats),
    [statSheet.stats]
  );

  const { firstNonZero, timeline } = timelineData;

  return (
    <div className="stats-timeline-container">
      <div className="timeline-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h4>📅 Stats Timeline</h4>
        <button className="expand-btn">
          {isExpanded ? '▼ Collapse' : '▶ Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="timeline-content">
          <div className="timeline-description">
            <p>
              This timeline shows when each stat first becomes non-zero (LEARN) 
              and when significant jumps occur (BOOST).
            </p>
          </div>

          {/* First non-zero table */}
          <div className="timeline-section">
            <h5>Stat Unlock Levels</h5>
            <div className="first-nonzero-grid">
              {Object.entries(firstNonZero).map(([statKey, level]) => (
                <div key={statKey} className="stat-unlock-item">
                  <span className="stat-key">{statKey}</span>
                  <span className="unlock-level">Lv{level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline events */}
          <div className="timeline-section">
            <h5>Level Progression</h5>
            {timeline.length === 0 ? (
              <div className="empty-state">
                <p>No events to display. Add some stats to see the timeline.</p>
              </div>
            ) : (
              <div className="timeline-events">
                {timeline.map((event, index) => {
                  // Parse level from event string
                  const levelMatch = event.match(/Level (\d+):/);
                  const level = levelMatch ? parseInt(levelMatch[1]) : 0;
                  
                  // Check if this event has LEARN or BOOST
                  const hasLearn = event.includes('LEARN');
                  const hasBoost = event.includes('BOOST');
                  
                  return (
                    <div key={index} className="timeline-event">
                      <div className="event-level">
                        <span className="level-badge">Lv{level}</span>
                      </div>
                      <div className="event-content">
                        <div className="event-text">{event.replace(/Level \d+:\s*/, '')}</div>
                        <div className="event-badges">
                          {hasLearn && <span className="event-type-badge learn">LEARN</span>}
                          {hasBoost && <span className="event-type-badge boost">BOOST</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary stats */}
          <div className="timeline-section">
            <h5>Summary</h5>
            <div className="timeline-summary">
              <div className="summary-item">
                <span className="summary-label">Total Stats Unlocked:</span>
                <span className="summary-value">{Object.keys(firstNonZero).length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Events:</span>
                <span className="summary-value">{timeline.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Earliest Unlock:</span>
                <span className="summary-value">
                  {Object.keys(firstNonZero).length > 0
                    ? `Lv${Math.min(...Object.values(firstNonZero))}`
                    : 'N/A'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Latest Unlock:</span>
                <span className="summary-value">
                  {Object.keys(firstNonZero).length > 0
                    ? `Lv${Math.max(...Object.values(firstNonZero))}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Level-by-level breakdown */}
          <div className="timeline-section">
            <h5>Level-by-Level Breakdown</h5>
            <div className="level-breakdown">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(level => {
                const events = timeline.filter(e => e.startsWith(`Level ${level}:`));
                const learns = Object.entries(firstNonZero)
                  .filter(([_, l]) => l === level)
                  .map(([stat]) => stat);
                
                return (
                  <div key={level} className="level-breakdown-item">
                    <div className="level-number">Level {level}</div>
                    <div className="level-details">
                      {events.length === 0 ? (
                        <span className="no-events">No events</span>
                      ) : (
                        <>
                          {learns.length > 0 && (
                            <div className="learns-list">
                              <strong>Unlocks:</strong> {learns.join(', ')}
                            </div>
                          )}
                          {events.map((event, idx) => (
                            <div key={idx} className="event-detail">
                              {event.replace(`Level ${level}: `, '')}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
