import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import QRPanel from './components/QRPanel';
import ResultPanel from './components/ResultPanel';
import { AnalysisResult, AppState, AppConfig } from './types';
import { useTheme } from './lib/theme';

// Utility function to generate test IDs
const generateTestId = () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('idle');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [queue, setQueue] = useState<AnalysisResult[]>([]);
  const [, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState<AppConfig>({
    typeformUrl: 'https://form.typeform.com/to/example',
    displaySeconds: 15,
    kioskTitle: 'Gratis Vacaturescan',
    kioskSubtitle: 'Scan de QR, vul kort je vacature in, wij tonen hier meteen 4 tips. De volledige analyse ontvang je via e-mail.',
  });

  // Initialize theme
  useTheme();

  // Fetch configuration from server
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Use relative URL in production, absolute URL in development
        const serverUrl = import.meta.env.VITE_SERVER_URL || 
          (import.meta.env.PROD ? '' : 'http://localhost:3000');
        const response = await fetch(`${serverUrl}/api/config`);
        if (response.ok) {
          const serverConfig = await response.json();
          setConfig({
            typeformUrl: serverConfig.typeformUrl,
            displaySeconds: serverConfig.displaySeconds,
            kioskTitle: serverConfig.kioskTitle,
            kioskSubtitle: serverConfig.kioskSubtitle,
          });
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || 
      (import.meta.env.PROD ? '' : 'http://localhost:3000');
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('analysis:new', (result: AnalysisResult) => {
      console.log('New analysis received:', result);
      handleNewAnalysis(result);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Fallback polling when socket is not connected
  useEffect(() => {
    if (!isConnected) {
      const pollInterval = setInterval(async () => {
        try {
          const serverUrl = import.meta.env.VITE_SERVER_URL || 
            (import.meta.env.PROD ? '' : 'http://localhost:3000');
          const response = await fetch(`${serverUrl}/api/last`);
          if (response.ok) {
            const result = await response.json();
            if (result && result.id !== currentResult?.id) {
              handleNewAnalysis(result);
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(pollInterval);
    }
  }, [isConnected, currentResult]);

  // Handle new analysis result
  const handleNewAnalysis = useCallback((result: AnalysisResult) => {
    // Convert timestamp string to Date if needed
    if (typeof result.timestamp === 'string') {
      result.timestamp = new Date(result.timestamp);
    }

    if (state === 'idle') {
      // Show immediately if we're idle
      setCurrentResult(result);
      setState('showing');
    } else {
      // Add to queue if we're already showing something
      setQueue(prev => [...prev, result]);
    }
  }, [state]);

  // Handle result display completion
  const handleResultComplete = useCallback(() => {
    if (queue.length > 0) {
      // Show next result from queue
      const nextResult = queue[0];
      if (nextResult) {
        setQueue(prev => prev.slice(1));
        setCurrentResult(nextResult);
        setState('showing');
      }
    } else {
      // Return to idle state
      setState('idle');
      setCurrentResult(null);
    }
  }, [queue]);

  // Hide cursor after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetCursor = () => {
      document.body.style.cursor = 'default';
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.body.style.cursor = 'none';
      }, 3000);
    };

    const events = ['mousemove', 'mousedown', 'mouseup', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetCursor);
    });

    // Initial timeout
    timeout = setTimeout(() => {
      document.body.style.cursor = 'none';
    }, 3000);

    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, resetCursor);
      });
    };
  }, []);

  // Disable context menu
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  // Hidden keystroke combination to trigger test webhook (Ctrl+Shift+T)
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+T combination
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        console.log('Test webhook triggered via keystroke combination');
        
        // Create test data
        const testResult: AnalysisResult = {
          id: generateTestId(),
          companyName: 'Demo Bedrijf',
          vacancyTitle: 'Software Developer',
          idealCandidateImageUrl: 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Ideal+Candidate',
          analysisContent: `
            <p>De vacaturetekst voor Software Developer bij Demo Bedrijf heeft een goede basis, maar er zijn enkele verbeterpunten mogelijk om de juiste kandidaten aan te trekken.</p>
            
            <ul>
              <li>
                <h3>Specifieke technische vaardigheden toevoegen</h3>
                <p>Voeg meer specifieke technische vaardigheden toe aan je vacature om de juiste kandidaten aan te trekken.</p>
              </li>
              <li>
                <h3>Bedrijfscultuur beschrijven</h3>
                <p>Beschrijf de bedrijfscultuur en waarden om kandidaten een beter beeld te geven van de werkomgeving.</p>
              </li>
              <li>
                <h3>Salaris en secundaire arbeidsvoorwaarden</h3>
                <p>Vermeld salaris en secundaire arbeidsvoorwaarden om transparantie te bieden en geschikte kandidaten aan te trekken.</p>
              </li>
              <li>
                <h3>Thuiswerk en flexibele werktijden</h3>
                <p>Specificeer thuiswerk en flexibele werktijden om flexibiliteit te bieden en meer kandidaten aan te spreken.</p>
              </li>
            </ul>
          `,
          score: 75,
          timestamp: new Date(),
          meta: {
            source: 'test-keystroke',
            analysisId: 'test-' + Date.now(),
            submittedAt: new Date().toISOString(),
          },
        };

        // Simulate receiving the result
        handleNewAnalysis(testResult);
        
        // Show a brief notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #10b981;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = '🧪 Test resultaat getriggerd!';
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleNewAnalysis]);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            🔄 Verbinden...
          </div>
        </div>
      )}

      {/* Queue Indicator */}
      {queue.length > 0 && (
        <div className="absolute top-4 left-4 z-50">
          <div className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            📋 {queue.length} resultaat{queue.length !== 1 ? 'en' : ''} in wachtrij
          </div>
        </div>
      )}

      {/* Hidden Test Indicator - Only visible on hover */}
      <div className="absolute bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono">
          <div className="text-gray-300">Test: Ctrl+Shift+T</div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {state === 'idle' ? (
          <QRPanel
            key="qr-panel"
            typeformUrl={config.typeformUrl}
            kioskTitle={config.kioskTitle}
            kioskSubtitle={config.kioskSubtitle}
          />
        ) : currentResult ? (
          <ResultPanel
            key={`result-${currentResult.id}`}
            result={currentResult}
            onComplete={handleResultComplete}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default App;
