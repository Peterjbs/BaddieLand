'use client';

import { useState, useEffect } from 'react';
import { Character, Move, getMove } from '@/lib/firestore-helpers';
import StatsTable from './StatsTable';
import MoveEditorModal from './MoveEditorModal';

interface CharacterFormProps {
  character: Character;
  onChange: (character: Character) => void;
}

// Reference data will be loaded from data/pools
const ROLES_DATA = require('../../data/pools/roles.json');
const TAGS_DATA = require('../../data/pools/tags.json');
const SPECIES_DATA = require('../../data/pools/species.json');
const GROWTH_CURVES_DATA = require('../../data/pools/growth-curves.json');

export default function CharacterForm({ character, onChange }: CharacterFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [moves, setMoves] = useState<Move[]>([]);
  const [editingMove, setEditingMove] = useState<Move | null>(null);
  const [showMoveEditor, setShowMoveEditor] = useState(false);

  const tabs = [
    'Basic Info',
    'Visual Description',
    'Roles & Growth',
    'Tags & Conditions',
    'Level Stats',
    'Moves'
  ];

  // Load moves when character changes
  useEffect(() => {
    loadMoves();
  }, [character.move_list]);

  const loadMoves = async () => {
    try {
      const loadedMoves = await Promise.all(
        character.move_list.map(id => getMove(id))
      );
      setMoves(loadedMoves.filter(m => m !== null) as Move[]);
    } catch (error) {
      console.error('Error loading moves:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      onChange({ ...character, [field]: value });
    } else if (keys.length === 2) {
      onChange({
        ...character,
        [keys[0]]: {
          ...(character[keys[0] as keyof Character] as any),
          [keys[1]]: value
        }
      });
    }
  };

  const handleAddMove = () => {
    const newMove: Move = {
      id: `${character.id}_move_${Date.now()}`,
      name: 'New Move',
      description: '',
      type: 'melee_attack',
      target: { type: 'enemy' },
      learned_at_level: 1,
    };
    setEditingMove(newMove);
    setShowMoveEditor(true);
  };

  const handleEditMove = async (moveId: string) => {
    const move = await getMove(moveId);
    if (move) {
      setEditingMove(move);
      setShowMoveEditor(true);
    }
  };

  const handleDeleteMove = (moveId: string) => {
    onChange({
      ...character,
      move_list: character.move_list.filter(id => id !== moveId)
    });
  };

  const handleSaveMove = (move: Move) => {
    if (!character.move_list.includes(move.id)) {
      onChange({
        ...character,
        move_list: [...character.move_list, move.id]
      });
    }
    setShowMoveEditor(false);
    setEditingMove(null);
    loadMoves();
  };

  const roles = ROLES_DATA.roles.values.map((r: any) => r.id);
  const allTags = TAGS_DATA.tags.all_tags;
  const tagDetails = TAGS_DATA.tags.tag_details;
  const speciesGroups = SPECIES_DATA.species.groups;
  const growthCurves = GROWTH_CURVES_DATA.growth_curves.values.map((g: any) => g.id);

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* Tab 1: Basic Info */}
        {activeTab === 0 && (
          <div className="grid-2">
            <div className="form-group">
              <label>ID (read-only)</label>
              <input
                type="text"
                className="input"
                value={character.id}
                readOnly
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
            </div>
            
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                className="input"
                value={character.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="text"
                className="input"
                value={character.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Gang *</label>
              <select
                className="select"
                value={character.gang}
                onChange={(e) => handleInputChange('gang', e.target.value)}
              >
                <option value="GGG">GGG</option>
                <option value="MMM">MMM</option>
                <option value="BBB">BBB</option>
                <option value="PPP">PPP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Species *</label>
              <select
                className="select"
                value={character.species}
                onChange={(e) => handleInputChange('species', e.target.value)}
              >
                {speciesGroups.map((group: any) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subspecies</label>
              <input
                type="text"
                className="input"
                value={character.subspecies || ''}
                onChange={(e) => handleInputChange('subspecies', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Visual Description */}
        {activeTab === 1 && (
          <div>
            <div className="form-group">
              <label>Body and Skin</label>
              <textarea
                className="textarea"
                value={character.visual_description?.body_and_skin || ''}
                onChange={(e) => handleInputChange('visual_description.body_and_skin', e.target.value)}
                placeholder="Describe body type, skin color, physical build..."
              />
            </div>

            <div className="form-group">
              <label>Hair</label>
              <textarea
                className="textarea"
                value={character.visual_description?.hair || ''}
                onChange={(e) => handleInputChange('visual_description.hair', e.target.value)}
                placeholder="Hair color, style, length..."
              />
            </div>

            <div className="form-group">
              <label>Clothing</label>
              <textarea
                className="textarea"
                value={character.visual_description?.clothing || ''}
                onChange={(e) => handleInputChange('visual_description.clothing', e.target.value)}
                placeholder="Outfit description, colors, accessories..."
              />
            </div>

            <div className="form-group">
              <label>Distinguishing Features</label>
              <textarea
                className="textarea"
                value={character.visual_description?.distinguishing_features || ''}
                onChange={(e) => handleInputChange('visual_description.distinguishing_features', e.target.value)}
                placeholder="Scars, tattoos, unique characteristics..."
              />
            </div>

            <div className="form-group">
              <label>Weapon/Item</label>
              <input
                type="text"
                className="input"
                value={character.visual_description?.weapon_item || character.weaponItem || ''}
                onChange={(e) => handleInputChange('visual_description.weapon_item', e.target.value)}
                placeholder="Primary weapon or signature item..."
              />
            </div>

            <div className="form-group">
              <label>Specific Visuals (for AI generation)</label>
              <textarea
                className="textarea"
                value={character.visual_description?.specific_visuals || ''}
                onChange={(e) => handleInputChange('visual_description.specific_visuals', e.target.value)}
                placeholder="Specific visual instructions for sprite/avatar generation..."
              />
            </div>
          </div>
        )}

        {/* Tab 3: Roles & Growth */}
        {activeTab === 2 && (
          <div className="grid-2">
            <div className="form-group">
              <label>Primary Role *</label>
              <select
                className="select"
                value={character.roles.primary}
                onChange={(e) => handleInputChange('roles.primary', e.target.value)}
              >
                {roles.map((role: string) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Secondary Role</label>
              <select
                className="select"
                value={character.roles.secondary || ''}
                onChange={(e) => handleInputChange('roles.secondary', e.target.value)}
              >
                <option value="">None</option>
                {roles.map((role: string) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tertiary Role</label>
              <select
                className="select"
                value={character.roles.tertiary || ''}
                onChange={(e) => handleInputChange('roles.tertiary', e.target.value)}
              >
                <option value="">None</option>
                {roles.map((role: string) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Growth Curve *</label>
              <select
                className="select"
                value={character.growthCurve}
                onChange={(e) => handleInputChange('growthCurve', e.target.value)}
              >
                {growthCurves.map((curve: string) => (
                  <option key={curve} value={curve}>
                    {curve.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tab 4: Tags & Conditions */}
        {activeTab === 3 && (
          <div>
            <div className="form-group">
              <label>MaT Tags (Multiplier Affecting Tags) *</label>
              <div className="checkbox-group">
                {allTags.map((tag: string) => (
                  <label key={tag} className="checkbox-label" title={tagDetails[tag]}>
                    <input
                      type="checkbox"
                      checked={character.matTags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onChange({
                            ...character,
                            matTags: [...character.matTags, tag]
                          });
                        } else {
                          onChange({
                            ...character,
                            matTags: character.matTags.filter(t => t !== tag)
                          });
                        }
                      }}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Level Stats */}
        {activeTab === 4 && (
          <StatsTable
            character={character}
            onChange={onChange}
          />
        )}

        {/* Tab 6: Moves */}
        {activeTab === 5 && (
          <div>
            <button className="button" onClick={handleAddMove} style={{ marginBottom: '1rem' }}>
              + Add Move
            </button>

            <div className="move-list">
              {moves.map(move => (
                <div key={move.id} className="move-item">
                  <div className="move-item-content">
                    <h4>{move.name}</h4>
                    <div className="move-item-meta">
                      Type: {move.type} | Target: {move.target.type} | Level: {move.learned_at_level}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {move.description}
                    </p>
                  </div>
                  <div className="move-item-actions">
                    <button 
                      className="button button-small button-secondary" 
                      onClick={() => handleEditMove(move.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="button button-small button-danger" 
                      onClick={() => handleDeleteMove(move.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Move Editor Modal */}
      {showMoveEditor && editingMove && (
        <MoveEditorModal
          move={editingMove}
          onSave={handleSaveMove}
          onClose={() => {
            setShowMoveEditor(false);
            setEditingMove(null);
          }}
        />
      )}
    </div>
  );
}
