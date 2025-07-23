import React from 'react';
import { Clock, Music } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const MoodHistoryCard: React.FC = () => {
  const { moodHistory, setCurrentSong, setIsPlaying } = useAppContext();
  
  if (moodHistory.length === 0) {
    return null;
  }
  
  // Only show the latest 3 entries
  const recentHistory = moodHistory.slice(0, 3);
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const playSong = (song: any) => {
    if (song) {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };
  
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return 'bg-joy-100 text-joy-800 border-joy-200';
      case 'sadness': return 'bg-sadness-100 text-sadness-800 border-sadness-200';
      case 'anger': return 'bg-anger-100 text-anger-800 border-anger-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy': return '😊';
      case 'sadness': return '😢';
      case 'anger': return '😠';
      default: return '😐';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Recent Moods</h2>
        </div>
        
        <div className="space-y-3">
          {recentHistory.map((entry, index) => (
            <div key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="mr-3 text-2xl">
                {getEmotionIcon(entry.emotion)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getEmotionColor(entry.emotion)}`}>
                    {entry.emotion}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                
                {entry.text && (
                  <p className="text-sm text-gray-700 line-clamp-1">{entry.text}</p>
                )}
              </div>
              
              {entry.songRecommended && (
                <button 
                  className="ml-3 p-2 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
                  onClick={() => playSong(entry.songRecommended)}
                  title={`Play ${entry.songRecommended.title}`}
                >
                  <Music size={16} className="text-primary-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoodHistoryCard;