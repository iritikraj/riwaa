import { EventEmitter } from 'events';

class RenderTracker extends EventEmitter {
  private jobs = new Map<string, number>();

  updateProgress(jobId: string, progress: number) {
    this.jobs.set(jobId, progress);
    this.emit(`progress:${jobId}`, progress);
  }

  getProgress(jobId: string): number {
    return this.jobs.get(jobId) || 0;
  }

  clearJob(jobId: string) {
    this.jobs.delete(jobId);
    this.removeAllListeners(`progress:${jobId}`);
  }
}

// 1. Augment the global scope to tell TypeScript this property is allowed
declare global {
  var renderTracker: RenderTracker | undefined;
}

// 2. Safely initialize and assign the singleton
export const renderTracker = global.renderTracker || new RenderTracker();

if (process.env.NODE_ENV !== 'production') {
  global.renderTracker = renderTracker;
}