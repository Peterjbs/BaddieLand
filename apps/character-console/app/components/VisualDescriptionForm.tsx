'use client';

import { useState, useEffect } from 'react';
import { Character, VisualDescription } from '@/lib/schemas';

interface VisualDescriptionFormProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export default function VisualDescriptionForm({ character, onUpdate }: VisualDescriptionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visualDescription, setVisualDescription] = useState<VisualDescription>(
    character.visual_description || {}
  );

  useEffect(() => {
    setVisualDescription(character.visual_description || {});
  }, [character]);

  const handleChange = (field: keyof VisualDescription, value: string) => {
    const updated = { ...visualDescription, [field]: value };
    setVisualDescription(updated);
  };

  const handleBlur = () => {
    onUpdate({ visual_description: visualDescription });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-xl font-semibold mb-4"
      >
        <span>Visual Description</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="space-y-4">
          {/* Body and Skin */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Body and Skin</label>
            <textarea
              value={visualDescription.body_and_skin || ''}
              onChange={(e) => handleChange('body_and_skin', e.target.value)}
              onBlur={handleBlur}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Describe the character's body type, build, and skin characteristics..."
            />
          </div>

          {/* Hair */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hair</label>
            <textarea
              value={visualDescription.hair || ''}
              onChange={(e) => handleChange('hair', e.target.value)}
              onBlur={handleBlur}
              rows={2}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Describe hair color, style, length..."
            />
          </div>

          {/* Clothing */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Clothing</label>
            <textarea
              value={visualDescription.clothing || ''}
              onChange={(e) => handleChange('clothing', e.target.value)}
              onBlur={handleBlur}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Describe what the character wears..."
            />
          </div>

          {/* Distinguishing Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Distinguishing Features</label>
            <textarea
              value={visualDescription.distinguishing_features || ''}
              onChange={(e) => handleChange('distinguishing_features', e.target.value)}
              onBlur={handleBlur}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Scars, tattoos, unique markings..."
            />
          </div>

          {/* Weapon Item */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Weapon Item Visual</label>
            <textarea
              value={visualDescription.weapon_item || ''}
              onChange={(e) => handleChange('weapon_item', e.target.value)}
              onBlur={handleBlur}
              rows={2}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Visual description of the weapon..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
