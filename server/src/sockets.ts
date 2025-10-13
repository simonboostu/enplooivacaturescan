import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { AnalysisResult } from './types';

let io: SocketIOServer | null = null;

/**
 * Initialize Socket.IO server with CORS configuration
 */
export function initializeSockets(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env['NODE_ENV'] === 'production' ? false : ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Emit new analysis result to all connected clients
 */
export function emitNewAnalysis(result: AnalysisResult): void {
  if (!io) {
    console.warn('Socket.IO not initialized, cannot emit analysis');
    return;
  }

  console.log(`Emitting new analysis: ${result.companyName} - ${result.vacancyTitle}`);
  io.emit('analysis:new', result);
}

/**
 * Get the Socket.IO server instance
 */
export function getSocketServer(): SocketIOServer | null {
  return io;
}
