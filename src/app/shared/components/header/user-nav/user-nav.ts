import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
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
  public sessionData = input.required<SessionData | null>();
  public menuItems = input.required<{ href: string; title: string }[]>();
  public logout = output<void>();

  protected isOpen = signal(false);

  get session() {
    return this.sessionData();
  }

  get fullname(): string {
    return `${this.session?.first_name} ${this.session?.last_name}`;
  }

  get src(): string {
    return `https://ui-avatars.com/api/?name=${this.fullname}&format=svg&background=d4d4d8`;
  }

  get alt(): string {
    return `${this.session?.first_name}'s profile picture`;
  }

  protected toggleIsOpen(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }
}
