import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types';
import ScoreCard from './ScoreCard';

interface ResultPanelProps {
  result: AnalysisResult;
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
          <h2 className="text-4xl text-brand-accent font-semibold text-center">
            {result.vacancyTitle}
          </h2>
        </motion.div>

        {/* Main Content - Full width layout */}
        <div className="flex-1 space-y-6 mb-6">
          {/* Ideal Candidate Section - Full width */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl font-semibold text-brand-accent mb-4 text-center">
                🎯 Ideale kandidaat
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-1 text-gray-600 text-base leading-relaxed">
                  <p className="mb-3">
                    Op basis van je vacature hebben we een profiel gemaakt van de ideale kandidaat.
                  </p>
                  <div className="bg-brand-accent/10 rounded-lg p-3">
                    <p className="text-brand-accent font-medium text-xs">
                      💡 Tip: Gebruik dit profiel om je vacaturetekst aan te passen en de juiste kandidaten aan te trekken.
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-2 flex justify-center">
                  <div className="relative w-64 h-80">
                    <div className="aspect-[4/5] bg-white rounded-xl shadow-lg overflow-hidden">
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
                            <p className="text-gray-500 font-medium text-base">Ideale kandidaat</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score Section - Full width */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <ScoreCard score={result.score || 0} />
          </motion.div>

          {/* Analysis Content Section - HTML styled content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-brand-text mb-6 text-center">
                🚀 Analyse van je vacature
              </h3>
              
              <div 
                className="analysis-content"
                dangerouslySetInnerHTML={{ __html: result.analysisContent }}
              />
              
              {/* Back Button - Right under analysis for better kiosk usability */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-8"
              >
                <motion.button
                  onClick={onComplete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg transition-colors duration-200"
                >
                  🏠 Terug naar QR code
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer - Email notice only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            De volledige analyse met gedetailleerde tips ontvang je via e-mail
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultPanel;
