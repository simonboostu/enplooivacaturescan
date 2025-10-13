import { AnalysisResult } from './types';

/**
 * Ring buffer storage for analysis results
 * Maintains last 25 results with FIFO eviction
 */
class AnalysisStorage {
  private buffer: AnalysisResult[] = [];
  private readonly maxSize = 25;
  private currentIndex = 0;

  /**
   * Add a new analysis result to the buffer
   */
  add(result: AnalysisResult): void {
    if (this.buffer.length < this.maxSize) {
      this.buffer.push(result);
    } else {
      // Replace oldest entry
      this.buffer[this.currentIndex] = result;
      this.currentIndex = (this.currentIndex + 1) % this.maxSize;
    }
  }

  /**
   * Get the most recent analysis result
   */
  getLatest(): AnalysisResult | null {
    if (this.buffer.length === 0) {
      return null;
    }
    
    // Find the most recent entry
    let latest = this.buffer[0];
    for (const result of this.buffer) {
      if (result.timestamp > (latest?.timestamp || new Date(0))) {
        latest = result;
      }
    }
    
    return latest || null;
  }

  /**
   * Get all results in chronological order (oldest first)
   */
  getAll(): AnalysisResult[] {
    return [...this.buffer].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get the current queue size
   */
  getSize(): number {
    return this.buffer.length;
  }

  /**
   * Clear all stored results
   */
  clear(): void {
    this.buffer = [];
    this.currentIndex = 0;
  }
}

// Singleton instance
export const analysisStorage = new AnalysisStorage();
