import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from '@tanstack/angular-table';

import { TableComponent } from './table';

function createEmptyTableMock<T>(): Table<T> {
  return {
    getHeaderGroups: () => [],
    getRowCount: () => 0,
    getRowModel: () => ({
      rows: [],
    }),
    getFlatHeaders: () => [],
  } as unknown as Table<T>;
}

describe('Table', () => {
  let component: TableComponent<void>;
  let fixture: ComponentFixture<TableComponent<void>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<void>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('table', createEmptyTableMock<void>());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state', () => {
    const td: HTMLTableCellElement =
      fixture.nativeElement.querySelector('tbody td');

    expect(td.textContent?.trim()).toBe('No results.');
  });
});
