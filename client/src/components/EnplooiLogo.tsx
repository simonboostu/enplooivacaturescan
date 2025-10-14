import React from 'react';
import enplooiLogo from './enplooi-logo.png';

interface EnplooiLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const EnplooiLogo: React.FC<EnplooiLogoProps> = ({
  width = 180,
  height = 72,
  className = ""
}) => {
  return (
    <img
      src={enplooiLogo}
      alt="enplooi"
      width={width}
      height={height}
      className={className}
      style={{
        objectFit: 'contain',
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
};

export default EnplooiLogo;
