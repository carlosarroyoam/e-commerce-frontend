import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

/**
 * Celda de tabla que muestra el avatar generado y el nombre del usuario de la fila.
 */
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  private readonly context = injectFlexRenderContext<CellContext<UserResponse, unknown>>();
  private readonly user = this.context.row.original;

  /**
   * Nombre completo del usuario a partir de sus nombres y apellidos.
   *
   * @returns Nombre completo del usuario de la fila.
   */
  get fullname(): string {
    return `${this.user.first_name} ${this.user.last_name}`;
  }

  /**
   * URL del avatar generado a partir del nombre completo del usuario.
   *
   * @returns URL de la imagen del avatar.
   */
  get src(): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.fullname)}&format=svg&background=d4d4d8`;
  }

  /**
   * Texto alternativo de la imagen del avatar.
   *
   * @returns Texto alternativo de la imagen del avatar.
   */
  get alt(): string {
    return `${this.user.first_name}'s profile picture`;
  }
}
