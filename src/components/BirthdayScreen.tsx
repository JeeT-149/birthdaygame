import { motion } from 'motion/react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Confetti from './Confetti';
import { useAudio } from './AudioPlayer';

interface BirthdayScreenProps {
  onReplay: () => void;
  onNext: () => void;
  customData?: {
    name: string;
    hint: string;
    password: string;
    secretMessage: string;
  } | null;
}

export default function BirthdayScreen({ onReplay, onNext, customData }: BirthdayScreenProps) {
  const [key, setKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const { playSound, autoStartMusic } = useAudio();

  // Auto-start background music when birthday screen loads
  useEffect(() => {
    // Small delay to ensure audio context is ready
    const timer = setTimeout(() => {
      autoStartMusic();
    }, 500);

    return () => clearTimeout(timer);
  }, [autoStartMusic]);

  const handleReplay = () => {
    playSound('click');
    autoStartMusic(); // Ensure music starts on user interaction as backup
    setKey(prev => prev + 1);
    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 100);
  };

  const handleNext = () => {
    playSound('success');
    autoStartMusic(); // Ensure music starts on user interaction as backup
    onNext();
  };

  const text = "Happy Birthday!";
  const letters = text.split('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 25%, #fd79a8 50%, #e84393 75%, #a29bfe 100%)',
         }}>
      {showConfetti && <Confetti />}
      
      {/* Top Birthday Banner with Bunting and Hanging Balloons */}
      <div className="absolute top-0 left-0 right-0 h-48 z-20">
        {/* Bunting String */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <line x1="0" y1="25" x2="100%" y2="25" stroke="#333" strokeWidth="3" />
        </svg>
        
        {/* Bunting Flags */}
        <div className="absolute top-0 left-0 right-0 flex justify-around">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`bunting-${i}`}
              className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px]"
              style={{
                borderTopColor: ['#ff6b6b', '#4ecdc4', '#ffeaa7', '#96ceb4', '#fd79a8', '#dda0dd'][i % 6],
              }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
        
        {/* Hanging Balloons */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`balloon-${i}`}
            className="absolute"
            style={{
              left: `${8 + i * 9}%`,
              top: '35px',
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            {/* Balloon String */}
            <div 
              className="w-px bg-gray-600 mx-auto"
              style={{ height: '40px' }}
            />
            {/* Balloon */}
            <motion.div
              className="w-8 h-10 rounded-full mt-1 border border-gray-300"
              style={{
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffeaa7', '#96ceb4'][i % 4],
              }}
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          </motion.div>
        ))}
        
        {/* Scattered Confetti around the banner */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`banner-confetti-${i}`}
            className="absolute w-2 h-2"
            style={{
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffeaa7', '#96ceb4', '#fd79a8', '#dda0dd'][i % 6],
              left: `${Math.random() * 100}%`,
              top: `${90 + Math.random() * 60}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              y: [0, -3, 0],
              rotate: [0, 180, 360],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Colorful confetti scattered background */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-4 h-4 opacity-60"
          style={{
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'][i % 6],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: 'rotate(45deg)',
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [45, 135, 45],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Sparkles */}
      <motion.div
        className="absolute top-1/4 left-1/4"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-8 h-8 text-yellow-300" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <Sparkles className="w-8 h-8 text-pink-300" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 left-1/3"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <Sparkles className="w-8 h-8 text-blue-300" />
      </motion.div>

      {/* Main Content */}
      <div className="text-center space-y-12 z-10">
        {/* Animated Title - Balanced Size with Stroke */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {letters.map((letter, index) => (
            <motion.span
              key={`${key}-${index}`}
              className="text-7xl md:text-8xl lg:text-9xl inline-block bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-bold"
              style={{ 
                fontFamily: "'CustomBirthdayFont', 'Comic Sans MS', cursive",
                textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
                WebkitTextStroke: '2px white'
              }}
              initial={{ y: -100, opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                bounce: 0.5
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>

        {/* Name and Cake in unified layout */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8 flex-wrap"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.8, type: "spring", bounce: 0.6 }}
        >
          <h2 
            className="text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-bold"
            style={{ 
              fontFamily: "'CustomBirthdayFont', 'Comic Sans MS', cursive",
              textShadow: '4px 4px 10px rgba(0,0,0,0.3)',
              WebkitTextStroke: '2px white'
            }}
          >
            {customData?.name || 'Jeet'}
          </h2>
          
          {/* Birthday Cake Image - Small Size */}
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-pink-300 shadow-lg">
            <motion.img
              src="/birthday_cake.jpg"
              alt="Birthday Cake"
              className="w-full h-full object-cover"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <motion.button
            onClick={handleReplay}
            className="px-8 py-4 bg-gradient-to-r from-orange-300 to-pink-300 text-white rounded-full shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ scale: { duration: 2, repeat: Infinity } }}
          >
            <RotateCcw className="w-5 h-5" />
            Replay
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="px-8 py-4 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Play!
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
