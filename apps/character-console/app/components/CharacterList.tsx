'use client';

import { Character } from '@/lib/schemas';
import { Gang, gangColors } from '@/lib/constants';
import { useState } from 'react';

interface CharacterListProps {
  characters: Character[];
  selectedCharacter: Character | null;
  onSelect: (character: Character) => void;
  onCreateNew: () => void;
}

export default function CharacterList({
  characters,
  selectedCharacter,
  onSelect,
  onCreateNew,
}: CharacterListProps) {
  const [gangFilter, setGangFilter] = useState<Gang | 'ALL'>('ALL');

  const filteredCharacters = gangFilter === 'ALL'
    ? characters
    : characters.filter(c => c.gang === gangFilter);

  const getGangColorClass = (gang: Gang) => {
    switch (gang) {
      case 'GGG': return 'text-green-400 border-green-600';
      case 'MMM': return 'text-red-400 border-red-600';
      case 'BBB': return 'text-blue-400 border-blue-600';
      case 'PPP': return 'text-purple-400 border-purple-600';
    }
  };

  return (
    <aside className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      {/* Create Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onCreateNew}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition"
        >
          + Create New Character
        </button>
      </div>

      {/* Gang Filters */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-sm font-semibold text-gray-300 mb-2">Filter by Gang</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setGangFilter('ALL')}
            className={`px-3 py-1 rounded text-sm transition ${
              gangFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ALL
          </button>
          {(['GGG', 'MMM', 'BBB', 'PPP'] as Gang[]).map((gang) => (
            <button
              key={gang}
              onClick={() => setGangFilter(gang)}
              className={`px-3 py-1 rounded text-sm transition ${
                gangFilter === gang
                  ? `bg-${gangColors[gang]} text-white`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {gang}
            </button>
          ))}
        </div>
      </div>

      {/* Character List */}
      <div className="p-4 space-y-2">
        {filteredCharacters.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No characters {gangFilter !== 'ALL' && `in ${gangFilter}`}
          </div>
        ) : (
          filteredCharacters.map((character) => (
            <div
              key={character.id}
              onClick={() => onSelect(character)}
              className={`p-4 rounded cursor-pointer transition border-l-4 ${
                selectedCharacter?.id === character.id
                  ? 'bg-blue-600 border-blue-400'
                  : `bg-gray-700 hover:bg-gray-600 ${getGangColorClass(character.gang)}`
              }`}
            >
              <div className="font-semibold text-lg">{character.name}</div>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <span className={getGangColorClass(character.gang).split(' ')[0]}>
                  {character.gang}
                </span>
                <span>•</span>
                <span>{character.species}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {character.roles.primary}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
