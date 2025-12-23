// Load and export JSON data from public/data directory
import rolesData from '@/public/data/roles.json';
import tagsData from '@/public/data/tags.json';
import speciesData from '@/public/data/species.json';
import growthCurvesData from '@/public/data/growth-curves.json';
import moveTypesData from '@/public/data/move-types.json';
import environmentalConditionsData from '@/public/data/environmental-conditions.json';

export const roles = rolesData.roles.values;
export const tags = tagsData.tags;
export const species = speciesData.species.groups;
export const growthCurves = growthCurvesData.growth_curves.values;
export const moveTypes = moveTypesData.move_types.values;
export const environmentalConditions = environmentalConditionsData.environmental_conditions.values;

// Gang colors
export const gangColors = {
  GGG: 'gang-ggg',
  MMM: 'gang-mmm',
  BBB: 'gang-bbb',
  PPP: 'gang-ppp',
} as const;

export const gangs = ['GGG', 'MMM', 'BBB', 'PPP'] as const;
export type Gang = typeof gangs[number];
