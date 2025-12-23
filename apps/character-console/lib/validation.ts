import { Character, Move } from './firestore-helpers';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCharacter(character: Partial<Character>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!character.name || character.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!character.id || character.id.trim() === '') {
    errors.push({ field: 'id', message: 'ID is required' });
  }

  if (!character.species) {
    errors.push({ field: 'species', message: 'Species is required' });
  }

  if (!character.gang) {
    errors.push({ field: 'gang', message: 'Gang is required' });
  }

  if (!character.roles?.primary) {
    errors.push({ field: 'roles.primary', message: 'Primary role is required' });
  }

  if (!character.growthCurve) {
    errors.push({ field: 'growthCurve', message: 'Growth curve is required' });
  }

  if (!character.matTags || character.matTags.length === 0) {
    errors.push({ field: 'matTags', message: 'At least one MaT tag is required' });
  }

  return errors;
}

export function validateMove(move: Partial<Move>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!move.name || move.name.trim() === '') {
    errors.push({ field: 'name', message: 'Move name is required' });
  }

  if (!move.id || move.id.trim() === '') {
    errors.push({ field: 'id', message: 'Move ID is required' });
  }

  if (!move.type) {
    errors.push({ field: 'type', message: 'Move type is required' });
  }

  if (!move.target?.type) {
    errors.push({ field: 'target.type', message: 'Target type is required' });
  }

  if (!move.learned_at_level || move.learned_at_level < 1 || move.learned_at_level > 10) {
    errors.push({ field: 'learned_at_level', message: 'Learned at level must be between 1 and 10' });
  }

  return errors;
}

export function validateLevelStats(stats: any): ValidationError[] {
  const errors: ValidationError[] = [];
  const requiredFields = [
    'level', 'hp', 'bbs', 'spd', 'eva', 'acc',
    'mla', 'rga', 'maa', 'spa',
    'mld', 'rgd', 'mad', 'spd_def',
    'int', 'agg', 'crg', 'xpa', 'xpt'
  ];

  requiredFields.forEach(field => {
    if (stats[field] === undefined || stats[field] === null) {
      errors.push({ field, message: `${field} is required` });
    }
  });

  // Validate level is between 1-10
  if (stats.level < 1 || stats.level > 10) {
    errors.push({ field: 'level', message: 'Level must be between 1 and 10' });
  }

  // Validate combat stats are between 1-100
  const combatStats = ['hp', 'bbs', 'spd', 'eva', 'acc', 'mla', 'rga', 'maa', 'spa', 'mld', 'rgd', 'mad', 'spd_def', 'int', 'agg', 'crg'];
  combatStats.forEach(stat => {
    if (stats[stat] < 1 || stats[stat] > 100) {
      errors.push({ field: stat, message: `${stat} must be between 1 and 100` });
    }
  });

  return errors;
}
