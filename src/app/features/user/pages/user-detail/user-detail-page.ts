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
  protected readonly store = inject(UserStore);

  protected readonly user = this.store.selectedItem;

  protected readonly status = computed(() => {
    const user = this.user();
    return user ? USER_STATUS_CONFIG[user.status] : null;
  });

  protected readonly roles = computed(
    () =>
      this.user()
        ?.roles.map((role) => role.name)
        .join(', ') ?? '-',
  );

  /**
   * Carga el usuario indicado en la ruta.
   */
  constructor() {
    this.store.findById(Number(this.route.snapshot.paramMap.get('id')));
  }
}
