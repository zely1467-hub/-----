export interface Word {
  word: string;
  phonetic: string;
  meaning: string;
  definition: string;
  example: string;
  aiPool: string[];
}

export interface HistoryItem {
  word: string;
  time: string;
}

export type MeaningMode = 'ja' | 'en' | 'hide';