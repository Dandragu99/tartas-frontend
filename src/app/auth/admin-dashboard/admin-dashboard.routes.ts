import { Routes } from '@angular/router';
import { AdminDashboardLayout } from './pages/admin-dashboard-layout/admin-dashboard-layout';
import { ProductAdminPage } from './pages/product-admin-page/product-admin-page';
import { ProductsAdminPage } from './pages/products-admin-page/products-admin-page';
import { adminGuard } from '../guards/admin.guard';
import { PedidosAdminPage } from './pages/pedidos-admin-page/pedidos-admin-page';


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
      { path: 'pedidos',
        component: PedidosAdminPage,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ]
  }
]

export default adminDashboardRoutes;
