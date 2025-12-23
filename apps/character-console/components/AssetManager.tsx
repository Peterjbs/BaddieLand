'use client';

import { useState } from 'react';
import { Character } from '@/lib/firestore-helpers';

interface AssetManagerProps {
  character: Character;
  templateType: string;
  onUpdate: (character: Character) => void;
}

export default function AssetManager({ character, templateType, onUpdate }: AssetManagerProps) {
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [generatingSpriteSheet, setGeneratingSpriteSheet] = useState(false);
  const [generatingAtlas, setGeneratingAtlas] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerateAvatar = async () => {
    try {
      setGeneratingAvatar(true);
      
      // Call Firebase Function to generate avatar
      // For now, this is a placeholder
      // const result = await fetch('/api/generateAvatar', {
      //   method: 'POST',
      //   body: JSON.stringify({ characterId: character.id }),
      // });
      
      showToast('Avatar generation started (placeholder)');
      
      // TODO: Implement actual Firebase function call
    } catch (error) {
      console.error('Error generating avatar:', error);
      showToast('Failed to generate avatar');
    } finally {
      setGeneratingAvatar(false);
    }
  };

  const handleGenerateSpriteSheet = async () => {
    try {
      setGeneratingSpriteSheet(true);
      
      // Call Firebase Function to generate sprite sheet
      // For now, this is a placeholder
      showToast('Sprite sheet generation started (placeholder)');
      
      // TODO: Implement actual Firebase function call
    } catch (error) {
      console.error('Error generating sprite sheet:', error);
      showToast('Failed to generate sprite sheet');
    } finally {
      setGeneratingSpriteSheet(false);
    }
  };

  const handleGenerateAtlas = async () => {
    try {
      setGeneratingAtlas(true);
      
      // Call Firebase Function to generate tile atlas
      // For now, this is a placeholder
      showToast('Tile atlas generation started (placeholder)');
      
      // TODO: Implement actual Firebase function call
    } catch (error) {
      console.error('Error generating atlas:', error);
      showToast('Failed to generate tile atlas');
    } finally {
      setGeneratingAtlas(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Avatar Section */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Avatar</h3>
        
        <div className="asset-preview">
          {character.activeAvatar ? (
            <img src={character.activeAvatar} alt="Character Avatar" />
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No avatar</p>
          )}
        </div>

        <button 
          className="button button-full" 
          onClick={handleGenerateAvatar}
          disabled={generatingAvatar}
        >
          {generatingAvatar ? 'Generating...' : '🎨 Generate New Avatar'}
        </button>

        {/* Draft avatars would be listed here */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Drafts will appear here after generation
          </p>
        </div>
      </div>

      {/* Sprite Sheet Section */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Sprite Sheet</h3>
        
        <div className="asset-preview" style={{ aspectRatio: '2/1' }}>
          {character.latestSpritesheet ? (
            <img src={character.latestSpritesheet} alt="Character Sprite Sheet" />
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No sprite sheet</p>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Template: {templateType}</label>
        </div>

        <div className="form-group">
          <label>Feedback for Regeneration</label>
          <textarea
            className="textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback to improve the sprite sheet generation..."
            style={{ minHeight: '80px' }}
          />
        </div>

        <button 
          className="button button-full" 
          onClick={handleGenerateSpriteSheet}
          disabled={generatingSpriteSheet}
        >
          {generatingSpriteSheet ? 'Generating...' : '🎨 Generate Sprite Sheet'}
        </button>

        {/* Draft sprite sheets would be listed here */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Drafts will appear here after generation
          </p>
        </div>
      </div>

      {/* Tile Atlas Section */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Tile Atlas</h3>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Generate a tile atlas from the current sprite sheet
        </p>

        <button 
          className="button button-full" 
          onClick={handleGenerateAtlas}
          disabled={generatingAtlas || !character.latestSpritesheet}
        >
          {generatingAtlas ? 'Generating...' : '📦 Generate Tile Atlas'}
        </button>

        {!character.latestSpritesheet && (
          <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
            Generate a sprite sheet first
          </p>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1rem',
          zIndex: 1000,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
