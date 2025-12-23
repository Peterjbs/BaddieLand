'use client';

import { useState } from 'react';
import { Move, saveMove } from '@/lib/firestore-helpers';
import { getMoveTypes, getAllTags, getEnvironmentalConditions } from '@/lib/reference-data';

interface MoveEditorModalProps {
  move: Move;
  onSave: (move: Move) => void;
  onClose: () => void;
}

export default function MoveEditorModal({ move: initialMove, onSave, onClose }: MoveEditorModalProps) {
  const [move, setMove] = useState<Move>(initialMove);
  const [saving, setSaving] = useState(false);

  const moveTypes = getMoveTypes();
  const allTags = getAllTags();
  const envConditions = getEnvironmentalConditions();

  const handleInputChange = (field: string, value: any) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setMove({ ...move, [field]: value });
    } else if (keys.length === 2) {
      setMove({
        ...move,
        [keys[0]]: {
          ...(move[keys[0] as keyof Move] as any),
          [keys[1]]: value
        }
      });
    }
  };

  const handleAddMat = () => {
    setMove({
      ...move,
      target_mats: [...(move.target_mats || []), { tag: allTags[0], multiplier: 1.0 }]
    });
  };

  const handleRemoveMat = (index: number) => {
    setMove({
      ...move,
      target_mats: move.target_mats?.filter((_, i) => i !== index)
    });
  };

  const handleUpdateMat = (index: number, field: 'tag' | 'multiplier', value: any) => {
    if (!move.target_mats) return;
    const newMats = [...move.target_mats];
    newMats[index] = { ...newMats[index], [field]: value };
    setMove({ ...move, target_mats: newMats });
  };

  const handleAddMaec = () => {
    setMove({
      ...move,
      target_maecs: [...(move.target_maecs || []), { condition: envConditions[0], multiplier: 1.0 }]
    });
  };

  const handleRemoveMaec = (index: number) => {
    setMove({
      ...move,
      target_maecs: move.target_maecs?.filter((_, i) => i !== index)
    });
  };

  const handleUpdateMaec = (index: number, field: 'condition' | 'multiplier', value: any) => {
    if (!move.target_maecs) return;
    const newMaecs = [...move.target_maecs];
    newMaecs[index] = { ...newMaecs[index], [field]: value };
    setMove({ ...move, target_maecs: newMaecs });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveMove(move);
      onSave(move);
    } catch (error) {
      console.error('Error saving move:', error);
      alert('Failed to save move');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <h2>Edit Move</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label>Move ID (read-only)</label>
              <input
                type="text"
                className="input"
                value={move.id}
                readOnly
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
            </div>

            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                className="input"
                value={move.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              className="textarea"
              value={move.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this move does..."
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Type *</label>
              <select
                className="select"
                value={move.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                {moveTypes.map((type: string) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Learned at Level *</label>
              <input
                type="number"
                className="input"
                value={move.learned_at_level}
                onChange={(e) => handleInputChange('learned_at_level', parseInt(e.target.value) || 1)}
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Target Type *</label>
              <select
                className="select"
                value={move.target.type}
                onChange={(e) => handleInputChange('target.type', e.target.value)}
              >
                <option value="enemy">Single Enemy</option>
                <option value="enemies_in_range">Enemies in Range</option>
                <option value="random_enemies">Random Enemies</option>
                <option value="ally">Single Ally</option>
                <option value="self">Self</option>
                <option value="environment">Environment</option>
                <option value="all">All</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Count</label>
              <input
                type="number"
                className="input"
                value={move.target.count || ''}
                onChange={(e) => handleInputChange('target.count', parseInt(e.target.value) || undefined)}
                min={1}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Effect Algorithm (Formula)</label>
            <textarea
              className="textarea"
              value={move.effect_algorithm || ''}
              onChange={(e) => handleInputChange('effect_algorithm', e.target.value)}
              placeholder="e.g., MLA * 1.5 + SPD * 0.5"
            />
          </div>

          {/* MaTs Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--accent-primary)' }}>MaTs (Tag Multipliers)</h3>
              <button className="button button-small" onClick={handleAddMat}>+ Add MaT</button>
            </div>
            
            {move.target_mats && move.target_mats.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {move.target_mats.map((mat, index) => (
                  <div key={index} className="grid-2" style={{ alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Tag</label>
                      <select
                        className="select"
                        value={mat.tag}
                        onChange={(e) => handleUpdateMat(index, 'tag', e.target.value)}
                      >
                        {allTags.map((tag: string) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                        <label>Multiplier</label>
                        <input
                          type="number"
                          step="0.1"
                          className="input"
                          value={mat.multiplier}
                          onChange={(e) => handleUpdateMat(index, 'multiplier', parseFloat(e.target.value) || 1.0)}
                        />
                      </div>
                      <button 
                        className="button button-danger button-small" 
                        onClick={() => handleRemoveMat(index)}
                        style={{ height: 'fit-content', alignSelf: 'end' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No MaTs added</p>
            )}
          </div>

          {/* MaECs Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--accent-primary)' }}>MaECs (Condition Multipliers)</h3>
              <button className="button button-small" onClick={handleAddMaec}>+ Add MaEC</button>
            </div>
            
            {move.target_maecs && move.target_maecs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {move.target_maecs.map((maec, index) => (
                  <div key={index} className="grid-2" style={{ alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Condition</label>
                      <select
                        className="select"
                        value={maec.condition}
                        onChange={(e) => handleUpdateMaec(index, 'condition', e.target.value)}
                      >
                        {envConditions.map((cond: string) => (
                          <option key={cond} value={cond}>{cond}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                        <label>Multiplier</label>
                        <input
                          type="number"
                          step="0.1"
                          className="input"
                          value={maec.multiplier}
                          onChange={(e) => handleUpdateMaec(index, 'multiplier', parseFloat(e.target.value) || 1.0)}
                        />
                      </div>
                      <button 
                        className="button button-danger button-small" 
                        onClick={() => handleRemoveMaec(index)}
                        style={{ height: 'fit-content', alignSelf: 'end' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No MaECs added</p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Move'}
            </button>
            <button className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
