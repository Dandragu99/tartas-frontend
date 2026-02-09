import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para pipes y directivas en Standalone
import { ProductoBase } from '../../../../models/producto-base.model';
import { ProductoService } from '../../../../services/producto.service';
import { IngredienteService } from '../../../../services/ingrediente.service';
import { Ingrediente } from '../../../../models/ingrediente.model'; // <--- ESTE ES EL IMPORT QUE FALTABA

@Component({
  selector: 'app-configurador',
  standalone: true,
  imports: [CommonModule], // Añadimos CommonModule para usar @if, @for o pipes en el HTML
  templateUrl: './configurador.component.html',
})
export class ConfiguradorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private ingredienteService = inject(IngredienteService);

  // Signals de datos maestros (lo que viene del servidor)
  tarta = signal<ProductoBase | null>(null);
  ingredientes = signal<Ingrediente[]>([]);

  // Signals de selección (lo que elige el usuario)
  bizcochoSeleccionado = signal<Ingrediente | null>(null);
  rellenoSeleccionado = signal<Ingrediente | null>(null);
  coberturaSeleccionada = signal<Ingrediente | null>(null);

  // Lógica de Precios con Computed (se actualizan solos)
  precioBase = computed(() => this.tarta()?.precioBase ?? 0);

  extrasTotal = computed(() => {
    const pBizcocho = this.bizcochoSeleccionado()?.precioAdicional ?? 0;
    const pRelleno = this.rellenoSeleccionado()?.precioAdicional ?? 0;
    const pCobertura = this.coberturaSeleccionada()?.precioAdicional ?? 0;
    return pBizcocho + pRelleno + pCobertura;
  });

  precioFinal = computed(() => this.precioBase() + this.extrasTotal());

  // Filtros de ingredientes por tipo
  bizcochos = computed(() => this.ingredientes().filter(i => i.tipo === 'BIZCOCHO'));
  rellenos = computed(() => this.ingredientes().filter(i => i.tipo === 'RELLENO'));
  extrasLista = computed(() => this.ingredientes().filter(i => i.tipo === 'EXTRA'));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.productoService.getProductoById(id).subscribe({
        next: (data) => this.tarta.set(data),
        error: (err) => console.error('Error cargando tarta', err)
      });
    }

    this.ingredienteService.getIngredientes().subscribe({
      next: (data) => this.ingredientes.set(data),
      error: (err) => console.error('Error cargando ingredientes', err)
    });
  }

  // Funciones para manejar los cambios en los selectores del HTML
  onSeleccionarBizcocho(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    const ing = this.ingredientes().find(i => i.id === id);
    this.bizcochoSeleccionado.set(ing || null);
  }

  onSeleccionarRelleno(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    const ing = this.ingredientes().find(i => i.id === id);
    this.rellenoSeleccionado.set(ing || null);
  }
}
