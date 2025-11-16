import { Component, input } from '@angular/core';
import { FlexRenderDirective, Table } from '@tanstack/angular-table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [FlexRenderDirective],
})
export class TableComponent<T> {
  public table = input.required<Table<T>>();
}
