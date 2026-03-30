import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingrediente } from '../models/ingrediente.model';

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ingredientes';

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }
  
  getIngredientesPorProducto(productoId: string) {
    return this.http.get<Ingrediente[]>(
      `http://localhost:8080/api/productos-base/${productoId}/ingredientes`
    );
  }
}
