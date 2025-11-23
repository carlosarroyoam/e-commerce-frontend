import { Component, input } from '@angular/core';
import { FlexRenderDirective, Table } from '@tanstack/angular-table';

@Component({
  selector: 'app-table',
  imports: [FlexRenderDirective],
  templateUrl: './table.html',
})
export class TableComponent<T> {
  public table = input.required<Table<T>>();
}
