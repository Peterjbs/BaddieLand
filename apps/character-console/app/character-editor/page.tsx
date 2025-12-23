'use client';

import { useState, useEffect } from 'react';
import { Character, getAllCharacters, getCharactersByGang, saveCharacter, deleteCharacter } from '@/lib/firestore-helpers';
import { DEFAULT_CHARACTER } from '@/lib/constants';
import CharacterForm from '@/components/CharacterForm';
import AssetManager from '@/components/AssetManager';
import '../character-editor-styles.css';

export default function CharacterEditor() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [gangFilter, setGangFilter] = useState<string>('all');
  const [templateSelection, setTemplateSelection] = useState<string>('walker_swim');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load characters on mount
  useEffect(() => {
    loadCharacters();
  }, []);

  // Load characters filtered by gang
  useEffect(() => {
    if (gangFilter !== 'all') {
      loadCharactersByGang(gangFilter);
    } else {
      loadCharacters();
    }
  }, [gangFilter]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const chars = await getAllCharacters();
      setCharacters(chars);
    } catch (error) {
      showToast('Failed to load characters', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCharactersByGang = async (gang: string) => {
    try {
      setLoading(true);
      const chars = await getCharactersByGang(gang);
      setCharacters(chars);
    } catch (error) {
      showToast('Failed to load characters', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCharacter = async () => {
    if (!selectedCharacter) return;

    try {
      setSaving(true);
      await saveCharacter(selectedCharacter);
      showToast('Character saved successfully', 'success');
      await loadCharacters();
    } catch (error) {
      showToast('Failed to save character', 'error');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!selectedCharacter) return;

    try {
      await deleteCharacter(selectedCharacter.id);
      showToast('Character deleted successfully', 'success');
      setSelectedCharacter(null);
      setShowDeleteConfirm(false);
      await loadCharacters();
    } catch (error) {
      showToast('Failed to delete character', 'error');
      console.error(error);
    }
  };

  const handleCreateNewCharacter = () => {
    const newCharacter: Character = {
      id: `NEW_${Date.now()}`,
      ...DEFAULT_CHARACTER,
    };
    setSelectedCharacter(newCharacter);
    setShowCreateModal(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCharacterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const charId = e.target.value;
    const char = characters.find(c => c.id === charId);
    setSelectedCharacter(char || null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCharacter();
      }
      if (e.key === 'Escape') {
        setShowCreateModal(false);
        setShowDeleteConfirm(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCharacter]);

  return (
    <div className="editor-container">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3>Character Selection</h3>
          
          <div className="form-group">
            <label>Character</label>
            <select 
              className="select" 
              value={selectedCharacter?.id || ''} 
              onChange={handleCharacterSelect}
              disabled={loading}
            >
              <option value="">Select a character...</option>
              {characters.map(char => (
                <option key={char.id} value={char.id}>
                  {char.name} ({char.id})
                </option>
              ))}
            </select>
          </div>

          <button 
            className="button button-full" 
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Character
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Filters</h3>
          <div className="form-group">
            <label>Gang</label>
            <select 
              className="select" 
              value={gangFilter} 
              onChange={(e) => setGangFilter(e.target.value)}
            >
              <option value="all">All Gangs</option>
              <option value="GGG">GGG</option>
              <option value="MMM">MMM</option>
              <option value="BBB">BBB</option>
              <option value="PPP">PPP</option>
            </select>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Template</h3>
          <div className="form-group">
            <label>Sprite Sheet Template</label>
            <select 
              className="select" 
              value={templateSelection} 
              onChange={(e) => setTemplateSelection(e.target.value)}
            >
              <option value="walker_swim">Walker Swim</option>
              <option value="walker_swim_fly">Walker Swim Fly</option>
              <option value="hover_flying">Hover Flying</option>
              <option value="constant_motion_fx">Constant Motion FX</option>
            </select>
          </div>
        </div>

        {selectedCharacter && (
          <div className="sidebar-section">
            <h3>Actions</h3>
            <button 
              className="button button-full" 
              onClick={handleSaveCharacter}
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Character'}
            </button>
            <button 
              className="button button-danger button-full" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              🗑️ Delete Character
            </button>
          </div>
        )}
      </aside>

      {/* Center Panel */}
      <main className="main-panel">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : selectedCharacter ? (
          <CharacterForm 
            character={selectedCharacter} 
            onChange={setSelectedCharacter}
          />
        ) : (
          <div className="empty-state">
            <h2>No Character Selected</h2>
            <p>Select a character from the dropdown or create a new one to get started.</p>
          </div>
        )}
      </main>

      {/* Right Panel */}
      <aside className="sidebar-right">
        {selectedCharacter ? (
          <AssetManager 
            character={selectedCharacter}
            templateType={templateSelection}
            onUpdate={setSelectedCharacter}
          />
        ) : (
          <div className="empty-state">
            <p>Select a character to manage assets</p>
          </div>
        )}
      </aside>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Character</h2>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <p>This will create a new character with default values that you can customize.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="button" onClick={handleCreateNewCharacter}>Create</button>
              <button className="button button-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Character</h2>
              <button className="close-button" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            <p>Are you sure you want to delete <strong>{selectedCharacter?.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="button button-danger" onClick={handleDeleteCharacter}>Delete</button>
              <button className="button button-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
