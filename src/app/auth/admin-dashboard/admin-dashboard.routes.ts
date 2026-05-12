import { Routes } from '@angular/router';
import { AdminDashboardLayout } from './pages/admin-dashboard-layout/admin-dashboard-layout';
import { ProductAdminPage } from './pages/product-admin-page/product-admin-page';
import { ProductsAdminPage } from './pages/products-admin-page/products-admin-page';
import { adminGuard } from '../guards/admin.guard';


export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayout,
    canMatch: [
      adminGuard
    ],
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        component: ProductsAdminPage,
      },
      {
        path: 'products/:id',
        component: ProductAdminPage,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ]
  }
]

export default adminDashboardRoutes;
