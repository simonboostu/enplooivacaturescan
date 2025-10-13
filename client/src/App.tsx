import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import QRPanel from './components/QRPanel';
import ResultPanel from './components/ResultPanel';
import { AnalysisResult, AppState, AppConfig } from './types';
import { useTheme } from './lib/theme';

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

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {state === 'idle' ? (
          <QRPanel
            key="qr-panel"
            typeformUrl={config.typeformUrl}
            kioskTitle={config.kioskTitle}
          />
        ) : currentResult ? (
          <ResultPanel
            key={`result-${currentResult.id}`}
            result={currentResult}
            displaySeconds={config.displaySeconds}
            onComplete={handleResultComplete}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default App;
