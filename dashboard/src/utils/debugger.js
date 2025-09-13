// Debug utility to track potential causes of refreshes
class RefreshDebugger {
  constructor() {
    this.logs = [];
    this.maxLogs = 50;
    this.startTime = Date.now();
  }

  log(message, data = {}) {
    const timestamp = Date.now() - this.startTime;
    const logEntry = {
      timestamp,
      message,
      data,
      stack: new Error().stack
    };
    
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    console.log(`[${timestamp}ms] ${message}`, data);
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

const refreshDebugger = new RefreshDebugger();

// Track when the window is being unloaded
window.addEventListener('beforeunload', () => {
  refreshDebugger.log('Window is being unloaded');
  console.log('Recent debug logs:', refreshDebugger.getLogs());
});

// Track navigation changes with popstate event instead of polling
let currentUrl = window.location.href;
window.addEventListener('popstate', () => {
  if (window.location.href !== currentUrl) {
    refreshDebugger.log('URL changed via popstate', {
      from: currentUrl,
      to: window.location.href
    });
    currentUrl = window.location.href;
  }
});

export default refreshDebugger;
