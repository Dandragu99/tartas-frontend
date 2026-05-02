import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './login.html',
})
export class Login {

  username: string = '';
  password: string = '';

  http = inject(HttpClient)
  router = inject(Router)
  private authService = inject(AuthService);

  login() {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          const rol = this.authService.user()?.rol;
          if (rol === 'ROLE_ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/inicio']);
          }
        },
        error: () => alert('Credenciales incorrectas')
      });
  }
}



