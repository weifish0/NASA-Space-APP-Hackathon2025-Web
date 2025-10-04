// 瀏覽器兼容性工具
export class BrowserCompatibility {
  // 檢查是否支援 AbortController
  static supportsAbortController(): boolean {
    return typeof AbortController !== 'undefined';
  }

  // 檢查是否支援 fetch
  static supportsFetch(): boolean {
    return typeof fetch !== 'undefined';
  }

  // 檢查是否支援 Promise
  static supportsPromise(): boolean {
    return typeof Promise !== 'undefined';
  }

  // 創建兼容的 fetch 請求
  static createFetchRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.supportsFetch()) {
      throw new Error('此瀏覽器不支援 fetch API，請使用現代瀏覽器');
    }

    if (!this.supportsAbortController() && options.signal) {
      // 如果不支援 AbortController，移除 signal 選項
      const { signal, ...optionsWithoutSignal } = options;
      console.warn('此瀏覽器不支援 AbortController，將無法取消請求');
      return fetch(url, optionsWithoutSignal);
    }

    return fetch(url, options);
  }

  // 創建兼容的超時處理
  static createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('請求超時'));
      }, timeoutMs);
    });
  }

  // 檢查瀏覽器類型
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

  // 顯示瀏覽器兼容性警告
  static showCompatibilityWarning(): void {
    const browserInfo = this.getBrowserInfo();
    
    if (!this.supportsFetch() || !this.supportsPromise()) {
      console.error('❌ 此瀏覽器不支援必要的 Web API，請升級到現代瀏覽器');
      return;
    }

    if (!browserInfo.isModern) {
      console.warn(`⚠️ 您正在使用 ${browserInfo.name} ${browserInfo.version}，建議升級到最新版本以獲得最佳體驗`);
    } else {
      console.log(`✅ 瀏覽器兼容性檢查通過：${browserInfo.name} ${browserInfo.version}`);
    }
  }
}

// 在模組載入時檢查兼容性
BrowserCompatibility.showCompatibilityWarning();
