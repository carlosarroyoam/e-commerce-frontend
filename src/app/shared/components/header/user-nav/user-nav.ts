import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SessionData } from '@/core/interfaces/session-data';

@Component({
  selector: 'app-user-nav',
  imports: [RouterLink, OverlayModule],
  templateUrl: './user-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNav {
  public readonly sessionData = input.required<SessionData | null>();
  public readonly menuItems =
    input.required<{ href: string; title: string }[]>();
  public readonly logout = output<void>();

  protected isOpen = signal(false);

  protected fullname = computed(() => {
    return `${this.sessionData()?.first_name} ${this.sessionData()?.last_name}`;
  });

  protected src = computed(() => {
    return `https://ui-avatars.com/api/?name=${this.fullname()}&format=svg&background=d4d4d8`;
  });

  protected alt = computed(() => {
    return `${this.sessionData()?.first_name}'s profile picture`;
  });

  protected toggleIsOpen(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected close(): void {
    this.isOpen.set(false);
  }
}
