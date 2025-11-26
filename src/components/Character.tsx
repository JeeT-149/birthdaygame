import { motion } from 'motion/react';

interface CharacterProps {
  expression?: 'happy' | 'surprised' | 'thinking';
  showingItem?: string | null;
  className?: string;
}

export default function Character({ expression = 'happy', showingItem, className = '' }: CharacterProps) {
  const getFace = () => {
    switch (expression) {
      case 'surprised':
        return '😮';
      case 'thinking':
        return '🤔';
      default:
        return '😊';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Character Body - Simple SVG style */}
      <motion.div
        className="relative w-32 h-48 mx-auto"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Head */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full border-4 border-orange-400 flex items-center justify-center text-4xl"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {getFace()}
        </motion.div>

        {/* Body */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg border-4 border-blue-500" />

        {/* Arms */}
        <motion.div
          className="absolute top-20 -left-2 w-6 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full border-3 border-orange-400"
          style={{ transformOrigin: 'top center' }}
          animate={{ rotate: showingItem ? [-10, 0, -10] : [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-20 -right-2 w-6 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full border-3 border-orange-400"
          style={{ transformOrigin: 'top center' }}
          animate={{ rotate: showingItem ? [10, 0, 10] : [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Legs */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="w-5 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border-3 border-gray-800" />
          <div className="w-5 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border-3 border-gray-800" />
        </div>
      </motion.div>

      {/* Item being shown */}
      {showingItem && (
        <motion.div
          className="absolute top-12 right-0 bg-white px-4 py-3 rounded-2xl shadow-lg border-4 border-pink-300 text-2xl"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          {showingItem}
        </motion.div>
      )}
    </div>
  );
}
