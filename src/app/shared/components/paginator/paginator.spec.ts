import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table, type RowData } from '@tanstack/angular-table';
import { vi } from 'vitest';

import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Paginator } from './paginator';

type MockRow = object;

function createTableMock<T extends RowData>(
  overrides: Partial<Table<AppTableFeatures, T>> = {},
): Table<AppTableFeatures, T> {
  return {
    atoms: { pagination: { get: () => ({ pageIndex: 1, pageSize: 20 }) } },
    getPageCount: () => 3,
    getRowCount: () => 50,
    getCanPreviousPage: () => true,
    getCanNextPage: () => true,
    firstPage: vi.fn(),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    lastPage: vi.fn(),
    setPageSize: vi.fn(),
    ...overrides,
  } as unknown as Table<AppTableFeatures, T>;
}

describe('Paginator', () => {
  let component: Paginator<MockRow>;
  let fixture: ComponentFixture<Paginator<MockRow>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paginator],
    }).compileComponents();

    fixture = TestBed.createComponent(Paginator<MockRow>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('table', createTableMock<MockRow>());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
