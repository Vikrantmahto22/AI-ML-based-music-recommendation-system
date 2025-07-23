import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Song } from '../../types';
import { motion } from 'framer-motion';

const SongRecommendation: React.FC = () => {
  const {
    recommendedSongs,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    sentimentResult
  } = useAppContext();

  // No songs to display yet
  if (recommendedSongs.length === 0) {
    return null;
  }

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      // Toggle play/pause if it's the current song
      setIsPlaying(!isPlaying);
    } else {
      // Play a new song
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="card">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {sentimentResult ? (
              <span>
                You're feeling 
                <span className={`font-bold ${
                  sentimentResult.emotion === 'joy' ? 'text-joy-500' : 
                  sentimentResult.emotion === 'sadness' ? 'text-sadness-500' : 
                  sentimentResult.emotion === 'anger' ? 'text-anger-500' : 
                  'text-gray-500'
                }`}> {sentimentResult.emotion}</span>
              </span>
            ) : (
              'Your Recommended Songs'
            )}
          </h2>
          <p className="text-gray-600">Here are some songs that match your current mood:</p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {recommendedSongs.map(song => (
            <motion.div key={song.id} className="relative" variants={item}>
              <div className="relative group">
                <img 
                  src={song.coverUrl} 
                  alt={`${song.title} album cover`} 
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="w-12 h-12 rounded-full bg-white text-primary-500 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110"
                    onClick={() => handlePlaySong(song)}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-medium text-gray-900 truncate">{song.title}</h3>
                <p className="text-gray-600 text-sm truncate">{song.artist}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SongRecommendation;