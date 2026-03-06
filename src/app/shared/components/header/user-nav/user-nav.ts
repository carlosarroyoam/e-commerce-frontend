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

import { Session } from '@/core/data-access/interfaces/session';
import { MenuItem } from '@/shared/components/header/header';

@Component({
  selector: 'app-user-nav',
  imports: [RouterLink, OverlayModule],
  templateUrl: './user-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNav {
  public readonly session = input.required<Session | null>();
  public readonly menuItems = input.required<MenuItem[]>();
  public readonly logout = output<void>();

  protected isOpen = signal(false);

  protected src = computed(() => {
    return `https://ui-avatars.com/api/?name=${this.session()?.full_name}&format=svg&background=d4d4d8`;
  });

  protected alt = computed(() => {
    return `${this.session()?.first_name}'s profile picture`;
  });

  protected toggleIsOpen(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected close(): void {
    this.isOpen.set(false);
  }
}
