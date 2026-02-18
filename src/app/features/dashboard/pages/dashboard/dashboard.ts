import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
