import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types';
import ScoreCard from './ScoreCard';

interface ResultPanelProps {
  result: AnalysisResult;
  displaySeconds: number;
  onComplete: () => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ result, onComplete }) => {
  const [imageError, setImageError] = useState(false);

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-gradient-to-br from-brand-bg to-gray-50 p-8 overflow-hidden"
      style={{ minHeight: '1920px', minWidth: '1080px' }}
    >
      <div className="h-full flex flex-col">
        {/* Header - Compact for viewport */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl text-gray-500">
              {formatTimestamp(result.timestamp)}
            </div>
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition-colors duration-200"
            >
              🏠 Terug naar start
            </motion.button>
          </div>
          
          <h1 className="text-5xl font-bold text-brand-text mb-4 leading-tight text-center">
            {result.companyName}
          </h1>
          <h2 className="text-4xl text-brand-primary font-semibold text-center">
            {result.vacancyTitle}
          </h2>
        </motion.div>

        {/* Main Content - Compact layout for viewport */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ideal Candidate Section - Left side */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-3xl font-semibold text-brand-text mb-6 text-center">
                🎯 Ideale kandidaat
              </h3>
              <div className="text-gray-600 text-xl leading-relaxed text-center">
                <p className="mb-6">
                  Op basis van je vacature hebben we een profiel gemaakt van de ideale kandidaat.
                </p>
                <div className="bg-brand-primary/10 rounded-lg p-6">
                  <p className="text-brand-primary font-medium text-lg">
                    💡 Tip: Gebruik dit profiel om je vacaturetekst aan te passen en de juiste kandidaten aan te trekken.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ideal Candidate Image - Right side */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              <div className="aspect-[4/5] bg-white rounded-2xl shadow-xl overflow-hidden">
                {!imageError ? (
                  <img
                    src={result.idealCandidateImageUrl}
                    alt={`Ideale kandidaat voor ${result.vacancyTitle}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                      <p className="text-gray-500 font-medium text-lg">Ideale kandidaat</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Score and Tips Section - Compact layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Score Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <ScoreCard score={result.score || 0} />
          </motion.div>

          {/* Tips Section - Compact */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <h3 className="text-2xl font-bold text-brand-text mb-4 text-center">
              🚀 Verbeterpunten voor je vacature
            </h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {result.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-brand-accent"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {tip.length > 120 ? `${tip.substring(0, 120)}...` : tip}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer with Back Button - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="text-lg text-gray-500 mb-4">
            De volledige analyse met gedetailleerde tips ontvang je via e-mail
          </p>
          
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-colors duration-200"
          >
            🏠 Terug naar QR code
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultPanel;
