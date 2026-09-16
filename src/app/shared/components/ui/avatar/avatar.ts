import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Muestra el avatar generado a partir del nombre de una persona.
 */
@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './avatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  public readonly firstName = input.required<string>();
  public readonly lastName = input.required<string>();

  protected readonly fullname = computed(() => `${this.firstName()} ${this.lastName()}`);

  protected readonly src = computed(
    () =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(this.fullname())}&format=svg&background=d4d4d8`,
  );

  protected readonly alt = computed(() => `${this.firstName()}'s profile picture`);
}
