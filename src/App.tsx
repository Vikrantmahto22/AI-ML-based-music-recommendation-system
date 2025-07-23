import React, { useEffect } from 'react';
import Header from './components/layout/Header';
import TextAnalyzer from './components/sentiment/TextAnalyzer';
import EmotionVisualizer from './components/ui/EmotionVisualizer';
import SongRecommendation from './components/music/SongRecommendation';
import MusicPlayer from './components/music/MusicPlayer';
import MoodHistoryCard from './components/history/MoodHistoryCard';
import { AppProvider } from './context/AppContext';
import { motion } from 'framer-motion';

function App() {
  // Set page title
  useEffect(() => {
    document.title = "MoodMelody | Music for Your Emotions";
  }, []);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <motion.main 
          className="flex-1 container mx-auto px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Music That Matches Your Mood</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell us how you're feeling through text or voice, and we'll recommend the perfect songs to complement your emotional state.
            </p>
          </motion.div>
          
          <TextAnalyzer />
          <EmotionVisualizer />
          <SongRecommendation />
          <MoodHistoryCard />
        </motion.main>
        
        <MusicPlayer />
      </div>
    </AppProvider>
  );
}

export default App;