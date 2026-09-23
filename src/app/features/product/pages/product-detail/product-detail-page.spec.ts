import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ProductDetailResponse } from '@/features/product/data-access/interfaces/product-detail-response';
import { ProductService } from '@/features/product/data-access/services/product-service';
import { ProductDetailPage } from './product-detail-page';

describe('ProductDetailPage', () => {
  let fixture: ComponentFixture<ProductDetailPage>;
  let routeId: string;

  const product: ProductDetailResponse = {
    id: 1,
    title: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'iPhone 15 Pro Max 256GB',
    is_featured: true,
    is_active: true,
    category: { id: 1, title: 'Phones' },
    properties: [{ id: 1, value: 'Apple', property: { id: 1, title: 'Brand' } }],
    variants: [
      {
        id: 1,
        sku: 'iphone15problack',
        price: 27999,
        compared_at_price: 29999,
        attributes: [
          { id: 1, value: 'Black', attribute: { id: 1, title: 'Color', deleted_at: null } },
        ],
        images: [],
      },
    ],
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z',
    deleted_at: null,
  };

  const productServiceMock = {
    findById: vi.fn<(productId: number) => Observable<ProductDetailResponse>>(() => of(product)),
  };

  const render = (): string => {
    fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();

    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    routeId = '1';

    await TestBed.configureTestingModule({
      imports: [ProductDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: { paramMap: convertToParamMap({ id: routeId }) } }),
        },
        { provide: ProductService, useValue: productServiceMock },
      ],
    }).compileComponents();
  });

  it('should load and render the product from the route id', () => {
    const text = render();

    expect(productServiceMock.findById).toHaveBeenCalledWith(1);
    expect(text).toContain('Product details');
    expect(text).toContain('iPhone 15 Pro');
    expect(text).toContain('iphone-15-pro');
    expect(text).toContain('Phones');
    expect(text).toContain('iPhone 15 Pro Max 256GB');
  });

  it('should render the active/inactive and featured/not featured chips', () => {
    const text = render();

    expect(text).toContain('Active');
    expect(text).toContain('Featured');
  });

  it('should render the product properties', () => {
    const text = render();

    expect(text).toContain('Brand');
    expect(text).toContain('Apple');
  });

  it('should render the variants table with attributes', () => {
    const text = render();

    expect(text).toContain('iphone15problack');
    expect(text).toContain('Color: Black');
    expect(text).toContain('$27,999.00');
  });

  it('should render empty states when there are no properties or variants', () => {
    productServiceMock.findById.mockReturnValueOnce(
      of({ ...product, properties: [], variants: [] }),
    );

    const text = render();

    expect(text).toContain('No properties registered.');
    expect(text).toContain('No variants registered.');
  });

  it('should render an error message and hide the edit link when the product cannot be loaded', () => {
    productServiceMock.findById.mockReturnValueOnce(throwError(() => new Error('Not found')));

    const text = render();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Could not load the product.');
    expect(text).toContain('Back');
    expect(text).not.toContain('Edit');
  });

  it('should not request the product when the route id is invalid', () => {
    routeId = 'abc';

    const text = render();

    expect(productServiceMock.findById).not.toHaveBeenCalled();
    expect(text).toContain('Could not load the product.');
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
