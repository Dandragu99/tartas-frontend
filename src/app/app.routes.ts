import { Routes } from '@angular/router';
import { ConfiguradorComponent } from './pages/catalogo.component/configurador/configurador.component/configurador.component';
import { CatalogoComponent } from './pages/catalogo.component/catalogo.component';
import { Inicio } from './pages/inicio/inicio';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

export const routes: Routes = [
  {
    path: 'catalogo',
    component: CatalogoComponent },
  {
    path: 'personalizar/:id',
    component: ConfiguradorComponent
  },
  {
    path: 'inicio',
    component: Inicio
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: '**',
    redirectTo: ''
  }
];
