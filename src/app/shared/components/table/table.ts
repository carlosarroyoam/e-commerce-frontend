import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FlexRenderDirective, Table } from '@tanstack/angular-table';

type TableContentState = 'loading' | 'loaded' | 'empty';

/**
 * Tabla genérica basada en TanStack Table, renderiza estados de carga, datos y vacío.
 */
@Component({
  selector: 'app-table',
  imports: [FlexRenderDirective],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  public readonly table = input.required<Table<T>>();
  public readonly isLoading = input(false);

  protected readonly contentState = computed<TableContentState>(() =>
    this.isLoading() ? 'loading' : this.table().getRowCount() > 0 ? 'loaded' : 'empty',
  );
}
