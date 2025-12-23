import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import { StatSheet } from './stat-utils';

export interface Character {
  id: string;
  name: string;
  age: number | string;
  species: string;
  subspecies?: string;
  gang: 'GGG' | 'MMM' | 'BBB' | 'PPP';
  roles: {
    primary: string;
    secondary?: string;
    tertiary?: string;
  };
  growthCurve: string;
  weaponItem?: string;
  matTags: string[];
  visual_description?: {
    body_and_skin?: string;
    hair?: string;
    clothing?: string;
    distinguishing_features?: string;
    weapon_item?: string;
    specific_visuals?: string;
  };
  levelStats?: LevelStat[];
  statSheet?: StatSheet;  // New enhanced stat system
  move_list: string[];
  activeAvatar?: string;
  latestSpritesheet?: string;
}

export interface LevelStat {
  level: number;
  hp: number;
  bbs: number;
  spd: number;
  eva: number;
  acc: number;
  mla: number;
  rga: number;
  maa: number;
  spa: number;
  mld: number;
  rgd: number;
  mad: number;
  spd_def: number;
  int: number;
  agg: number;
  crg: number;
  xpa: number;
  xpt: number;
}

export interface Move {
  id: string;
  name: string;
  description: string;
  type: string;
  target: {
    type: string;
    count?: number;
  };
  learned_at_level: number;
  effect_algorithm?: string;
  target_mats?: Array<{
    tag: string;
    multiplier: number;
  }>;
  target_maecs?: Array<{
    condition: string;
    multiplier: number;
  }>;
}

// Character CRUD operations
export async function getCharacter(characterId: string): Promise<Character | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'characters', characterId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const character = { id: docSnap.id, ...docSnap.data() } as Character;
      
      // Migrate old levelStats to new statSheet if needed
      if (!character.statSheet && character.levelStats) {
        const { convertOldToNew } = await import('./stat-utils');
        character.statSheet = convertOldToNew(character.levelStats);
      }
      
      return character;
    }
    return null;
  } catch (error) {
    console.error('Error getting character:', error);
    throw error;
  }
}

export async function getAllCharacters(): Promise<Character[]> {
  if (!db) return [];
  try {
    const { convertOldToNew } = await import('./stat-utils');
    const querySnapshot = await getDocs(collection(db, 'characters'));
    return querySnapshot.docs.map(doc => {
      const character = { 
        id: doc.id, 
        ...doc.data() 
      } as Character;
      
      // Migrate old levelStats to new statSheet if needed
      if (!character.statSheet && character.levelStats) {
        character.statSheet = convertOldToNew(character.levelStats);
      }
      
      return character;
    });
  } catch (error) {
    console.error('Error getting characters:', error);
    throw error;
  }
}

export async function getCharactersByGang(gang: string): Promise<Character[]> {
  if (!db) return [];
  try {
    const { convertOldToNew } = await import('./stat-utils');
    const q = query(collection(db, 'characters'), where('gang', '==', gang));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const character = { 
        id: doc.id, 
        ...doc.data()
      } as Character;
      
      // Migrate old levelStats to new statSheet if needed
      if (!character.statSheet && character.levelStats) {
        character.statSheet = convertOldToNew(character.levelStats);
      }
      
      return character;
    });
  } catch (error) {
    console.error('Error getting characters by gang:', error);
    throw error;
  }
}

export async function saveCharacter(character: Character): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  try {
    const docRef = doc(db, 'characters', character.id);
    await setDoc(docRef, character, { merge: true });
  } catch (error) {
    console.error('Error saving character:', error);
    throw error;
  }
}

export async function deleteCharacter(characterId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  try {
    const docRef = doc(db, 'characters', characterId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting character:', error);
    throw error;
  }
}

// Move CRUD operations
export async function getMove(moveId: string): Promise<Move | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'moves', moveId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Move;
    }
    return null;
  } catch (error) {
    console.error('Error getting move:', error);
    throw error;
  }
}

export async function saveMove(move: Move): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  try {
    const docRef = doc(db, 'moves', move.id);
    await setDoc(docRef, move, { merge: true });
  } catch (error) {
    console.error('Error saving move:', error);
    throw error;
  }
}

export async function deleteMove(moveId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  try {
    const docRef = doc(db, 'moves', moveId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting move:', error);
    throw error;
  }
}
