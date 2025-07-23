import React, { useEffect } from 'react';
import { Mic, MicOff, Send, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import useSentimentAnalysis from '../../hooks/useSentimentAnalysis';
import useMusicRecommendation from '../../hooks/useMusicRecommendation';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion } from 'framer-motion';

interface VoiceAnalyzerProps {
  onClose: () => void;
}

const VoiceAnalyzer: React.FC<VoiceAnalyzerProps> = ({ onClose }) => {
  const {
    setCurrentInput,
    isAnalyzing,
    setIsAnalyzing,
    setRecommendedSongs,
    setCurrentEmotion,
    setSentimentResult,
    addToMoodHistory,
    isListening,
    setIsListening
  } = useAppContext();
  
  const { analyzeSentiment } = useSentimentAnalysis();
  const { getRecommendations } = useMusicRecommendation();
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    setIsListening(listening);
    return () => setIsListening(false);
  }, [listening, setIsListening]);

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    
    setIsAnalyzing(true);
    setCurrentInput(transcript);
    
    try {
      // Analyze sentiment
      const result = await analyzeSentiment(transcript);
      
      // Update app state with sentiment result
      setCurrentEmotion(result.emotion);
      setSentimentResult(result);
      
      // Get music recommendations based on the detected emotion
      const recommendations = getRecommendations(result.emotion);
      setRecommendedSongs(recommendations);
      
      // Add to mood history
      addToMoodHistory({
        emotion: result.emotion,
        text: transcript,
        songRecommended: recommendations[0]
      });
      
      // Close the voice analyzer
      onClose();
      
    } catch (error) {
      console.error('Error analyzing speech:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Voice Input</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <p className="text-red-500">
          Your browser doesn't support speech recognition.
          Please try a different browser or use text input instead.
        </p>
        <Button onClick={onClose} variant="primary" className="mt-4">
          Go back to text input
        </Button>
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Voice Input</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <p className="text-red-500">
          Microphone access is blocked or not available.
          Please check your browser permissions.
        </p>
        <Button onClick={onClose} variant="primary" className="mt-4">
          Go back to text input
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Voice Input</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex justify-center mb-4">
        <motion.div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${listening ? 'bg-primary-100' : 'bg-gray-100'}`}
          animate={{
            scale: listening ? [1, 1.1, 1] : 1,
            boxShadow: listening ? '0 0 0 10px rgba(59, 130, 246, 0.1)' : '0 0 0 0px rgba(59, 130, 246, 0)'
          }}
          transition={{ repeat: listening ? Infinity : 0, duration: 1.5 }}
        >
          {listening ? (
            <Mic size={30} className="text-primary-600" />
          ) : (
            <MicOff size={30} className="text-gray-400" />
          )}
        </motion.div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[100px] border border-gray-200">
        {transcript ? (
          <p>{transcript}</p>
        ) : (
          <p className="text-gray-400 italic">
            {listening ? 'Listening... Speak now' : 'Click the button below to start speaking'}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {listening ? (
          <Button
            variant="secondary"
            icon={<MicOff size={16} />}
            onClick={handleStopListening}
          >
            Stop Listening
          </Button>
        ) : (
          <Button
            variant="primary"
            icon={<Mic size={16} />}
            onClick={handleStartListening}
          >
            Start Listening
          </Button>
        )}
        
        <Button
          variant="accent"
          icon={<Send size={16} />}
          onClick={handleSubmit}
          disabled={!transcript.trim() || isAnalyzing}
          isLoading={isAnalyzing}
        >
          Analyze
        </Button>
      </div>
    </motion.div>
  );
};

export default VoiceAnalyzer;