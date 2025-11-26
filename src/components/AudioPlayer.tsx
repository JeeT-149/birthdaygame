import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface AudioContextType {
  playSound: (soundType: 'click' | 'success' | 'error' | 'win' | 'lose' | 'tie' | 'type' | 'enter' | 'goodresult') => void;
  isMuted: boolean;
  toggleMute: () => void;
  startBackgroundMusic: () => void;
  autoStartMusic: () => void;
}

const AudioContext = createContext<AudioContextType>({
  playSound: () => {},
  isMuted: false,
  toggleMute: () => {},
  startBackgroundMusic: () => {},
  autoStartMusic: () => {},
});

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background music only once
  useEffect(() => {
    // Prevent creating multiple audio instances
    if (backgroundMusicRef.current) return;
    
    const music = new Audio('/audio/theme.mp3');
    music.loop = true;
    music.volume = 0.3;
    music.preload = 'auto';
    
    // Add event listeners for debugging
    music.addEventListener('loadstart', () => console.log('Music: Loading started'));
    music.addEventListener('canplay', () => console.log('Music: Can play'));
    music.addEventListener('error', (e) => console.error('Music: Error loading', e));
    music.addEventListener('ended', () => console.log('Music: Ended (should loop)'));
    music.addEventListener('pause', () => console.log('Music: Paused'));
    music.addEventListener('play', () => console.log('Music: Playing'));
    
    backgroundMusicRef.current = music;

    // Cleanup on unmount
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once

  // Handle mute/unmute for background music
  useEffect(() => {
    const music = backgroundMusicRef.current;
    if (music && musicStarted) {
      if (isMuted) {
        music.pause();
      } else {
        music.play().catch(e => {
          console.log('Could not resume background music:', e);
        });
      }
    }
  }, [isMuted, musicStarted]);

  const autoStartMusic = () => {
    const music = backgroundMusicRef.current;
    console.log('Auto-starting background music...', { 
      hasMusic: !!music, 
      isMuted,
      paused: music?.paused 
    });
    
    if (music && !isMuted) {
      music.play().then(() => {
        console.log('Background music auto-started successfully');
        setMusicStarted(true);
      }).catch(e => {
        console.warn('Could not auto-start background music:', e);
        // Try again after a short delay
        setTimeout(() => {
          music.play().catch(console.warn);
        }, 1000);
      });
    }
  };

  const startBackgroundMusic = () => {
    const music = backgroundMusicRef.current;
    console.log('Attempting to start background music...', { 
      hasMusic: !!music, 
      isMuted, 
      musicStarted,
      paused: music?.paused 
    });
    
    if (music && !isMuted && !musicStarted) {
      music.play().then(() => {
        console.log('Background music started successfully');
        setMusicStarted(true);
      }).catch(e => {
        console.warn('Could not start background music:', e);
      });
    } else {
      console.log('Background music not started due to conditions:', { 
        hasMusic: !!music, 
        isMuted, 
        musicStarted 
      });
    }
  };

  const playSound = (soundType: string) => {
    console.log('playSound called with:', soundType, 'isMuted:', isMuted);
    if (isMuted) return;
    
    // Define sound files for specific types
    const soundFiles: { [key: string]: string } = {
      'success': '/audio/correct.mp3',
      'error': '/audio/wrong.mp3', 
      'goodresult': '/audio/goodresult.mp3'
    };
    
    // If we have an MP3 file for this sound type, play it
    if (soundFiles[soundType]) {
      console.log('Playing audio file:', soundFiles[soundType]);
      const audio = new Audio(soundFiles[soundType]);
      audio.volume = 0.5; // Adjust volume as needed
      audio.play().then(() => {
        console.log('Audio played successfully:', soundType);
      }).catch(e => {
        console.warn('Could not play audio:', e);
        // Fallback to generated tone if MP3 fails
        playGeneratedTone(soundType);
      });
      return;
    }
    
    // Otherwise, use generated tones for other sounds
    console.log('Using generated tone for:', soundType);
    playGeneratedTone(soundType);
  };

  const playGeneratedTone = (soundType: string) => {
    // Create different frequency tones for different sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set sound properties based on type
    switch (soundType) {
      case 'click':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.type = 'sine';
        break;
      case 'success':
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.15;
        oscillator.type = 'sine';
        break;
      case 'error':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.1;
        oscillator.type = 'sawtooth';
        break;
      case 'win':
        oscillator.frequency.value = 1200;
        gainNode.gain.value = 0.2;
        oscillator.type = 'sine';
        break;
      case 'lose':
        oscillator.frequency.value = 150;
        gainNode.gain.value = 0.1;
        oscillator.type = 'triangle';
        break;
      case 'tie':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.08;
        oscillator.type = 'sine';
        break;
      case 'type':
        oscillator.frequency.value = 900;
        gainNode.gain.value = 0.05;
        oscillator.type = 'square';
        break;
      case 'enter':
        oscillator.frequency.value = 1100;
        gainNode.gain.value = 0.12;
        oscillator.type = 'sine';
        break;
      case 'goodresult':
        oscillator.frequency.value = 1400;
        gainNode.gain.value = 0.2;
        oscillator.type = 'sine';
        break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // Clean up
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
      audioContext.close();
    }, 200);
  };

  const toggleMute = () => {
    console.log('Toggle mute called, current state:', isMuted);
    setIsMuted(prev => !prev);
  };

  const stopAllAudio = () => {
    // Stop background music
    const music = backgroundMusicRef.current;
    if (music) {
      music.pause();
      music.currentTime = 0;
    }
    setMusicStarted(false);
    console.log('All audio stopped');
  };

  return (
    <AudioContext.Provider value={{ playSound, isMuted, toggleMute, startBackgroundMusic, autoStartMusic }}>
      {children}
      <MusicToggle onStopAll={stopAllAudio} />
    </AudioContext.Provider>
  );
}

function MusicToggle({ onStopAll }: { onStopAll: () => void }) {
  const { isMuted, toggleMute } = useAudio();

  const handleToggle = () => {
    if (!isMuted) {
      // Before muting, stop all audio
      onStopAll();
    }
    toggleMute();
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed top-6 right-6 z-50 p-4 bg-white border-4 border-pink-300 rounded-full shadow-lg hover:bg-pink-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-pink-500" />
      ) : (
        <Volume2 className="w-6 h-6 text-pink-500" />
      )}
    </motion.button>
  );
}
