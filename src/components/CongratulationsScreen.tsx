import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from './AudioPlayer';

interface CongratulationsScreenProps {
  onComplete: () => void;
}

export default function CongratulationsScreen({ onComplete }: CongratulationsScreenProps) {
  const [paperStage, setPaperStage] = useState(1); // 1, 2, or 3
  const [showContinueButton, setShowContinueButton] = useState(false);
  const { playSound } = useAudio();

  useEffect(() => {
    // Play celebration sound when component mounts
    playSound('goodresult');
  }, []);

  useEffect(() => {
    // Show continue button after reaching final stage
    if (paperStage === 3) {
      const timer = setTimeout(() => {
        setShowContinueButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [paperStage]);

  const handlePaperClick = () => {
    if (paperStage < 3) {
      playSound('click');
      setPaperStage(prev => prev + 1);
    }
  };

  const handleContinue = () => {
    playSound('click');
    onComplete();
  };

  const getPaperSize = () => {
    switch (paperStage) {
      case 1: return 'w-64 h-80'; // Small
      case 2: return 'w-[35rem] h-[45rem]'; // Very Large
      case 3: return 'w-[95vw] h-[90vh] max-w-none max-h-none'; // Full screen
      default: return 'w-64 h-80';
    }
  };

  const getPaperImage = () => {
    return `/brownpaper${paperStage}.jpg`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(45deg, #8B4513, #A0522D, #CD853F, #DEB887)',
           backgroundSize: '400% 400%',
           animation: 'gradient 4s ease infinite'
         }}>
      
      {/* Background Animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
      `}</style>

      {/* Title */}
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-amber-100 mb-8 text-center drop-shadow-2xl"
        style={{ fontFamily: 'serif' }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
      >
        🎉 CONGRATULATIONS! 🎉
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-2xl md:text-3xl text-amber-200 mb-12 text-center drop-shadow-lg"
        style={{ fontFamily: 'serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        You've unlocked a special message!
      </motion.p>

      {/* Paper Image */}
      <motion.div
        className="relative cursor-pointer"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, duration: 0.8, type: "spring", bounce: 0.3 }}
      >
        <motion.img
          src={getPaperImage()}
          alt={`Brown Paper ${paperStage}`}
          className={`${getPaperSize()} object-contain shadow-2xl`}
          onClick={handlePaperClick}
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))',
            animation: paperStage < 3 ? 'glow 2s ease-in-out infinite' : 'none'
          }}
          whileHover={{ 
            scale: paperStage < 3 ? 1.05 : 1.02,
            rotate: paperStage < 3 ? [0, 2, -2, 0] : 0
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            scale: { duration: 0.6, type: "spring" },
            rotate: { duration: 0.3 }
          }}
          layout
        />
        
        {/* Text box for brownpaper3 */}
        {paperStage === 3 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.div
              className="text-amber-900 p-6 max-w-3xl text-center"
              style={{ 
                fontFamily: 'serif',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
              }}
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
            >
              <h3 className="text-4xl font-bold text-amber-900 mb-5 tracking-wide">
                 Special Message 
              </h3>
              <p className="text-2xl leading-relaxed font-medium text-amber-900">
                Congratulations Shreya! You've unlocked the final secret message. 
                Your journey through all the challenges has been amazing!
              </p>
              <div className="text-3xl font-semibold text-amber-900 mb-5 tracking-wide">
                 Once again, Happy Birthday JeeT ✨
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Click indicator for stages 1 and 2 */}
        {paperStage < 3 && (
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="bg-amber-100/90 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold"
              animate={{ 
                y: [0, -5, 0],
                boxShadow: [
                  "0 4px 8px rgba(0, 0, 0, 0.1)",
                  "0 8px 16px rgba(0, 0, 0, 0.2)",
                  "0 4px 8px rgba(0, 0, 0, 0.1)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              👆 Click to continue
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Stage Indicator */}
      <motion.div 
        className="mt-8 flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {[1, 2, 3].map((stage) => (
          <motion.div
            key={stage}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              stage <= paperStage ? 'bg-amber-300' : 'bg-amber-600/30'
            }`}
            animate={{
              scale: stage === paperStage ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 0.5, repeat: stage === paperStage ? Infinity : 0, repeatDelay: 1 }}
          />
        ))}
      </motion.div>

      {/* Continue Button */}
      <AnimatePresence>
        {showContinueButton && (
          <motion.button
            onClick={handleContinue}
            className="mt-12 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl border-4 border-amber-200/30 backdrop-blur-sm transition-all duration-300"
            style={{ fontFamily: 'serif' }}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          >
            🎯 Play Again! 🎯
          </motion.button>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-8 left-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="text-4xl">📜</div>
      </motion.div>
      
      <motion.div
        className="absolute top-8 right-8"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="text-4xl">🏆</div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 left-8"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-4xl">✨</div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 right-8"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 15, -15, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="text-4xl">🎉</div>
      </motion.div>
    </div>
  );
}