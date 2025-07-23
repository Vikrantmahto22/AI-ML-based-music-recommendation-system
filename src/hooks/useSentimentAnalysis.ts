import { useState, useCallback, useEffect } from 'react';
import { SentimentResult } from '../types';
import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

// Simple keywords for basic sentiment classification
const KEYWORDS = {
  joy: ['happy', 'joy', 'excited', 'great', 'excellent', 'wonderful', 'amazing', 'love', 'glad', 'cheerful'],
  sadness: ['sad', 'unhappy', 'depressed', 'disappointed', 'miserable', 'heartbroken', 'upset', 'lonely', 'grief', 'sorry'],
  anger: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'enraged', 'hate', 'outraged', 'bitter']
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const useSentimentAnalysis = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [model, setModel] = useState<toxicity.ToxicityClassifier | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Initialize the model with retry mechanism
  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const loadModel = async () => {
      try {
        // Ensure TensorFlow backend is ready
        await tf.ready();
        
        // Configure model parameters
        const threshold = 0.7;
        const labels = ['toxicity', 'identity_attack', 'insult', 'threat'];
        
        // Load the model with explicit HTTPS URL
        const modelToLoad = await toxicity.load(threshold, labels, {
          // Force HTTPS for model files
          baseUrl: 'https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1'
        });

        if (!isMounted) return;

        setModel(modelToLoad);
        setIsModelLoaded(true);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error loading TensorFlow model:', error);
        
        if (!isMounted) return;

        setIsModelLoaded(false);
        
        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying model load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          
          // Schedule retry with exponential backoff
          retryTimeout = setTimeout(loadModel, RETRY_DELAY * Math.pow(2, retryCount));
        } else {
          console.error('Max retries reached. Falling back to simple analysis.');
        }
      }
    };
    
    loadModel();

    // Cleanup function
    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryCount]);

  // Simple keyword-based sentiment analysis as a fallback
  const simpleAnalysis = (text: string): SentimentResult => {
    text = text.toLowerCase();
    
    let maxEmotion = 'neutral';
    let maxCount = 0;
    
    // Count keyword occurrences for each emotion
    for (const [emotion, keywords] of Object.entries(KEYWORDS)) {
      const count = keywords.filter(keyword => text.includes(keyword)).length;
      if (count > maxCount) {
        maxCount = count;
        maxEmotion = emotion;
      }
    }
    
    // Simple confidence calculation
    const confidence = maxCount > 0 ? Math.min(maxCount * 0.2, 0.9) : 0.5;
    
    return {
      emotion: maxEmotion as SentimentResult['emotion'],
      confidence
    };
  };

  const analyzeSentiment = useCallback(async (text: string): Promise<SentimentResult> => {
    if (!text.trim()) {
      return { emotion: 'neutral', confidence: 0.5 };
    }

    // If model isn't loaded yet or failed to load, use simple analysis
    if (!isModelLoaded || !model) {
      return simpleAnalysis(text);
    }
    
    try {
      // Ensure the model and classify function are available
      if (!model.classify || typeof model.classify !== 'function') {
        console.warn('TensorFlow model not properly initialized, falling back to simple analysis');
        return simpleAnalysis(text);
      }

      // Use the TensorFlow model for more accurate prediction
      const predictions = await model.classify(text);
      
      // Extract toxicity scores
      const toxicityScore = predictions.find(p => p.label === 'toxicity')?.results[0]?.probabilities[1] || 0;
      const insultScore = predictions.find(p => p.label === 'insult')?.results[0]?.probabilities[1] || 0;
      const threatScore = predictions.find(p => p.label === 'threat')?.results[0]?.probabilities[1] || 0;
      
      // Map toxicity metrics to our emotions (simple mapping for demo)
      if (threatScore > 0.5 || toxicityScore > 0.7) {
        return { emotion: 'anger', confidence: Math.max(threatScore, toxicityScore) };
      }
      
      if (insultScore > 0.5) {
        return { emotion: 'anger', confidence: insultScore };
      }
      
      // Fall back to our simple keyword analysis if no strong toxicity signals
      return simpleAnalysis(text);
      
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return simpleAnalysis(text);
    }
  }, [isModelLoaded, model]);

  return {
    analyzeSentiment,
    isModelLoaded,
    retryCount
  };
};

export default useSentimentAnalysis;