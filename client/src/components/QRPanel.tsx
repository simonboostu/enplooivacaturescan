import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import EnplooiLogo from './EnplooiLogo';

interface QRPanelProps {
  typeformUrl: string;
  kioskTitle: string;
  kioskSubtitle: string;
}

const QRPanel: React.FC<QRPanelProps> = ({ typeformUrl, kioskTitle, kioskSubtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-brand-bg to-white px-12"
      style={{ minHeight: '1920px', minWidth: '1080px' }}
    >
      {/* Enplooi Logo - Top of page, larger and prominent */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-12"
      >
        <EnplooiLogo width={240} height={96} />
      </motion.div>

      {/* Main Content - Optimized for vertical layout */}
      <div className="text-center max-w-5xl w-full">
        {/* Title - Smaller to make room for prominent logo */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl lg:text-6xl font-bold text-brand-text mb-6 leading-tight"
        >
          {kioskTitle.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < kioskTitle.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </motion.h1>
        
        {/* Subtitle - Smaller to make room for prominent logo */}
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-2xl lg:text-3xl text-brand-text/80 mb-16 max-w-5xl mx-auto leading-relaxed"
        >
          {kioskSubtitle.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < kioskSubtitle.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </motion.p>
        
        {/* QR Code - Much larger for visibility */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-16"
        >
          <div className="relative inline-block">
            {/* Pulsing border - thicker for kiosk */}
            <div className="absolute inset-0 rounded-4xl border-8 border-brand-accent animate-pulse-slow"></div>
            
            {/* QR Code - Larger size */}
            <div className="bg-white p-8 rounded-4xl shadow-2xl">
              <QRCodeSVG
                value={typeformUrl}
                size={480}
                level="M"
                includeMargin={true}
                className="rounded-3xl"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Instructions - Larger text with orange accents */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-2xl text-brand-text/70 mb-20"
        >
          <p className="font-semibold mb-4">📱 Scan met je telefoon</p>
          <p className="text-2xl">
            Vul het formulier in en zie hier direct je 
            <span className="text-brand-accent font-semibold"> resultaat</span>
          </p>
        </motion.div>
      </div>
      
      {/* Footer - Centered social proof */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-16 left-0 right-0 text-center px-16"
      >
        {/* Social Proof - Centered with orange accents */}
        <div className="text-2xl text-brand-text/70">
          Al meer dan <span className="font-semibold text-brand-accent">10.000</span> vacatures geoptimaliseerd
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRPanel;
