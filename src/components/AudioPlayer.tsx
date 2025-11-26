import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface AudioContextType {
  playSound: (soundType: 'click' | 'success' | 'error' | 'win' | 'lose' | 'tie' | 'type' | 'enter' | 'goodresult') => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType>({
  playSound: () => {},
  isMuted: false,
  toggleMute: () => {},
});

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const playSound = (soundType: string) => {
    if (isMuted) return;
    
    // Define sound files for specific types
    const soundFiles: { [key: string]: string } = {
      'success': '/audio/correct.mp3',
      'error': '/audio/wrong.mp3', 
      'goodresult': '/audio/goodresult.mp3'
    };
    
    // If we have an MP3 file for this sound type, play it
    if (soundFiles[soundType]) {
      const audio = new Audio(soundFiles[soundType]);
      audio.volume = 0.5; // Adjust volume as needed
      audio.play().catch(e => {
        console.warn('Could not play audio:', e);
        // Fallback to generated tone if MP3 fails
        playGeneratedTone(soundType);
      });
      return;
    }
    
    // Otherwise, use generated tones for other sounds
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
    setIsMuted(prev => !prev);
  };

  return (
    <AudioContext.Provider value={{ playSound, isMuted, toggleMute }}>
      {children}
      <MusicToggle />
    </AudioContext.Provider>
  );
}

function MusicToggle() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <motion.button
      onClick={toggleMute}
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
