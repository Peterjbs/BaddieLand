'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Character } from '@/lib/schemas';
import { v4 as uuidv4 } from 'uuid';
import CharacterList from './components/CharacterList';
import IdentityForm from './components/IdentityForm';
import VisualDescriptionForm from './components/VisualDescriptionForm';
import AvatarManager from './components/AvatarManager';
import SpriteSheetManager from './components/SpriteSheetManager';
import LevelStatsTable from './components/LevelStatsTable';
import MovesEditor from './components/MovesEditor';

export default function CharacterConsole() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Load characters from Firestore
  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const charactersCollection = collection(db, 'characters');
      const snapshot = await getDocs(charactersCollection);
      const loadedCharacters = snapshot.docs.map(doc => ({
        ...doc.data() as Character,
        id: doc.id,
      }));
      setCharacters(loadedCharacters);
    } catch (err: any) {
      console.error('Error loading characters:', err);
      setError('Failed to load characters. Please check Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const createNewCharacter = async () => {
    const newId = uuidv4();
    const newCharacter: Character = {
      id: newId,
      name: 'New Character',
      gang: 'GGG',
      species: 'human',
      roles: {
        primary: 'bruiser',
      },
      growthCurve: 'steady',
      matTags: [],
      moves: [],
    };

    try {
      await setDoc(doc(db, 'characters', newId), newCharacter);
      setCharacters([...characters, newCharacter]);
      setSelectedCharacter(newCharacter);
      setSaveStatus('Character created successfully');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err: any) {
      console.error('Error creating character:', err);
      setError('Failed to create character.');
    }
  };

  const updateCharacter = useCallback(async (characterId: string, updates: Partial<Character>) => {
    try {
      setSaveStatus('Saving...');
      await updateDoc(doc(db, 'characters', characterId), updates as any);
      
      // Update local state
      setCharacters(prev => prev.map(c => 
        c.id === characterId ? { ...c, ...updates } : c
      ));
      
      if (selectedCharacter?.id === characterId) {
        setSelectedCharacter(prev => prev ? { ...prev, ...updates } : null);
      }
      
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err: any) {
      console.error('Error updating character:', err);
      setError('Failed to update character.');
      setSaveStatus('Error saving');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [selectedCharacter]);

  const deleteCharacter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      await deleteDoc(doc(db, 'characters', id));
      setCharacters(characters.filter(c => c.id !== id));
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(null);
      }
      setSaveStatus('Character deleted');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err: any) {
      console.error('Error deleting character:', err);
      setError('Failed to delete character.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading characters...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">BaddieLand Character Console</h1>
          {saveStatus && (
            <div className={`px-4 py-2 rounded text-sm ${
              saveStatus.includes('Error') ? 'bg-red-600' : 'bg-green-600'
            }`}>
              {saveStatus}
            </div>
          )}
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <CharacterList
          characters={characters}
          selectedCharacter={selectedCharacter}
          onSelect={setSelectedCharacter}
          onCreateNew={createNewCharacter}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          {selectedCharacter ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{selectedCharacter.name}</h2>
                <button
                  onClick={() => deleteCharacter(selectedCharacter.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Delete Character
                </button>
              </div>

              <IdentityForm
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />

              <VisualDescriptionForm
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />

              <AvatarManager
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />

              <SpriteSheetManager
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />

              <LevelStatsTable
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />

              <MovesEditor
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-xl">Select a character to edit or create a new one</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
