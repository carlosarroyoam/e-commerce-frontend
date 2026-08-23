import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

interface StorageRecord<T> {
  value: T;
  expiresAt: number | null;
}

/**
 * Base abstracta para servicios de almacenamiento con namespace y expiración opcional por clave.
 */
export abstract class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  protected abstract readonly storage: Storage;
  protected abstract readonly namespace: string;

  /**
   * Indica si existe un valor almacenado para la clave dada.
   *
   * @param key Clave a buscar, sin el namespace.
   * @returns true si existe un valor almacenado para la clave.
   */
  public hasKey(key: string): boolean {
    if (!this.isBrowser) return false;
    return this.storage.getItem(this.buildKey(key)) !== null;
  }

  /**
   * Guarda un valor bajo la clave dada, con expiración opcional en milisegundos.
   *
   * @param key Clave bajo la cual guardar el valor, sin el namespace.
   * @param value Valor a almacenar.
   * @param ttlInMs Tiempo de vida en milisegundos; si se omite, el valor no expira.
   * @returns true si el valor se guardó correctamente.
   */
  public setItem<T>(key: string, value: T, ttlInMs?: number): boolean {
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

  /**
   * Obtiene el valor almacenado para la clave dada, o null si no existe o expiró.
   *
   * @param key Clave a consultar, sin el namespace.
   * @returns El valor almacenado, o null si no existe o expiró.
   */
  public getItem<T>(key: string): T | null {
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

  /**
   * Elimina el valor almacenado para la clave dada.
   *
   * @param key Clave a eliminar, sin el namespace.
   */
  public removeItem(key: string): void {
    if (!this.isBrowser) return;
    this.storage.removeItem(this.buildKey(key));
  }

  /**
   * Elimina todos los valores almacenados bajo el namespace del servicio.
   */
  public clear(): void {
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

  /**
   * Indica si el código se ejecuta en el navegador (no en SSR).
   *
   * @returns true si se ejecuta en el navegador.
   */
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Construye la clave final anteponiendo el namespace.
   *
   * @param key Clave original, sin el namespace.
   * @returns La clave con el namespace anteponiendo.
   */
  private buildKey(key: string): string {
    return `${this.namespace}:${key}`;
  }
}
