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

  get fullname(): string {
    return `${this.user.first_name} ${this.user.last_name}`;
  }

  get src(): string {
    return `https://ui-avatars.com/api/name=${this.fullname}&format=svg&background=d4d4d8`;
  }

  get alt(): string {
    return `${this.user.first_name}'s profile picture`;
  }
}
