import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly isOpen = signal(false);

  public readonly isSidebarOpen = this.isOpen.asReadonly();

  public toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  public close(): void {
    this.isOpen.set(false);
  }
}
