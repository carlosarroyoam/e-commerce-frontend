import { Component, OnInit } from '@angular/core';

import { User } from '@/app/core/models/user.model';
import { UserService } from '@/app/core/services/users.service';

@Component({
  standalone: true,
  templateUrl: './users-page.component.html',
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
