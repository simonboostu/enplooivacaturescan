import React from 'react';
import { motion } from 'framer-motion';

interface AITransitionProps {
  onComplete: () => void;
}

const AITransition: React.FC<AITransitionProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-brand-bg to-white"
      style={{ minHeight: '1920px', minWidth: '1080px' }}
    >
      {/* AI Processing Animation */}
      <div className="text-center">
        {/* AI Brain Icon with Pulse Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-4"
          >
            🧠
          </motion.div>
        </motion.div>

        {/* AI Processing Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-4xl font-bold text-brand-text mb-4">
            AI Analyseert je vacature...
          </h2>
          <p className="text-2xl text-brand-text/80">
            Even geduld, we maken een gepersonaliseerde analyse
          </p>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-4 h-4 bg-brand-accent rounded-full"
            />
          ))}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
          className="mt-8 max-w-md mx-auto"
        >
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-brand-accent to-brand-primary rounded-full"
            />
          </div>
        </motion.div>

        {/* AI Features List */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-8 text-left max-w-md mx-auto"
        >
          <div className="space-y-2">
            {[
              "✓ Vacaturetekst geanalyseerd",
              "✓ Ideale kandidaat profiel gemaakt", 
              "✓ Verbeterpunten geïdentificeerd",
              "✓ Origineelheidsscore berekend"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2 + index * 0.2, duration: 0.4 }}
                className="text-lg text-brand-text/80"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Auto-complete after animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.3 }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
};

export default AITransition;
