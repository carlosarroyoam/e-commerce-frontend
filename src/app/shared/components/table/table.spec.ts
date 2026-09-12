import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table, type RowData } from '@tanstack/angular-table';

import { TableComponent } from './table';
import { AppTableFeatures } from '@/shared/tanstack/table-features';

function createEmptyTableMock<T extends RowData>(): Table<AppTableFeatures, T> {
  return {
    getHeaderGroups: () => [],
    getRowCount: () => 0,
    getRowModel: () => ({
      rows: [],
    }),
    getFlatHeaders: () => [],
  } as unknown as Table<AppTableFeatures, T>;
}

interface MockRow {}

describe('Table', () => {
  let component: TableComponent<MockRow>;
  let fixture: ComponentFixture<TableComponent<MockRow>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<MockRow>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('table', createEmptyTableMock<MockRow>());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state', () => {
    const td: HTMLTableCellElement = fixture.nativeElement.querySelector('tbody td');

    expect(td.textContent?.trim()).toBe('No results.');
  });

  it('should render loading state', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const table: HTMLTableElement = fixture.nativeElement.querySelector('table');

    expect(table.getAttribute('aria-busy')).toBe('true');
  });
});
