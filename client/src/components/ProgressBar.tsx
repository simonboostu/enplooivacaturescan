import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  total: number;
  remaining: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, remaining, className = 'h-4' }) => {
  const progress = ((total - remaining) / total) * 100;

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default ProgressBar;
