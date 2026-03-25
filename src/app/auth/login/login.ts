import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
})
export class Login {

  username: string = '';
  password: string = '';

  http = inject(HttpClient)
  router = inject(Router)

  login() {

    const datos = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/auth/login', datos)
      .subscribe({
        next: (response) => {
          localStorage.setItem("token", response.token);
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          console.log(payload);

          if (payload.rol === 'ROLE_ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          alert("Credenciales incorrectas");
        }
      });
  }

}

