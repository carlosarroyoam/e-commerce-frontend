import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';

import { ProductFormPage } from './product-form-page';

describe('ProductFormPage', () => {
  const render = async (params: Params): Promise<HTMLElement> => {
    await TestBed.configureTestingModule({
      imports: [ProductFormPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(params) } },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductFormPage);
    fixture.detectChanges();

    return fixture.nativeElement as HTMLElement;
  };

  it('should render the create heading when the route has no id', async () => {
    expect((await render({})).textContent).toContain('New product');
  });

  it('should render the edit heading when the route has an id', async () => {
    expect((await render({ id: '1' })).textContent).toContain('Edit product');
  });
});
