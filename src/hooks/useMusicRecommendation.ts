import { useCallback } from 'react';
import { Emotion, Song } from '../types';
import { getRandomSongsForEmotion } from '../data/mockSongs';

const useMusicRecommendation = () => {
  const getRecommendations = useCallback((emotion: Emotion, count: number = 3): Song[] => {
    // In a real application, this would call an API that recommends songs based on emotion
    // For now, we'll use mock data
    return getRandomSongsForEmotion(emotion, count);
  }, []);

  return {
    getRecommendations
  };
};

export default useMusicRecommendation;