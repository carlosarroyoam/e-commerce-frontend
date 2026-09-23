import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucidePencil } from '@lucide/angular';

import { CategoryStore } from '@/features/category/data-access/stores/category.store';
import { Button } from '@/shared/components/ui/button/button';
import { Chip } from '@/shared/components/ui/chip/chip';
import { Spinner } from '@/shared/components/ui/spinner/spinner';
import { DateTimePipe } from '@/shared/pipes/date-time/date-time.pipe';

/**
 * Página de consulta de una categoría. Carga la categoría indicada en la ruta y muestra sus datos.
 */
@Component({
  selector: 'app-category-detail',
  imports: [RouterLink, LucideArrowLeft, LucidePencil, Button, Spinner, Chip, DateTimePipe],
  templateUrl: './category-detail-page.html',
  providers: [CategoryStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  protected readonly store = inject(CategoryStore);

  protected readonly category = this.store.selectedItem;

  /**
   * Carga la categoría indicada en la ruta. Si el id no es un entero positivo no se consulta la
   * API y la página muestra el estado de error.
   */
  constructor() {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(categoryId) && categoryId > 0) {
      this.store.findById(categoryId);
    }
  }

  /**
   * Vuelve a la página anterior del historial (p. ej. el listado con sus filtros).
   */
  protected back(): void {
    this.location.back();
  }
}
