import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth-service/auth.service';
import { User } from '../auth.model/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
})
export class Register {
  nombreCompleto = '';
  email = '';
  telefono = '';
  username = '';
  password = '';
  confirmPassword = '';
  aceptaTerminos = false;
  newsletter = false;

  private router = inject(Router);
  private authService = inject(AuthService);

registrar() {
  console.log('aceptaTerminos:', this.aceptaTerminos);
  console.log('password:', this.password);
  console.log('confirmPassword:', this.confirmPassword);
  if (this.password !== this.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (!this.aceptaTerminos) {
    alert('Debes aceptar los términos y condiciones');
    return;
  }

  const body: User = {
    username: this.username,
    nombreCompleto: this.nombreCompleto,
    email: this.email,
    telefono: this.telefono,
    password: this.password
  };

  console.log('Enviando al backend:', body);

  this.authService.register(body).subscribe({
    next: (response) => {
      console.log('Usuario registrado', response);
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Error al registrar', err);
      alert('No se pudo registrar el usuario');
    }
  });
}
}
