// Browser compatibility utility
export class BrowserCompatibility {
  // Check if AbortController is supported
  static supportsAbortController(): boolean {
    return typeof AbortController !== 'undefined';
  }

  // Check if fetch is supported
  static supportsFetch(): boolean {
    return typeof fetch !== 'undefined';
  }

  // Check if Promise is supported
  static supportsPromise(): boolean {
    return typeof Promise !== 'undefined';
  }

  // Create compatible fetch request
  static createFetchRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.supportsFetch()) {
      throw new Error('This browser does not support fetch API, please use a modern browser');
    }

    if (!this.supportsAbortController() && options.signal) {
      // If AbortController is not supported, remove signal option
      const { signal, ...optionsWithoutSignal } = options;
      console.warn('This browser does not support AbortController, requests cannot be cancelled');
      return fetch(url, optionsWithoutSignal);
    }

    return fetch(url, options);
  }

  // Create compatible timeout handling
  static createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeoutMs);
    });
  }

  // Check browser type
  static getBrowserInfo(): { name: string; version: string; isModern: boolean } {
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';
    let isModern = false;

    if (userAgent.includes('Chrome')) {
      name = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      isModern = parseInt(version) >= 60;
    } else if (userAgent.includes('Firefox')) {
      name = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      isModern = parseInt(version) >= 55;
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      name = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      isModern = parseInt(version) >= 12;
    } else if (userAgent.includes('Edge')) {
      name = 'Edge';
      const match = userAgent.match(/Edge\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      isModern = parseInt(version) >= 79;
    }

    return { name, version, isModern };
  }

  // Show browser compatibility warning
  static showCompatibilityWarning(): void {
    const browserInfo = this.getBrowserInfo();
    
    if (!this.supportsFetch() || !this.supportsPromise()) {
      console.error('❌ This browser does not support required Web APIs, please upgrade to a modern browser');
      return;
    }

    if (!browserInfo.isModern) {
      console.warn(`⚠️ You are using ${browserInfo.name} ${browserInfo.version}, it is recommended to upgrade to the latest version for the best experience`);
    } else {
      console.log(`✅ Browser compatibility check passed: ${browserInfo.name} ${browserInfo.version}`);
    }
  }
}

// Check compatibility when module loads
BrowserCompatibility.showCompatibilityWarning();
