import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucidePencil } from '@lucide/angular';

import { VariantResponse } from '@/features/product/data-access/interfaces/product-detail-response';
import { ProductStore } from '@/features/product/data-access/stores/product.store';
import { Button } from '@/shared/components/ui/button/button';
import { Chip } from '@/shared/components/ui/chip/chip';
import { Spinner } from '@/shared/components/ui/spinner/spinner';
import { AppCurrencyPipe } from '@/shared/pipes/currency/currency.pipe';
import { DateTimePipe } from '@/shared/pipes/date-time/date-time.pipe';

/**
 * Página de consulta de un producto. Carga el producto indicado en la ruta y muestra sus datos.
 */
@Component({
  selector: 'app-product-detail',
  imports: [
    RouterLink,
    LucideArrowLeft,
    LucidePencil,
    Button,
    Spinner,
    Chip,
    DateTimePipe,
    AppCurrencyPipe,
  ],
  templateUrl: './product-detail-page.html',
  providers: [ProductStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  protected readonly store = inject(ProductStore);

  protected readonly product = this.store.selectedItem;

  /**
   * Carga el producto indicado en la ruta. Si el id no es un entero positivo no se consulta la
   * API y la página muestra el estado de error.
   */
  constructor() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(productId) && productId > 0) {
      this.store.findById(productId);
    }
  }

  /**
   * Concatena los atributos de una variante en una cadena legible (p. ej. "Color: Black, Size: M").
   *
   * @param variant Variante cuyos atributos se van a describir.
   * @returns Cadena con los atributos de la variante separados por coma.
   */
  protected variantAttributesLabel(variant: VariantResponse): string {
    return variant.attributes.map((value) => `${value.attribute.title}: ${value.value}`).join(', ');
  }

  /**
   * Vuelve a la página anterior del historial (p. ej. el listado con sus filtros).
   */
  protected back(): void {
    this.location.back();
  }
}
