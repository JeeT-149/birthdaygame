import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Sparkles, Save, Play } from 'lucide-react';
import Confetti from './Confetti';
import { useAudio } from './AudioPlayer';

interface BirthdayCreateProps {
  onComplete: () => void;
}

export default function BirthdayCreate({ onComplete }: BirthdayCreateProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    hint: '',
    password: '',
    secretMessage: ''
  });
  const { playSound, autoStartMusic } = useAudio();

  // Auto-start background music when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      autoStartMusic();
    }, 500);
    return () => clearTimeout(timer);
  }, [autoStartMusic]);

  // Input validation functions
  const validateName = (value: string) => {
    // Only alphabets and max 20 characters
    const alphabetOnly = value.replace(/[^a-zA-Z\s]/g, '');
    return alphabetOnly.slice(0, 20);
  };

  const validatePassword = (value: string) => {
    // Only alphabets and numbers, max 20 characters
    const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '');
    return alphanumericOnly.slice(0, 20);
  };

  const validateHint = (value: string) => {
    // All characters allowed, max 40 characters
    return value.slice(0, 40);
  };

  const validateSecretMessage = (value: string) => {
    // All characters allowed, max 500 characters
    return value.slice(0, 500);
  };

  const handleInputChange = (field: string, value: string) => {
    playSound('type');
    let validatedValue = value;
    
    switch (field) {
      case 'name':
        validatedValue = validateName(value);
        break;
      case 'password':
        validatedValue = validatePassword(value);
        break;
      case 'hint':
        validatedValue = validateHint(value);
        break;
      case 'secretMessage':
        validatedValue = validateSecretMessage(value);
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: validatedValue
    }));
  };

  const handleSave = () => {
    playSound('success');
    // Here you would typically save the data to localStorage or a database
    localStorage.setItem('customBirthdayGame', JSON.stringify(formData));
    console.log('Game saved:', formData);
  };

  const handlePlay = () => {
    playSound('click');
    // Store the custom game data and start the game
    localStorage.setItem('customBirthdayGame', JSON.stringify(formData));
    onComplete();
  };

  const handleCreateLink = () => {
    if (!isFormValid) return;
    
    playSound('success');
    
    // Encode the game data into URL parameters
    const gameData = {
      name: formData.name,
      hint: formData.hint,
      password: formData.password,
      secretMessage: formData.secretMessage
    };
    
    // Create a shareable link with encoded data
    const encodedData = btoa(JSON.stringify(gameData));
    const gameLink = `${window.location.origin}${window.location.pathname}?game=${encodedData}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(gameLink).then(() => {
      alert(`Game link created and copied to clipboard!\n\nShare this link: ${gameLink}`);
    }).catch(() => {
      // Fallback if clipboard API fails
      prompt('Game link created! Copy this link to share:', gameLink);
    });
  };

  const isFormValid = formData.name && formData.hint && formData.password && formData.secretMessage;

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

      {/* Main Content */}
      <div className="text-center space-y-8 z-10 max-w-6xl w-full pt-32">
        {/* Title */}
        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-bold mb-8"
          style={{ 
            fontFamily: "'CustomBirthdayFont', 'Comic Sans MS', cursive",
            textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
            WebkitTextStroke: '2px white'
          }}
          initial={{ y: -100, opacity: 0, scale: 0 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            bounce: 0.5
          }}
        >
          Create Birthday Game
        </motion.h1>

        {/* Form Container */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border-4 border-pink-300 shadow-2xl"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <label className="block text-xl font-bold text-purple-700" style={{ fontFamily: 'serif' }}>
                🎂 Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter the birthday person's name..."
                  className="w-full p-4 pr-12 border-3 border-pink-300 rounded-2xl text-lg focus:border-purple-400 focus:outline-none bg-pink-50/50"
                  style={{ fontFamily: 'serif' }}
                  maxLength={20}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 group">
                  <div className="text-orange-500 text-lg cursor-help">❗</div>
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Only alphabets and spaces allowed • Max 20 characters
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <label className="block text-xl font-bold text-purple-700" style={{ fontFamily: 'serif' }}>
                🔒 Password Game Answer
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter the password..."
                  className="w-full p-4 pr-12 border-3 border-pink-300 rounded-2xl text-lg focus:border-purple-400 focus:outline-none bg-purple-50/50"
                  style={{ fontFamily: 'serif' }}
                  maxLength={20}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 group">
                  <div className="text-orange-500 text-lg cursor-help">❗</div>
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Only letters and numbers allowed • Max 20 characters
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hint Field */}
            <motion.div
              className="space-y-2 md:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <label className="block text-xl font-bold text-purple-700" style={{ fontFamily: 'serif' }}>
                💡 Password Hint
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.hint}
                  onChange={(e) => handleInputChange('hint', e.target.value)}
                  placeholder="Enter a hint for the password..."
                  className="w-full p-4 pr-12 border-3 border-pink-300 rounded-2xl text-lg focus:border-purple-400 focus:outline-none bg-yellow-50/50"
                  style={{ fontFamily: 'serif' }}
                  maxLength={40}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 group">
                  <div className="text-orange-500 text-lg cursor-help">❗</div>
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    All characters allowed • Max 40 characters
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Secret Message Field */}
            <motion.div
              className="space-y-2 md:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <label className="block text-xl font-bold text-purple-700" style={{ fontFamily: 'serif' }}>
                ✨ Secret Birthday Message
              </label>
              <div className="relative">
                <textarea
                  value={formData.secretMessage}
                  onChange={(e) => handleInputChange('secretMessage', e.target.value)}
                  placeholder="Enter the special birthday message that will be revealed..."
                  rows={4}
                  className="w-full p-4 pr-12 border-3 border-pink-300 rounded-2xl text-lg focus:border-purple-400 focus:outline-none bg-blue-50/50 resize-none"
                  style={{ fontFamily: 'serif' }}
                  maxLength={500}
                />
                <div className="absolute right-4 top-4 group">
                  <div className="text-orange-500 text-lg cursor-help">❗</div>
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    All characters allowed • Max 500 characters
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Buttons */}
          <motion.div
            className="flex gap-4 justify-center mt-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <motion.button
              onClick={handlePlay}
              disabled={!isFormValid}
              className={`px-8 py-4 rounded-full shadow-lg flex items-center gap-2 text-white font-bold text-lg ${
                isFormValid 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              whileHover={isFormValid ? { scale: 1.05 } : {}}
              whileTap={isFormValid ? { scale: 0.95 } : {}}
              style={{ fontFamily: 'serif' }}
            >
              <Play className="w-5 h-5" />
              Play Game
            </motion.button>

            <motion.button
              onClick={handleCreateLink}
              disabled={!isFormValid}
              className={`px-8 py-4 rounded-full shadow-lg flex items-center gap-2 text-white font-bold text-lg ${
                isFormValid 
                  ? 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              whileHover={isFormValid ? { scale: 1.05 } : {}}
              whileTap={isFormValid ? { scale: 0.95 } : {}}
              style={{ fontFamily: 'serif' }}
            >
              <Save className="w-5 h-5" />
              Create Link
            </motion.button>
          </motion.div>

          {/* Form Status */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            {!isFormValid && (
              <p className="text-orange-600 font-semibold" style={{ fontFamily: 'serif' }}>
                ⚠️ Please fill in all fields to create your birthday game!
              </p>
            )}
            {isFormValid && (
              <p className="text-green-600 font-semibold" style={{ fontFamily: 'serif' }}>
                ✅ Your birthday game is ready! Play it or create a shareable link!
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}