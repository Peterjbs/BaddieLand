'use client';

import { useState } from 'react';
import { Character } from '@/lib/schemas';

interface SpriteSheetManagerProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

const templateTypes = [
  'walker_swim',
  'walker_swim_fly',
  'hover_flying',
  'constant_motion_fx',
];

export default function SpriteSheetManager({ character, onUpdate }: SpriteSheetManagerProps) {
  const [templateType, setTemplateType] = useState('walker_swim');
  const [feedback, setFeedback] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    // Placeholder - would call Firebase function
    alert('Sprite sheet generation requires Firebase Cloud Functions to be deployed.');
    setIsGenerating(false);
  };

  const handleSaveToStorage = async () => {
    alert('Sprite sheet finalization requires Firebase Cloud Functions to be deployed.');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Sprite Sheet Management</h3>

      {/* Latest Sprite Sheet */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Latest Sprite Sheet</h4>
        {character.latestSpriteSheet ? (
          <div className="bg-gray-700 rounded-lg p-4">
            <img
              src={character.latestSpriteSheet.path}
              alt="Latest sprite sheet"
              className="w-full max-w-lg rounded mb-2"
            />
            <div className="text-sm text-gray-400">
              <p>Template: {character.latestSpriteSheet.templateType}</p>
              {character.latestSpriteSheet.metadata && (
                <p>Metadata: {JSON.stringify(character.latestSpriteSheet.metadata)}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-700 rounded-lg p-4 text-gray-400">
            No sprite sheet generated yet
          </div>
        )}
      </div>

      {/* Template Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Template Type</label>
        <select
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
        >
          {templateTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Feedback */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Feedback for Iterative Refinement
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 resize-vertical"
          placeholder="Enter feedback to refine the sprite sheet generation..."
        />
      </div>

      {/* Generate Button */}
      <div className="mb-4">
        <button
          onClick={handleGenerateDraft}
          disabled={isGenerating}
          className={`w-full font-bold py-2 px-4 rounded transition ${
            isGenerating
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isGenerating ? 'Generating Draft...' : 'Generate Draft'}
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Note: Sprite sheet generation requires Firebase Cloud Functions
        </p>
      </div>

      {/* Prompt Preview */}
      <div className="mb-4">
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          className="w-full text-left bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
        >
          <span className="font-semibold">Prompt Preview</span>
          <span className="float-right">{showPrompt ? '−' : '+'}</span>
        </button>
        {showPrompt && (
          <div className="mt-2 bg-gray-700 rounded-lg p-4 text-sm font-mono">
            <p>Template: {templateType}</p>
            <p>Character: {character.name}</p>
            <p>Species: {character.species}</p>
            <p>Visual Description: {character.visual_description ? JSON.stringify(character.visual_description) : 'None'}</p>
            {feedback && <p>Feedback: {feedback}</p>}
          </div>
        )}
      </div>

      {/* Save Button */}
      {character.latestSpriteSheet && (
        <button
          onClick={handleSaveToStorage}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Save to Storage
        </button>
      )}
    </div>
  );
}
