import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página principal del dashboard.
 */
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
