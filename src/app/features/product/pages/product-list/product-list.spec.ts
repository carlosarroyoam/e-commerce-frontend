import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListPage } from './product-list';

describe('ProductListPage', () => {
  let component: ProductListPage;
  let fixture: ComponentFixture<ProductListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
