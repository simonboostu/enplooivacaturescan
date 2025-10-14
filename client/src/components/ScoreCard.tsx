import React from 'react';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  console.log('ScoreCard rendered with score:', score);
  
  // Don't render if score is 0 (fallback for undefined)
  if (score === 0) {
    return null;
  }

  const getScoreMessage = (score: number): string => {
    if (score >= 0 && score <= 30) {
      return '🔴 Basic mainstream: weinig onderscheidend, trekt geen topkandidaten. (0% - 30%)';
    } else if (score > 30 && score <= 70) {
      return '🟡 Kan beter: goede basis, maar weinig wow-factor. (31% - 70%)';
    } else if (score > 70 && score <= 100) {
      return '🟢 Briljant & opvallend: klaar om de juiste kandidaten aan te trekken. (71% - 100%)';
    }
    return '🟡 Kan beter: goede basis, maar weinig wow-factor. (31% - 70%)';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0 && score <= 30) {
      return 'text-red-600';
    } else if (score > 30 && score <= 70) {
      return 'text-yellow-600';
    } else if (score > 70 && score <= 100) {
      return 'text-green-600';
    }
    return 'text-yellow-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
    >
      <h3 className="text-2xl font-bold text-brand-primary mb-4 text-center">
        Hoe origineel is jouw vacature?
      </h3>
      
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Uw score:
        </p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className={`text-4xl font-bold ${getScoreColor(score)} mb-4`}
        >
          {score}%
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-sm text-gray-600 leading-relaxed"
        >
          {getScoreMessage(score)}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ScoreCard;
