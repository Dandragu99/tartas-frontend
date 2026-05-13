import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/auth-service/auth.service';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mis-pedidos',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './mis-pedidos.html',
})
export class MisPedidos {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  pedidos = signal<PedidoDTO[]>([]);
  cargando = signal(true);
  pedidoAbierto = signal<number | null>(null);

  readonly pasos = [
    { estado: 'PENDIENTE',   label: 'Pedido recibido',  icono: '📋' },
    { estado: 'EN_PROCESO',  label: 'En preparación',   icono: '👩‍🍳' },
    { estado: 'ENVIADO',     label: 'En camino',         icono: '🚚' },
    { estado: 'ENTREGADO',   label: 'Entregado',         icono: '✅' },
  ];

  ngOnInit() {
    const usuarioId = this.auth.getUsuarioId();
    this.http.get<PedidoDTO[]>(`http://localhost:8080/api/pedidos/usuario/${usuarioId}`)
      .subscribe({
        next: (data) => { this.pedidos.set(data); this.cargando.set(false); },
        error: () => this.cargando.set(false)
      });
  }

  pasoActual(estado: string): number {
    return this.pasos.findIndex(p => p.estado === estado);
  }

  colorPaso(estado: string): string {
  const map: Record<string, string> = {
    PENDIENTE:  'step-warning',
    EN_PROCESO: 'step-info',
    ENVIADO:    'step-primary',
    ENTREGADO:  'step-success',
  };
  return map[estado] ?? 'step-success';
}

  togglePedido(id: number) {
    this.pedidoAbierto.set(this.pedidoAbierto() === id ? null : id);
  }

  badgeClase(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE:  'badge-warning',
      EN_PROCESO: 'badge-info',
      ENVIADO:    'badge-primary',
      ENTREGADO:  'badge-success',
    };
    return map[estado] ?? 'badge-ghost';
  }

  badgeLabel(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE:  'Pendiente',
      EN_PROCESO: 'En preparación',
      ENVIADO:    'En camino',
      ENTREGADO:  'Entregado',
    };
    return map[estado] ?? estado;
  }

}
