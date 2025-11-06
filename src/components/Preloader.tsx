import { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [percentage, setPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total
    const steps = 100;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Start fade out after reaching 100%
          setTimeout(() => {
            setIsVisible(false);
            // Complete after fade animation
            setTimeout(onComplete, 600);
          }, 200);
          return 100;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        percentage >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#191a1a' }}
    >
      <div className="text-center">
        <div 
          className="text-8xl font-doto font-light tracking-wider transition-all duration-150 ease-out"
          style={{ 
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))'
          }}
        >
          <span className="inline-block animate-pulse">
            {percentage.toString().padStart(2, '0')}
          </span>
          <span 
            className="inline-block ml-2 animate-pulse"
            style={{ animationDelay: '0.1s' }}
          >
            %
          </span>
        </div>
      </div>
      
      {/* Subtle background glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%)`
        }}
      />
    </div>
  );
};

export default Preloader;