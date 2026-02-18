import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-order-list',
  imports: [],
  templateUrl: './order-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListPage {}
