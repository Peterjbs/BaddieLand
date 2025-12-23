// Import reference data from data/pools
// These imports work because Next.js resolves JSON files at build time

import rolesData from '../../../data/pools/roles.json';
import tagsData from '../../../data/pools/tags.json';
import speciesData from '../../../data/pools/species.json';
import growthCurvesData from '../../../data/pools/growth-curves.json';
import moveTypesData from '../../../data/pools/move-types.json';
import environmentalConditionsData from '../../../data/pools/environmental-conditions.json';

export const ROLES_DATA = rolesData;
export const TAGS_DATA = tagsData;
export const SPECIES_DATA = speciesData;
export const GROWTH_CURVES_DATA = growthCurvesData;
export const MOVE_TYPES_DATA = moveTypesData;
export const ENVIRONMENTAL_CONDITIONS_DATA = environmentalConditionsData;

// Helper functions for easy access
export function getRoles(): string[] {
  return ROLES_DATA.roles.values.map((r: any) => r.id);
}

export function getAllTags(): string[] {
  return TAGS_DATA.tags.all_tags;
}

export function getTagDetails(): Record<string, string> {
  return TAGS_DATA.tags.tag_details;
}

export function getSpeciesGroups(): any[] {
  return SPECIES_DATA.species.groups;
}

export function getGrowthCurves(): string[] {
  return GROWTH_CURVES_DATA.growth_curves.values.map((g: any) => g.id);
}

export function getMoveTypes(): string[] {
  return MOVE_TYPES_DATA.move_types.values.map((t: any) => t.id);
}

export function getEnvironmentalConditions(): string[] {
  return ENVIRONMENTAL_CONDITIONS_DATA.environmental_conditions.values.map((c: any) => c.id);
}
