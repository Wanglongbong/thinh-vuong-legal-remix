/**
 * Safe Storage helper for iframe and sandboxed environments.
 * Prevents fatal DOMExceptions (SecurityError / QuotaExceededError)
 * when cookies or local storage are blocked or restricted.
 */

const memoryFallback: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__tv_test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

let hasStorage: boolean | null = null;

function canUseStorage(): boolean {
  if (hasStorage === null) {
    hasStorage = isLocalStorageAvailable();
  }
  return hasStorage;
}

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (canUseStorage()) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Fall through to memory
    }
    return memoryFallback[key] ?? null;
  },

  setItem(key: string, value: string): boolean {
    memoryFallback[key] = value;
    try {
      if (canUseStorage()) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch {
      // Memory fallback is already updated
    }
    return false;
  },

  removeItem(key: string): boolean {
    delete memoryFallback[key];
    try {
      if (canUseStorage()) {
        window.localStorage.removeItem(key);
        return true;
      }
    } catch {
      // Memory fallback is already updated
    }
    return false;
  },

  clear(): void {
    Object.keys(memoryFallback).forEach((k) => delete memoryFallback[k]);
    try {
      if (canUseStorage()) {
        window.localStorage.clear();
      }
    } catch {
      // Ignored
    }
  },
};
