import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoBase } from '../models/producto-base.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  http = inject(HttpClient)
  apiUrl = 'http://localhost:8080/api/productos-base';


  getProductosBase(): Observable<ProductoBase[]> {
    return this.http.get<ProductoBase[]>(this.apiUrl);
  }

  getProductoById(id: string | number): Observable<ProductoBase> {
    return this.http.get<ProductoBase>(`${this.apiUrl}/${id}`);
  }



}
