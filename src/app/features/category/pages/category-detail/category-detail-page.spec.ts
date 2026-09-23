import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';
import { CategoryService } from '@/features/category/data-access/services/category-service';
import { CategoryDetailPage } from './category-detail-page';

describe('CategoryDetailPage', () => {
  let fixture: ComponentFixture<CategoryDetailPage>;
  let routeId: string;

  const category: CategoryResponse = {
    id: 1,
    title: 'Smartphones',
    slug: 'smartphones',
    deleted_at: null,
  };

  const categoryServiceMock = {
    findById: vi.fn<(categoryId: number) => Observable<CategoryResponse>>(() => of(category)),
  };

  const render = (): string => {
    fixture = TestBed.createComponent(CategoryDetailPage);
    fixture.detectChanges();

    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    routeId = '1';

    await TestBed.configureTestingModule({
      imports: [CategoryDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: { paramMap: convertToParamMap({ id: routeId }) } }),
        },
        { provide: CategoryService, useValue: categoryServiceMock },
      ],
    }).compileComponents();
  });

  it('should load and render the category from the route id', () => {
    const text = render();

    expect(categoryServiceMock.findById).toHaveBeenCalledWith(1);
    expect(text).toContain('Category details');
    expect(text).toContain('Smartphones');
    expect(text).toContain('smartphones');
    expect(text).toContain('Active');
  });

  it('should render a deleted category with its deleted at date', () => {
    categoryServiceMock.findById.mockReturnValueOnce(
      of({ ...category, deleted_at: '2026-01-05T10:00:00Z' }),
    );

    const text = render();

    expect(text).toContain('Deleted');
    expect(text).toContain('Deleted at');
  });

  it('should render an error message and hide the edit link when the category cannot be loaded', () => {
    categoryServiceMock.findById.mockReturnValueOnce(throwError(() => new Error('Not found')));

    const text = render();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Could not load the category.');
    expect(text).toContain('Back');
    expect(text).not.toContain('Edit');
  });

  it('should not request the category when the route id is invalid', () => {
    routeId = 'abc';

    const text = render();

    expect(categoryServiceMock.findById).not.toHaveBeenCalled();
    expect(text).toContain('Could not load the category.');
  });

  it('should go back in the history when clicking back', () => {
    const back = vi.spyOn(TestBed.inject(Location), 'back').mockImplementation(() => undefined);

    render();
    const backButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.trim() === 'Back');
    backButton?.click();

    expect(back).toHaveBeenCalled();
  });
});
