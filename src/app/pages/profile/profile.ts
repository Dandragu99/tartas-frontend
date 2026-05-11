import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth-service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private fb     = inject(FormBuilder);
  private http   = inject(HttpClient);
  private auth   = inject(AuthService);
  private router = inject(Router);

  usuario   = signal<UserProfile | null>(null);
  editando  = signal(false);
  guardando = signal(false);
  cargando  = signal(true);
  error     = signal<string | null>(null);

  form = this.fb.group({
    nombreCompleto: ['', Validators.required],
    telefono:       [''],
  });

  ngOnInit() {
    const id = this.auth.user()?.id;
    if (!id) { this.router.navigate(['/login']); return; }

    this.http.get<UserProfile>(`http://localhost:8080/usuarios/${id}`).subscribe({
      next: (u) => {
        this.usuario.set(u);
        this.form.patchValue({ nombreCompleto: u.nombreCompleto, telefono: u.telefono });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  iniciales(): string {
    return (this.usuario()?.nombreCompleto ?? '?')
      .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  activarEdicion() { this.editando.set(true); this.error.set(null); }

  cancelar() {
    const u = this.usuario();
    this.form.patchValue({ nombreCompleto: u?.nombreCompleto ?? '', telefono: u?.telefono ?? '' });
    this.editando.set(false);
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando.set(true);

    const id = this.usuario()!.id;
    const body = this.form.value;

    this.http.put<UserProfile>(`http://localhost:8080/usuarios/${id}`, body).subscribe({
      next: (updated) => {
        this.usuario.set(updated);
        this.editando.set(false);
        this.guardando.set(false);
      },
      error: () => {
        this.error.set('No se pudo guardar. Inténtalo de nuevo.');
        this.guardando.set(false);
      }
    });
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
