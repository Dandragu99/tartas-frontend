import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoBase } from '../models/producto-base.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/productos-base`;

  getProductosBase(): Observable<ProductoBase[]> {
    return this.http.get<ProductoBase[]>(this.apiUrl);
  }

  getProductoById(id: string | number): Observable<ProductoBase> {
    return this.http.get<ProductoBase>(`${this.apiUrl}/${id}`);
  }

  createProducto(producto: ProductoBase): Observable<ProductoBase> {
    return this.http.post<ProductoBase>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: ProductoBase) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
