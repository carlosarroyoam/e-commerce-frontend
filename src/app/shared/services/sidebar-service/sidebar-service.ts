import { Injectable, signal } from '@angular/core';

/**
 * Mantiene el estado de apertura del sidebar de navegación.
 */
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly isOpen = signal(false);

  public readonly isSidebarOpen = this.isOpen.asReadonly();

  /**
   * Alterna el estado de apertura del sidebar.
   */
  public toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  /**
   * Cierra el sidebar.
   */
  public close(): void {
    this.isOpen.set(false);
  }
}
