import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types';

interface ResultPanelProps {
  result: AnalysisResult;
  displaySeconds: number;
  onComplete: () => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ result, displaySeconds, onComplete }) => {
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
        {/* Header - Much larger for kiosk */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl text-gray-500">
              {formatTimestamp(result.timestamp)}
            </div>
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-2xl text-2xl font-semibold shadow-lg transition-colors duration-200"
            >
              🏠 Terug naar start
            </motion.button>
          </div>
          
          <h1 className="text-7xl lg:text-8xl font-bold text-brand-text mb-6 leading-tight">
            {result.companyName}
          </h1>
          <h2 className="text-5xl lg:text-6xl text-brand-primary font-semibold">
            {result.vacancyTitle}
          </h2>
        </motion.div>

        {/* Main Content - Optimized for vertical layout */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-16 mb-16">
          {/* Left: Company Info - Larger */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <h3 className="text-4xl font-semibold text-brand-text mb-8">
                🎯 Ideale kandidaat
              </h3>
              <div className="text-gray-600 text-2xl leading-relaxed">
                <p className="mb-8">
                  Op basis van je vacature hebben we een profiel gemaakt van de ideale kandidaat.
                </p>
                <div className="bg-brand-primary/10 rounded-xl p-8">
                  <p className="text-brand-primary font-medium text-xl">
                    💡 Tip: Gebruik dit profiel om je vacaturetekst aan te passen en de juiste kandidaten aan te trekken.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Ideal Candidate Image - Larger */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-lg">
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
                      <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span className="text-6xl">👤</span>
                      </div>
                      <p className="text-gray-500 font-medium text-2xl">Ideale kandidaat</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tips Section - Much larger for kiosk */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-5xl font-bold text-brand-text mb-12 text-center">
            🚀 Verbeterpunten voor je vacature
          </h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {result.tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-white rounded-2xl p-10 shadow-xl border-l-8 border-brand-accent"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-2xl">
                    {tip.length > 140 ? `${tip.substring(0, 140)}...` : tip}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer with Back Button - Larger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="text-2xl text-gray-500 mb-8">
            De volledige analyse met gedetailleerde tips ontvang je via e-mail
          </p>
          
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white px-12 py-6 rounded-3xl text-3xl font-bold shadow-xl transition-colors duration-200"
          >
            🏠 Terug naar QR code
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultPanel;
