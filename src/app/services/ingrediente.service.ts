import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingrediente } from '../models/ingrediente.model';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/ingredientes`;

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }

  getIngredientesPorProducto(productoId: string) {
    return this.http.get<Ingrediente[]>(
      `${environment.apiUrl}/api/productos-base/${productoId}/ingredientes`
    );
  }
}
