import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet,RouterLink,
    RouterLinkActive,
    CommonModule],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout { }
