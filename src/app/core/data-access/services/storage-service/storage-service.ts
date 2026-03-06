import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

interface StorageRecord<T> {
  value: T;
  expiresAt: number | null;
}

export abstract class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  protected abstract readonly storage: Storage;
  protected abstract readonly namespace: string;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private buildKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  hasKey(key: string): boolean {
    if (!this.isBrowser) return false;
    return this.storage.getItem(this.buildKey(key)) !== null;
  }

  setItem<T>(key: string, value: T, ttlInMs?: number): boolean {
    if (!this.isBrowser) return false;

    try {
      const record: StorageRecord<T> = {
        value,
        expiresAt: ttlInMs ? Date.now() + ttlInMs : null,
      };

      this.storage.setItem(this.buildKey(key), JSON.stringify(record));

      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const raw = this.storage.getItem(this.buildKey(key));
      if (!raw) return null;

      const record = JSON.parse(raw) as StorageRecord<unknown>;

      if (record.expiresAt !== null && Date.now() > record.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return record.value as T;
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    this.storage.removeItem(this.buildKey(key));
  }

  clear(): void {
    if (!this.isBrowser) return;

    const keysToRemove: string[] = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(`${this.namespace}:`)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      this.storage.removeItem(key);
    }
  }
}
