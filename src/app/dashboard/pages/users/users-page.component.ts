import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { User } from '@/app/core/models/user.model';
import { UserService } from '@/app/core/services/users.service';
import { ButtonDirective } from '@/app/shared/components/ui/button.directive';

@Component({
  standalone: true,
  templateUrl: './users-page.component.html',
  imports: [CommonModule, ButtonDirective],
})
export class UsersPageComponent implements OnInit {
  users: User[] = [];

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((users) => {
      this.users = users;
    });
  }
}
