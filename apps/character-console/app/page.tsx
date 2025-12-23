'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Character } from '@/lib/schemas';
import { v4 as uuidv4 } from 'uuid';

export default function CharacterConsole() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error('Error creating character:', err);
      setError('Failed to create character.');
    }
  };

  const deleteCharacter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      await deleteDoc(doc(db, 'characters', id));
      setCharacters(characters.filter(c => c.id !== id));
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(null);
      }
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
        <h1 className="text-3xl font-bold text-center">BaddieLand Character Console</h1>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={createNewCharacter}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Create New Character
            </button>
          </div>

          <div className="px-4 pb-4 space-y-2">
            {error && (
              <div className="bg-red-600/20 border border-red-600 text-red-200 px-4 py-2 rounded">
                {error}
              </div>
            )}
            
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedCharacter?.id === character.id
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold">{character.name}</div>
                <div className="text-sm text-gray-300">{character.species}</div>
                <div className="text-xs text-gray-400">{character.gang}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {selectedCharacter ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
                <button
                  onClick={() => deleteCharacter(selectedCharacter.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Delete Character
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Character Details</h3>
                <div className="space-y-2">
                  <div><strong>ID:</strong> {selectedCharacter.id}</div>
                  <div><strong>Name:</strong> {selectedCharacter.name}</div>
                  <div><strong>Gang:</strong> {selectedCharacter.gang}</div>
                  <div><strong>Species:</strong> {selectedCharacter.species}</div>
                  <div><strong>Primary Role:</strong> {selectedCharacter.roles.primary}</div>
                  <div><strong>Growth Curve:</strong> {selectedCharacter.growthCurve}</div>
                </div>
              </div>

              <div className="mt-4 text-gray-400">
                <p>Full character editor components will be added here.</p>
                <p className="mt-2">Components to implement:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>IdentityForm</li>
                  <li>VisualDescriptionForm</li>
                  <li>AvatarManager</li>
                  <li>SpriteSheetManager</li>
                  <li>LevelStatsTable</li>
                  <li>MovesEditor</li>
                </ul>
              </div>
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
