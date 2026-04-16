import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from '../../../auth-service/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet,RouterLink,
    RouterLinkActive,
    CommonModule],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout {

  private authService = inject(AuthService);
  user = this.authService.user; 
 }
