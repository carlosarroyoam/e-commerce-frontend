import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@/shared/components/footer/footer';

/**
 * Layout para las páginas de autenticación, muestra el contenido de la ruta y el pie de página.
 */
@Component({
  imports: [RouterOutlet, Footer],
  templateUrl: './auth-layout.html',
  host: {
    class: 'grid min-h-dvh grid-cols-1 grid-rows-[1fr_auto]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
