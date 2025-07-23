export type Emotion = 'joy' | 'sadness' | 'anger' | 'neutral';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  audioUrl: string;
}

export interface SentimentResult {
  emotion: Emotion;
  confidence: number;
}

export interface MoodHistory {
  timestamp: Date;
  emotion: Emotion;
  text?: string;
  songRecommended?: Song;
}