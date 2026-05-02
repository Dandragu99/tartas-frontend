import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ItemCarritoDTO {
  productoBaseId: number;
  ingredientesIds: number[];
  cantidad: number;
  precioUnitario: number;
  mensaje?: string;
  alergias?: string;
}

export interface CrearPedidoCarritoDTO {
  usuarioId: number;
  items: ItemCarritoDTO[];
  precioTotal: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/pedidos';

  crearDesdeCarrito(dto: CrearPedidoCarritoDTO): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any[]>(`${this.API}/carrito`, dto, { headers });
  }
}
