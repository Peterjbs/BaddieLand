'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/lib/schemas';
import { roles, tags, species, growthCurves, gangs } from '@/lib/constants';

interface IdentityFormProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export default function IdentityForm({ character, onUpdate }: IdentityFormProps) {
  const [localCharacter, setLocalCharacter] = useState(character);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localCharacter, [field]: value };
    setLocalCharacter(updated);
  };

  const handleBlur = (field: string) => {
    // Auto-save on blur
    onUpdate({ [field]: localCharacter[field as keyof Character] });
  };

  const handleRoleChange = (roleType: 'primary' | 'secondary' | 'tertiary', value: string) => {
    const updatedRoles = { ...localCharacter.roles, [roleType]: value || undefined };
    setLocalCharacter({ ...localCharacter, roles: updatedRoles });
    onUpdate({ roles: updatedRoles });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = localCharacter.matTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    if (newTags.length <= 10) {
      setLocalCharacter({ ...localCharacter, matTags: newTags });
      onUpdate({ matTags: newTags });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold mb-4">Identity</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">ID</label>
          <input
            type="text"
            value={localCharacter.id}
            disabled
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
          <input
            type="text"
            value={localCharacter.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
          <input
            type="number"
            value={localCharacter.age || ''}
            onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
            onBlur={() => handleBlur('age')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Gang */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gang *</label>
          <select
            value={localCharacter.gang}
            onChange={(e) => {
              handleChange('gang', e.target.value);
              handleBlur('gang');
            }}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {gangs.map((gang) => (
              <option key={gang} value={gang}>{gang}</option>
            ))}
          </select>
        </div>

        {/* Species */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Species *</label>
          <select
            value={localCharacter.species}
            onChange={(e) => {
              handleChange('species', e.target.value);
              handleBlur('species');
            }}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {species.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Subspecies */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subspecies</label>
          <input
            type="text"
            value={localCharacter.subspecies || ''}
            onChange={(e) => handleChange('subspecies', e.target.value)}
            onBlur={() => handleBlur('subspecies')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Specific Visuals */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Specific Visuals</label>
          <input
            type="text"
            value={localCharacter.specific_visuals || ''}
            onChange={(e) => handleChange('specific_visuals', e.target.value)}
            onBlur={() => handleBlur('specific_visuals')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Roles */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Roles</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Primary *</label>
            <select
              value={localCharacter.roles.primary}
              onChange={(e) => handleRoleChange('primary', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Secondary</label>
            <select
              value={localCharacter.roles.secondary || ''}
              onChange={(e) => handleRoleChange('secondary', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tertiary</label>
            <select
              value={localCharacter.roles.tertiary || ''}
              onChange={(e) => handleRoleChange('tertiary', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Growth Curve */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Growth Curve *</label>
        <select
          value={localCharacter.growthCurve}
          onChange={(e) => {
            handleChange('growthCurve', e.target.value);
            handleBlur('growthCurve');
          }}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {growthCurves.map((curve) => (
            <option key={curve.id} value={curve.id}>{curve.name}</option>
          ))}
        </select>
      </div>

      {/* Weapon Item */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Weapon Item</label>
        <input
          type="text"
          value={localCharacter.weaponItem || ''}
          onChange={(e) => handleChange('weaponItem', e.target.value)}
          onBlur={() => handleBlur('weaponItem')}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* MaT Tags */}
      <div>
        <h4 className="text-lg font-semibold mb-3">MaT Tags (Max 10)</h4>
        <div className="text-sm text-gray-400 mb-3">
          Selected: {localCharacter.matTags?.length || 0}/10
        </div>
        {Object.entries(tags.categories).map(([category, data]) => (
          <div key={category} className="mb-4">
            <h5 className="text-sm font-semibold text-gray-300 mb-2 capitalize">{category}</h5>
            <div className="flex flex-wrap gap-2">
              {(data.values as string[]).map((tag: string) => {
                const isSelected = localCharacter.matTags?.includes(tag) || false;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded text-sm transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
