import {LatLng} from 'react-native-maps';

export type LevelSource = {
  id: string;
  word: string;
  title: string;
  latlon: string;
};

export type Level = {
  id: string;
  word: string;
  title: string;
  latlon: LatLng;
};

export type LevelProgress = {
  id: string;
  packId: string | null;
  lives: number;
  completed: boolean;
  stars: number;
  emptyLivesTimestamp: string;
};

export const LevelProgressInitialState = {
  lives: 3,
  completed: false,
  stars: 0,
  emptyLivesTimestamp: '',
};

