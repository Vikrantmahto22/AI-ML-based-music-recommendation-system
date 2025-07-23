import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Emotion, Song, MoodHistory, SentimentResult } from '../types';
import { mockSongs } from '../data/mockSongs';

interface AppContextType {
  currentEmotion: Emotion;
  setCurrentEmotion: (emotion: Emotion) => void;
  currentInput: string;
  setCurrentInput: (input: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  recommendedSongs: Song[];
  setRecommendedSongs: (songs: Song[]) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  moodHistory: MoodHistory[];
  addToMoodHistory: (history: Omit<MoodHistory, 'timestamp'>) => void;
  sentimentResult: SentimentResult | null;
  setSentimentResult: (result: SentimentResult | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [currentInput, setCurrentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([]);
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);

  const addToMoodHistory = (history: Omit<MoodHistory, 'timestamp'>) => {
    const newEntry: MoodHistory = {
      ...history,
      timestamp: new Date(),
    };
    setMoodHistory(prevHistory => [newEntry, ...prevHistory]);
  };

  return (
    <AppContext.Provider
      value={{
        currentEmotion,
        setCurrentEmotion,
        currentInput,
        setCurrentInput,
        isListening,
        setIsListening,
        isAnalyzing,
        setIsAnalyzing,
        recommendedSongs,
        setRecommendedSongs,
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        moodHistory,
        addToMoodHistory,
        sentimentResult,
        setSentimentResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};