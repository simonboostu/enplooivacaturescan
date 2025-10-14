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
      className="h-screen bg-gradient-to-br from-brand-bg to-gray-50 p-12"
      style={{ minHeight: '1920px', minWidth: '1080px' }}
    >
      <div className="h-full flex flex-col">
        {/* Header - Optimized for vertical screen */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-12">
            <div className="text-3xl text-gray-500">
              {formatTimestamp(result.timestamp)}
            </div>
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-10 py-5 rounded-2xl text-2xl font-semibold shadow-lg transition-colors duration-200"
            >
              🏠 Terug naar start
            </motion.button>
          </div>
          
          <h1 className="text-8xl font-bold text-brand-text mb-8 leading-tight text-center">
            {result.companyName}
          </h1>
          <h2 className="text-6xl text-brand-primary font-semibold text-center">
            {result.vacancyTitle}
          </h2>
        </motion.div>

        {/* Main Content - Single column for vertical screen */}
        <div className="flex-1 mb-20">
          {/* Ideal Candidate Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl p-16 shadow-xl">
              <h3 className="text-6xl font-semibold text-brand-text mb-12 text-center">
                🎯 Ideale kandidaat
              </h3>
              <div className="text-gray-600 text-3xl leading-relaxed text-center max-w-4xl mx-auto">
                <p className="mb-12">
                  Op basis van je vacature hebben we een profiel gemaakt van de ideale kandidaat.
                </p>
                <div className="bg-brand-primary/10 rounded-xl p-12">
                  <p className="text-brand-primary font-medium text-2xl">
                    💡 Tip: Gebruik dit profiel om je vacaturetekst aan te passen en de juiste kandidaten aan te trekken.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ideal Candidate Image - Centered */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-16"
          >
            <div className="relative w-full max-w-2xl">
              <div className="aspect-[4/5] bg-white rounded-3xl shadow-xl overflow-hidden">
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
                      <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto mb-8 flex items-center justify-center">
                        <span className="text-8xl">👤</span>
                      </div>
                      <p className="text-gray-500 font-medium text-3xl">Ideale kandidaat</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Score Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <ScoreCard score={result.score || 0} />
        </motion.div>

        {/* Tips Section - Single column for vertical screen */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-6xl font-bold text-brand-text mb-16 text-center">
            🚀 Verbeterpunten voor je vacature
          </h3>
          
          <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
            {result.tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-white rounded-3xl p-16 shadow-xl border-l-8 border-brand-accent"
              >
                <div className="flex items-start space-x-8">
                  <div className="flex-shrink-0 w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-3xl pt-2">
                    {tip.length > 200 ? `${tip.substring(0, 200)}...` : tip}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer with Back Button - Optimized for vertical screen */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mb-8"
        >
          <p className="text-3xl text-gray-500 mb-12 max-w-4xl mx-auto">
            De volledige analyse met gedetailleerde tips ontvang je via e-mail
          </p>
          
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white px-16 py-8 rounded-3xl text-4xl font-bold shadow-xl transition-colors duration-200"
          >
            🏠 Terug naar QR code
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultPanel;
