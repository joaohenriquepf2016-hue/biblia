export interface ScriptureRef {
  id: string;
  rawText: string;
  book: string;
  bookAbbrev: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  note?: string;
  status: 'pending' | 'active' | 'completed';
}

export interface SermonSection {
  id: string;
  title: string;
  type: 'intro' | 'point' | 'illustration' | 'application' | 'conclusion' | 'custom';
  content: string;
  scriptures: ScriptureRef[];
  estimatedMinutes?: number;
}

export interface Sermon {
  id: string;
  title: string;
  theme?: string;
  mainScripture?: string;
  targetDurationMinutes: number;
  sections: SermonSection[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
  tags?: string[];
}

export interface BibleBook {
  id: string;
  name: string;
  abbrevs: string[];
  testament: 'VT' | 'NT';
  chaptersCount: number;
  versesPerChapter: number[];
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export type PulpitTheme = 'light' | 'sepia' | 'dark' | 'pulpit-amber';
export type FontSize = 'normal' | 'large' | 'xlarge' | 'huge';
