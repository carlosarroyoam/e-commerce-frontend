import { Component, computed, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  firstName = input.required<string>();
  lastName = input.required<string>();
  src = computed(
    () =>
      `https://ui-avatars.com/api/?name=${this.firstName()}%20${this.lastName()}&format=svg&background=d4d4d8`,
  );
  alt = computed(() => `${this.firstName()}'s profile picture`);
}
