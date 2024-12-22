import { Component, signal } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/app/core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  readonly context = injectFlexRenderContext<CellContext<User, unknown>>();

  src = signal(
    `https://ui-avatars.com/api/?name=${this.context.row.original.first_name}%20${this.context.row.original.last_name}&format=svg&background=d4d4d8`,
  );
  alt = signal(`${this.context.row.original.first_name}'s profile picture`);
}
