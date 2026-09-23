import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucidePencil } from '@lucide/angular';

import { UserStore } from '@/features/user/data-access/stores/user.store';
import { USER_STATUS_CONFIG } from '@/features/user/utils/user-status';
import { Button } from '@/shared/components/ui/button/button';
import { Chip } from '@/shared/components/ui/chip/chip';
import { Spinner } from '@/shared/components/ui/spinner/spinner';
import { DateTimePipe } from '@/shared/pipes/date-time/date-time.pipe';

/**
 * Página de consulta de un usuario. Carga el usuario indicado en la ruta y muestra sus datos.
 */
@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, LucideArrowLeft, LucidePencil, Button, Spinner, Chip, DateTimePipe],
  templateUrl: './user-detail-page.html',
  providers: [UserStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  protected readonly store = inject(UserStore);

  protected readonly user = this.store.selectedItem;

  protected readonly status = computed(() => {
    const user = this.user();
    return user ? USER_STATUS_CONFIG[user.status] : null;
  });

  protected readonly roles = computed(() =>
    this.user()
      ?.roles.map((role) => role.name)
      .join(', '),
  );

  /**
   * Carga el usuario indicado en la ruta. Si el id no es un entero positivo no se consulta la API
   * y la página muestra el estado de error.
   */
  constructor() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(userId) && userId > 0) {
      this.store.findById(userId);
    }
  }

  /**
   * Vuelve a la página anterior del historial (p. ej. el listado con sus filtros).
   */
  protected back(): void {
    this.location.back();
  }
}
