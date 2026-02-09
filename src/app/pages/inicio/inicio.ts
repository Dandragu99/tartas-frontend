import { Component, inject, signal, OnInit, AfterViewInit } from '@angular/core';
import { ProductoBase } from '../../models/producto-base.model';
import { Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { environment } from '../../../environments/environment';
import  mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit, AfterViewInit {

  productos = signal<ProductoBase[]>([]);
  private map?: mapboxgl.Map;
  imagenActual = signal<Record<number, number>>({});

  private productoService = inject(ProductoService);
  private router = inject(Router);

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
  ngAfterViewInit():void{
    mapboxgl.accessToken = environment.mapboxToken;
    const coordinates: [number, number] = [-3.7038, 40.4168];

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-3.7038, 40.4168],
      zoom: 14
    });
    new mapboxgl.Marker({color: '#c084fc'})
    .setLngLat([-3.7038, 40.4168])
    .addTo(this.map);

  }

  getImagen(tarta: ProductoBase): string {
    const index = this.imagenActual()[tarta.id] ?? 0;
    return [tarta.imgPaso1, tarta.imgPaso2, tarta.imgPaso3][index];
  }

  cambiarImagen(tarta: ProductoBase, direccion: -1 | 1) {
    const estado = { ...this.imagenActual() };
    const total = 3;

    estado[tarta.id] =
      (estado[tarta.id] + direccion + total) % total;

    this.imagenActual.set(estado);
  }

  esActivo(tarta: ProductoBase, index: number): boolean {
    return this.imagenActual()[tarta.id] === index;
  }

  irAConfigurar(id: number) {
    this.router.navigate(['/personalizar', id]);
  }
}
