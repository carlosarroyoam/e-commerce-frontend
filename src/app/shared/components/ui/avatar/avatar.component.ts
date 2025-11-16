import { Component, signal } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  private readonly context =
    injectFlexRenderContext<CellContext<User, unknown>>();

  protected src = signal(
    `https://ui-avatars.com/api/?name=${this.context.row.original.first_name}%20${this.context.row.original.last_name}&format=svg&background=d4d4d8`,
  );

  protected alt = signal(
    `${this.context.row.original.first_name}'s profile picture`,
  );
}
