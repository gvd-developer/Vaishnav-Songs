export interface Song {
  id: string;
  slug: string;
  title: string;
  composer: string;
  era?: string;
  raga?: string;
  tala?: string;
  lyrics_dev: string; // markdown
  lyrics_iast: string; // markdown
  summary?: string;
  audio_url?: string;
  cover_url?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
}

export interface SongCategory {
  songId: string;
  categoryId: string;
}

export interface Sloka {
  id: string;
  source: string; // e.g., "BG 9.22"
  text_dev: string;
  text_iast: string;
  translation_en: string;
  translation_hi?: string;
  themeTags: string[]; // json array
}

export interface SongSloka {
  songId: string;
  slokaId: string;
  relationNote?: string;
}

export interface Tag {
  id: string;
  name: string;
  type: 'festival' | 'mood' | 'time';
  slug: string;
}

export interface SongTag {
  songId: string;
  tagId: string;
}

export interface Favourite {
  userId: string;
  songId: string;
  createdAt: string;
}

export interface PlaybackHistory {
  songId: string;
  playedAt: string;
  positionSec: number;
}

export interface SearchFilters {
  categories: string[];
  composers: string[];
  tags: string[];
  hasAudio: boolean | null;
  raga?: string;
  tala?: string;
}

export type ScriptType = 'devanagari' | 'iast';
export type ThemeType = 'light' | 'dark' | 'system';