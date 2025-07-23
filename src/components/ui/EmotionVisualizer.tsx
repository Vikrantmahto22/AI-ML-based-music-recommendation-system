import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const EmotionVisualizer: React.FC = () => {
  const { currentEmotion, sentimentResult } = useAppContext();
  
  // If no emotion detected yet, return empty
  if (!sentimentResult) {
    return null;
  }
  
  // Define the emotion-specific settings
  const emotionConfig = {
    joy: {
      color1: 'from-joy-400',
      color2: 'via-joy-300',
      color3: 'to-accent-300',
      icon: '😊',
      label: 'Joy',
      description: 'Upbeat and positive energy'
    },
    sadness: {
      color1: 'from-sadness-400',
      color2: 'via-sadness-300',
      color3: 'to-primary-300',
      icon: '😢',
      label: 'Sadness', 
      description: 'Reflective and melancholic'
    },
    anger: {
      color1: 'from-anger-400',
      color2: 'via-anger-300',
      color3: 'to-anger-500',
      icon: '😠',
      label: 'Anger',
      description: 'Intense and energetic'
    },
    neutral: {
      color1: 'from-gray-400',
      color2: 'via-gray-300',
      color3: 'to-gray-500',
      icon: '😐',
      label: 'Neutral',
      description: 'Balanced and calm'
    }
  };
  
  const config = emotionConfig[currentEmotion];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-2xl mx-auto my-8"
    >
      <div className="card">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
            <motion.div
              className={`w-24 h-24 rounded-full text-4xl flex items-center justify-center bg-gradient-to-r ${config.color1} ${config.color2} ${config.color3}`}
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {config.icon}
            </motion.div>
          </div>
          
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h3 className="text-xl font-semibold mb-2">
              Current Mood: <span className={`
                ${currentEmotion === 'joy' ? 'text-joy-500' : 
                  currentEmotion === 'sadness' ? 'text-sadness-500' : 
                  currentEmotion === 'anger' ? 'text-anger-500' : 
                  'text-gray-500'}
              `}>{config.label}</span>
            </h3>
            
            <p className="text-gray-600 mb-3">{config.description}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full bg-gradient-to-r ${config.color1} ${config.color2} ${config.color3}`}
                style={{ width: `${(sentimentResult.confidence * 100).toFixed(0)}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500 mt-1">
              Confidence: {(sentimentResult.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionVisualizer;