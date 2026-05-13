import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart.service/CartService';
import { AuthService } from '../../auth/auth-service/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.html',
})
export class NavBar {
  router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  readonly cartCount = this.cartService.totalItems;
  profileMenuOpen = false;
  mobileMenuOpen = false;

  private getPayload(): any {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getPayload()?.rol === 'ROLE_ADMIN';
  }

  isLogged(): boolean {
    return !!localStorage.getItem("token");
  }

  getUserInitial(): string {
    const payload = this.getPayload();
    const name = payload?.nombre ?? payload?.name ?? payload?.sub ?? '?';
    return name.charAt(0).toUpperCase();
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }
}
