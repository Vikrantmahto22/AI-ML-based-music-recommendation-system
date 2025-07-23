import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import useSentimentAnalysis from '../../hooks/useSentimentAnalysis';
import useMusicRecommendation from '../../hooks/useMusicRecommendation';
import VoiceAnalyzer from './VoiceAnalyzer';
import { motion } from 'framer-motion';

const TextAnalyzer: React.FC = () => {
  const {
    currentInput,
    setCurrentInput,
    isAnalyzing,
    setIsAnalyzing,
    setRecommendedSongs,
    setCurrentEmotion,
    setSentimentResult,
    addToMoodHistory
  } = useAppContext();
  
  const { analyzeSentiment, isModelLoaded } = useSentimentAnalysis();
  const { getRecommendations } = useMusicRecommendation();
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInput.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Analyze sentiment
      const result = await analyzeSentiment(currentInput);
      
      // Update app state with sentiment result
      setCurrentEmotion(result.emotion);
      setSentimentResult(result);
      
      // Get music recommendations based on the detected emotion
      const recommendations = getRecommendations(result.emotion);
      setRecommendedSongs(recommendations);
      
      // Add to mood history
      addToMoodHistory({
        emotion: result.emotion,
        text: currentInput,
        songRecommended: recommendations[0]
      });
      
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleVoiceInput = () => {
    setShowVoiceInput(!showVoiceInput);
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        
        {showVoiceInput ? (
          <VoiceAnalyzer onClose={() => setShowVoiceInput(false)} />
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              className="input min-h-[120px] resize-none mb-4"
              placeholder="Describe your feelings or what's on your mind right now..."
              value={currentInput}
              onChange={handleInputChange}
            ></textarea>
            
            <div className="flex items-center space-x-3">
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isAnalyzing}
                icon={<Send size={16} />}
                disabled={!currentInput.trim() || isAnalyzing || !isModelLoaded}
              >
                {isModelLoaded ? 'Analyze' : 'Loading model...'}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                icon={<Mic size={16} />}
                onClick={toggleVoiceInput}
              >
                Voice Input
              </Button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default TextAnalyzer;