import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FlexRender, Table, type RowData } from '@tanstack/angular-table';

import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';

type TableContentState = 'loading' | 'loaded' | 'empty';

/**
 * Tabla genérica basada en TanStack Table, renderiza estados de carga, datos y vacío.
 */
@Component({
  selector: 'app-table',
  imports: [FlexRender],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends RowData> {
  public readonly table = input.required<Table<AppTableFeatures, T>>();
  public readonly isLoading = input(false);

  protected readonly contentState = computed<TableContentState>(() =>
    this.isLoading() ? 'loading' : this.table().getRowCount() > 0 ? 'loaded' : 'empty',
  );
}
