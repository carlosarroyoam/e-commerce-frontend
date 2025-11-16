import { Component } from '@angular/core';
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
  private user = this.context.row.original;

  protected src = `https://ui-avatars.com/api/?name=${this.user.first_name}%20${this.user.last_name}&format=svg&background=d4d4d8`;
  protected alt = `${this.user.first_name}'s profile picture`;
}
