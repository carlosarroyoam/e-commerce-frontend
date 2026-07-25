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

import { AuthSession } from '@/core/data-access/interfaces/auth-session';
import { MenuItem } from '@/shared/components/header/header';

@Component({
  selector: 'app-user-nav',
  imports: [RouterLink, OverlayModule],
  templateUrl: './user-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNav {
  public readonly authSession = input.required<AuthSession | null>();
  public readonly menuItems = input.required<MenuItem[]>();
  public readonly logout = output<void>();

  protected readonly isOpen = signal(false);

  protected readonly src = computed(() => {
    return `https://ui-avatars.com/api/?name=${this.authSession()?.full_name}&format=svg&background=d4d4d8`;
  });

  protected readonly alt = computed(() => {
    return `${this.authSession()?.first_name}'s profile picture`;
  });

  protected open(): void {
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
  }
}
