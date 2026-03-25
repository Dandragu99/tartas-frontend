import { Routes } from '@angular/router';
import { PublicLayout } from './auth/admin-dashboard/pages/public-layout/public-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: 'catalogo',        loadComponent: () => import('./pages/catalogo.component/catalogo.component').then(m => m.CatalogoComponent) },
      { path: 'personalizar/:id',loadComponent: () => import('./pages/catalogo.component/configurador/configurador.component/configurador.component').then(m => m.ConfiguradorComponent) },
      { path: 'inicio',          loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
      { path: 'login',           loadComponent: () => import('./auth/login/login').then(m => m.Login) },
      { path: 'register',        loadComponent: () => import('./auth/register/register').then(m => m.Register) },
    ]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./auth/admin-dashboard/admin-dashboard.routes').then(m => m.default)
  },
  { path: '**', redirectTo: 'inicio' }
];
