import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Heart, Trophy, PartyPopper } from 'lucide-react';
import { useAudio } from './AudioPlayer';

interface CongratulationsScreenProps {
  onComplete: () => void;
}

export default function CongratulationsScreen({ onComplete }: CongratulationsScreenProps) {
  const [showFireworks, setShowFireworks] = useState(true);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { playSound } = useAudio();

  useEffect(() => {
    // Play celebration sound
    playSound('goodresult');
    
    // Show text after a delay
    const textTimer = setTimeout(() => setShowText(true), 1000);
    
    // Show button after longer delay
    const buttonTimer = setTimeout(() => setShowButton(true), 3000);
    
    // Remove auto continue - let user stay on congratulations screen

    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleContinue = () => {
    playSound('click');
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(45deg, #FF6B9D, #C44CAE, #8B5CF6, #3B82F6)',
           backgroundSize: '400% 400%',
           animation: 'gradient 3s ease infinite'
         }}>
      
      {/* Background Animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* Floating Particles */}
      {showFireworks && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                rotate: [0, 360],
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100]
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              {i % 4 === 0 && <Sparkles className="w-6 h-6 text-yellow-300" />}
              {i % 4 === 1 && <Star className="w-5 h-5 text-pink-300" />}
              {i % 4 === 2 && <Heart className="w-5 h-5 text-red-400" />}
              {i % 4 === 3 && <div className="w-3 h-3 bg-white rounded-full" />}
            </motion.div>
          ))}
        </>
      )}

      {/* Main Content */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.6 }}
      >
        {/* Trophy Icon */}
        <motion.div
          className="mb-8"
          animate={{ 
            rotate: [0, -10, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Trophy className="w-24 h-24 text-yellow-300 mx-auto drop-shadow-lg" />
        </motion.div>

        {/* Congratulations Text */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'monospace' }}
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 40px rgba(255,215,0,0.8)",
                    "0 0 20px rgba(255,255,255,0.8)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉 CONGRATULATIONS! 🎉
              </motion.h1>
              
              <motion.p
                className="text-2xl md:text-3xl text-white/90 mb-4 drop-shadow-lg"
                style={{ fontFamily: 'monospace' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                You cracked the password!
              </motion.p>
              
              <motion.p
                className="text-xl md:text-2xl text-yellow-200 mb-8 drop-shadow-lg"
                style={{ fontFamily: 'monospace' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                ✨ SHREYA271105 ✨
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {showText && (
            <motion.div
              className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-4"
              >
                <PartyPopper className="w-12 h-12 text-yellow-300 mx-auto" />
              </motion.div>
              <p className="text-white text-lg" style={{ fontFamily: 'monospace' }}>
                Amazing detective work! 🕵️‍♀️
                <br />
                You've successfully completed the Password Challenge!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <AnimatePresence>
          {showButton && (
            <motion.button
              onClick={handleContinue}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl border-4 border-white/30 backdrop-blur-sm transition-all duration-300"
              style={{ fontFamily: 'monospace' }}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            >
              🚀 Continue Adventure 🚀
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Corner Decorations */}
      <motion.div
        className="absolute top-8 left-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Star className="w-8 h-8 text-yellow-300" />
      </motion.div>
      
      <motion.div
        className="absolute top-8 right-8"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-8 h-8 text-pink-300" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 left-8"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Heart className="w-8 h-8 text-red-400" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 right-8"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <Trophy className="w-8 h-8 text-yellow-400" />
      </motion.div>
    </div>
  );
}