import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.html',
})
export class NavBar {

  router = inject(Router)
  isAdmin(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol === 'ROLE_ADMIN';
    } catch {
      return false;
    }
  }

  isLogged(): boolean {
    return !!localStorage.getItem("token");
  }
  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/inicio']);
  }
}
