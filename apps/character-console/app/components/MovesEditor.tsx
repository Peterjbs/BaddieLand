'use client';

import { useState, useEffect } from 'react';
import { Character, Move } from '@/lib/schemas';
import { moveTypes, environmentalConditions, tags } from '@/lib/constants';

interface MovesEditorProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export default function MovesEditor({ character, onUpdate }: MovesEditorProps) {
  const [moves, setMoves] = useState<Move[]>(character.moves || []);
  const [editingMove, setEditingMove] = useState<Move | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMoves, setExpandedMoves] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMoves(character.moves || []);
  }, [character]);

  const handleAddMove = () => {
    if (moves.length >= 10) return;
    
    const newMove: Move = {
      id: `${character.id}_move_${moves.length + 1}`,
      name: 'New Move',
      description: '',
      type: 'melee_attack',
      target: { type: 'enemy' },
      learned_at_level: 1,
      effect_algorithm: '',
      target_mats: [],
      target_maecs: [],
    };
    
    setEditingMove(newMove);
    setIsModalOpen(true);
  };

  const handleEditMove = (move: Move) => {
    setEditingMove({ ...move });
    setIsModalOpen(true);
  };

  const handleSaveMove = () => {
    if (!editingMove) return;
    
    const updatedMoves = moves.some(m => m.id === editingMove.id)
      ? moves.map(m => m.id === editingMove.id ? editingMove : m)
      : [...moves, editingMove];
    
    setMoves(updatedMoves);
    onUpdate({ moves: updatedMoves });
    setIsModalOpen(false);
    setEditingMove(null);
  };

  const handleDeleteMove = (moveId: string) => {
    if (!confirm('Are you sure you want to delete this move?')) return;
    
    const updatedMoves = moves.filter(m => m.id !== moveId);
    setMoves(updatedMoves);
    onUpdate({ moves: updatedMoves });
  };

  const toggleExpand = (moveId: string) => {
    const newExpanded = new Set(expandedMoves);
    if (newExpanded.has(moveId)) {
      newExpanded.delete(moveId);
    } else {
      newExpanded.add(moveId);
    }
    setExpandedMoves(newExpanded);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Moves ({moves.length}/10)</h3>
        <button
          onClick={handleAddMove}
          disabled={moves.length >= 10}
          className={`text-white text-sm font-bold py-2 px-4 rounded transition ${
            moves.length >= 10
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Add Move
        </button>
      </div>

      <div className="space-y-3">
        {moves.map((move) => {
          const isExpanded = expandedMoves.has(move.id);
          return (
            <div key={move.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <button
                  onClick={() => toggleExpand(move.id)}
                  className="flex-1 text-left"
                >
                  <div className="font-semibold text-lg">{move.name}</div>
                  <div className="text-sm text-gray-400">
                    Type: {move.type} | Level: {move.learned_at_level}
                  </div>
                </button>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditMove(move)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMove(move.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-600 text-sm space-y-2">
                  <p><strong>Description:</strong> {move.description || 'No description'}</p>
                  <p><strong>Target:</strong> {move.target.type} {move.target.count ? `(${move.target.count})` : ''}</p>
                  <p><strong>Effect:</strong> {move.effect_algorithm || 'No algorithm'}</p>
                  {move.target_mats && move.target_mats.length > 0 && (
                    <p><strong>MaT Multipliers:</strong> {move.target_mats.map(m => `${m.tag}: ${m.multiplier}x`).join(', ')}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingMove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Move</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID</label>
                <input
                  type="text"
                  value={editingMove.id}
                  onChange={(e) => setEditingMove({ ...editingMove, id: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={editingMove.name}
                  onChange={(e) => setEditingMove({ ...editingMove, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={editingMove.description}
                  onChange={(e) => setEditingMove({ ...editingMove, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 resize-vertical"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                  <select
                    value={editingMove.type}
                    onChange={(e) => setEditingMove({ ...editingMove, type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {moveTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Learned at Level *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingMove.learned_at_level}
                    onChange={(e) => setEditingMove({ ...editingMove, learned_at_level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Type</label>
                <input
                  type="text"
                  value={editingMove.target.type}
                  onChange={(e) => setEditingMove({
                    ...editingMove,
                    target: { ...editingMove.target, type: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., enemy, allies_in_range, all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Count (optional)</label>
                <input
                  type="number"
                  min="1"
                  value={editingMove.target.count || ''}
                  onChange={(e) => setEditingMove({
                    ...editingMove,
                    target: { ...editingMove.target, count: e.target.value ? parseInt(e.target.value) : undefined }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Effect Algorithm *</label>
                <textarea
                  value={editingMove.effect_algorithm}
                  onChange={(e) => setEditingMove({ ...editingMove, effect_algorithm: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 resize-vertical font-mono text-sm"
                  placeholder="e.g., damage = (MLA * 1.5) - (target.MLD * 0.7)"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMove(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMove}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Save Move
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
