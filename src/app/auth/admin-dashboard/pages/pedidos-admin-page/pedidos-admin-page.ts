import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';


const ESTADOS = ['PENDIENTE', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO'];

@Component({
  selector: 'app-pedidos-admin-page',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './pedidos-admin-page.html',
})
export class PedidosAdminPage implements OnInit {

  private http = inject(HttpClient);

  pedidos = signal<PedidoAdmin[]>([]);
  cargando = signal(true);
  pedidoAbierto = signal<number | null>(null);

  readonly pasos = [
    { estado: 'PENDIENTE', label: 'Recibido', icono: '📋' },
    { estado: 'EN_PROCESO', label: 'En preparación', icono: '👩‍🍳' },
    { estado: 'ENVIADO', label: 'En camino', icono: '🚚' },
    { estado: 'ENTREGADO', label: 'Entregado', icono: '✅' },
  ];

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando.set(true);
    this.http.get<PedidoAdmin[]>('http://localhost:8080/api/pedidos/all')
      .subscribe({
        next: (data) => { this.pedidos.set(data); this.cargando.set(false); },
        error: () => this.cargando.set(false)
      });
  }

  togglePedido(id: number) {
    this.pedidoAbierto.set(this.pedidoAbierto() === id ? null : id);
  }

  pasoActual(estado: string): number {
    return ESTADOS.indexOf(estado);
  }

  avanzarEstado(pedido: PedidoAdmin) {
    const idx = ESTADOS.indexOf(pedido.estado);
    if (idx >= ESTADOS.length - 1) return;
    this.cambiarEstado(pedido, ESTADOS[idx + 1]);
  }

  retrocederEstado(pedido: PedidoAdmin) {
    const idx = ESTADOS.indexOf(pedido.estado);
    if (idx <= 0) return;
    this.cambiarEstado(pedido, ESTADOS[idx - 1]);
  }

  private cambiarEstado(pedido: PedidoAdmin, nuevoEstado: string) {
    this.http.patch<PedidoAdmin>(
      `http://localhost:8080/api/pedidos/${pedido.idPedido}/estado`,
      { estado: nuevoEstado }
    ).subscribe({
      next: () => {
        this.pedidos.update(lista =>
          lista.map(p => p.idPedido === pedido.idPedido
            ? { ...p, estado: nuevoEstado }
            : p
          )
        );
      },
      error: err => console.error('Error al actualizar estado', err)
    });
  }

  badgeClase(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'badge-warning',
      EN_PROCESO: 'badge-info',
      ENVIADO: 'badge-primary',
      ENTREGADO: 'badge-success',
    };
    return map[estado] ?? 'badge-ghost';
  }

  badgeLabel(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      EN_PROCESO: 'En preparación',
      ENVIADO: 'En camino',
      ENTREGADO: 'Entregado',
    };
    return map[estado] ?? estado;
  }

  colorPaso(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'step-warning',
      EN_PROCESO: 'step-info',
      ENVIADO: 'step-primary',
      ENTREGADO: 'step-success',
    };
    return map[estado] ?? 'step-success';
  }
}
