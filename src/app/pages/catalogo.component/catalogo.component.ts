import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { ProductoBase } from '../../models/producto-base.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
})
export class CatalogoComponent  {
  imagenActual = signal<Record<number, number>>({});
  productos = signal<ProductoBase[]>([]);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  ngOnInit(): void {
    this.productoService.getProductosBase().subscribe({
      next: (data) => {
        this.productos.set(data);


        const estado: Record<number, number> = {};
        data.forEach(p => estado[p.id] = 1);
        this.imagenActual.set(estado);

        data.forEach((p, index) => {
          if (index < 2) {
            setTimeout(() => {
              this.imagenActual.update(actual => ({
                ...actual,
                [p.id]: 2
              }));
            }, 3000);
          }
        });
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  }


  cambiarImagen(tarta: ProductoBase, direccion: -1 | 1) {
    const estado = { ...this.imagenActual() };
    const total = 3;

    estado[tarta.id] =
      (estado[tarta.id] + direccion + total) % total;

    this.imagenActual.set(estado);
  }
  getImagen(tarta: ProductoBase): string {
    const index = this.imagenActual()[tarta.id] ?? 0;
    return [tarta.imgPaso1, tarta.imgPaso2, tarta.imgPaso3][index];
  }

  irAConfigurar(id: number) {
    this.router.navigate(['/personalizar', id]);
  }

}
