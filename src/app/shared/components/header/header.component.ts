import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserNavComponent } from '@/app/shared/components/user-nav/user-nav.component';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, UserNavComponent],
})
export class HeaderComponent {}
