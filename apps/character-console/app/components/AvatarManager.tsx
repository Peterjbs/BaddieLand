'use client';

import { useState } from 'react';
import { Character } from '@/lib/schemas';

interface AvatarManagerProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export default function AvatarManager({ character, onUpdate }: AvatarManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    // Placeholder - would call Firebase function
    alert('Avatar generation requires Firebase Cloud Functions to be deployed.');
    setIsGenerating(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Avatar Management</h3>

      {/* Active Avatar */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Active Avatar</h4>
        {character.activeAvatar ? (
          <div className="bg-gray-700 rounded-lg p-4">
            <img
              src={character.activeAvatar}
              alt={`${character.name} avatar`}
              className="w-48 h-48 object-cover rounded"
            />
          </div>
        ) : (
          <div className="bg-gray-700 rounded-lg p-4 text-gray-400">
            No active avatar set
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerateAvatar}
          disabled={isGenerating}
          className={`w-full font-bold py-2 px-4 rounded transition ${
            isGenerating
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate New Avatar'}
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Note: Avatar generation requires Firebase Cloud Functions
        </p>
      </div>

      {/* Unapproved Avatars */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Unapproved Avatars</h4>
        {character.unapprovedAvatars && character.unapprovedAvatars.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {character.unapprovedAvatars.map((avatarPath, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-2">
                <img
                  src={avatarPath}
                  alt={`Unapproved ${index + 1}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded">
                    Approve
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-700 rounded-lg p-4 text-gray-400">
            No unapproved avatars
          </div>
        )}
      </div>

      {/* Rejected Avatars (Collapsible) */}
      {character.rejectedAvatars && character.rejectedAvatars.length > 0 && (
        <div>
          <details className="bg-gray-700 rounded-lg p-4">
            <summary className="cursor-pointer font-semibold">
              Rejected Avatars ({character.rejectedAvatars.length})
            </summary>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {character.rejectedAvatars.map((avatarPath, index) => (
                <img
                  key={index}
                  src={avatarPath}
                  alt={`Rejected ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
