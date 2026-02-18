import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {}
