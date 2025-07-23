import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, setIsPlaying } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element when component mounts
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle song changes and playing state
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying, setIsPlaying, volume]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setIsPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value, 10);
    setProgress(newProgress);
    
    if (audioRef.current && duration) {
      const newTime = (newProgress / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
        >
          <div className="container mx-auto px-4 py-3 flex items-center">
            <div className="flex items-center flex-1">
              <img 
                src={currentSong.coverUrl} 
                alt={`${currentSong.title} album art`} 
                className="w-12 h-12 rounded-md object-cover shadow-sm mr-3" 
              />
              
              <div className="min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">{currentSong.title}</h4>
                <p className="text-xs text-gray-600 truncate">{currentSong.artist}</p>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col flex-2 items-center justify-center w-full max-w-xl mx-4">
              <div className="flex items-center space-x-3 mb-1">
                <button 
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                
                <span className="text-xs text-gray-500 w-8 text-right">{formatTime(currentTime)}</span>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${progress}%, #e5e7eb ${progress}%)`,
                  }}
                />
                
                <span className="text-xs text-gray-500 w-8">{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <div className="hidden md:flex items-center">
                <button 
                  className="p-1 text-gray-500 hover:text-gray-700"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer ml-2"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%)`,
                  }}
                />
              </div>
              
              <button 
                className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
            </div>
          </div>
          
          {/* Mobile progress bar */}
          <div className="md:hidden w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-primary-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayer;