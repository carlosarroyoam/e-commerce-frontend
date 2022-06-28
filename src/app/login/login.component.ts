import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = 'carlos.arroyo@e-commerce.com';
  password: string = 'secret123';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(
            'user',
            JSON.stringify({
              user_id: response.data.user_id,
              user_role: response.data.user_role,
              user_role_id: response.data.user_role_id,
            })
          );

          this.router.navigate(['users']);
        },
        error: () => {
          alert('failed');
        },
      });
  }
}
