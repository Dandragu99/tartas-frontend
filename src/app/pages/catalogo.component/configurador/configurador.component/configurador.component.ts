import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para ngModel
import { ProductoBase } from '../../../../models/producto-base.model';
import { ProductoService } from '../../../../services/producto.service';
import { IngredienteService } from '../../../../services/ingrediente.service';
import { Ingrediente } from '../../../../models/ingrediente.model';

@Component({
  selector: 'app-configurador',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadimos FormsModule para ngModel
  templateUrl: './configurador.component.html',
})
export class ConfiguradorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private ingredienteService = inject(IngredienteService);

  tarta = signal<ProductoBase | null>(null);
  ingredientes = signal<Ingrediente[]>([]);

  bizcochoSeleccionado = signal<Ingrediente | null>(null);
  rellenoSeleccionado = signal<Ingrediente | null>(null);
  coberturaSeleccionada = signal<Ingrediente | null>(null);

  tamanoSeleccionado = signal<number>(6);
  pisosSeleccionados = signal<number>(1);

  extrasSeleccionados = signal<number[]>([]);

  mensajeTarta = signal<string>('');
  ingredientesExtra = signal<string>('');
  alergias = signal<string>('');
  comentarios = signal<string>('');

  bizcochos = computed(() => this.ingredientes().filter(i => i.tipo === 'BIZCOCHO'));
  rellenos = computed(() => this.ingredientes().filter(i => i.tipo === 'RELLENO'));
  coberturas = computed(() => this.ingredientes().filter(i => i.tipo === 'COBERTURA'));
  extras = computed(() => this.ingredientes().filter(i => i.tipo === 'EXTRA'));

  tamanos = signal([
    { personas: 6, precioAdicional: 0 },
    { personas: 10, precioAdicional: 10 },
    { personas: 15, precioAdicional: 20 },
    { personas: 20, precioAdicional: 35 }
  ]);

  precioBase = computed(() => this.tarta()?.precioBase ?? 0);

  precioIngredientes = computed(() => {
    const pBizcocho = this.bizcochoSeleccionado()?.precioAdicional ?? 0;
    const pRelleno = this.rellenoSeleccionado()?.precioAdicional ?? 0;
    const pCobertura = this.coberturaSeleccionada()?.precioAdicional ?? 0;
    return pBizcocho + pRelleno + pCobertura;
  });

  precioTamano = computed(() => {
    const tamano = this.tamanos().find(t => t.personas === this.tamanoSeleccionado());
    return tamano?.precioAdicional ?? 0;
  });

  precioPisos = computed(() => {
    return (this.pisosSeleccionados() - 1) * 15;
  });

  precioExtras = computed(() => {
    return this.extrasSeleccionados().reduce((total, extraId) => {
      const extra = this.ingredientes().find(i => i.id === extraId);
      return total + (extra?.precioAdicional ?? 0);
    }, 0);
  });

  precioFinal = computed(() => {
    return this.precioBase()
      + this.precioIngredientes()
      + this.precioTamano()
      + this.precioPisos()
      + this.precioExtras();
  });

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

  onSeleccionarBizcocho(id: number) {
    const ing = this.ingredientes().find(i => i.id === id);
    this.bizcochoSeleccionado.set(ing || null);
  }

  onSeleccionarRelleno(id: number) {
    const ing = this.ingredientes().find(i => i.id === id);
    this.rellenoSeleccionado.set(ing || null);
  }

  onSeleccionarCobertura(id: number) {
    const ing = this.ingredientes().find(i => i.id === id);
    this.coberturaSeleccionada.set(ing || null);
  }

  onSeleccionarTamano(personas: number) {
    this.tamanoSeleccionado.set(personas);
  }

  onSeleccionarPisos(pisos: number) {
    this.pisosSeleccionados.set(pisos);
  }

  onToggleExtra(extraId: number) {
    const actuales = this.extrasSeleccionados();
    if (actuales.includes(extraId)) {
      this.extrasSeleccionados.set(actuales.filter(id => id !== extraId));
    } else {
      this.extrasSeleccionados.set([...actuales, extraId]);
    }
  }

  obtenerPrecioTamano(): number {
    const tamano = this.tamanos().find(t => t.personas === this.tamanoSeleccionado());
    return tamano?.precioAdicional ?? 0;
  }

  obtenerNombreExtra(extraId: number): string {
    const extra = this.ingredientes().find(i => i.id === extraId);
    return extra?.nombre ?? '';
  }

  obtenerPrecioExtra(extraId: number): number {
    const extra = this.ingredientes().find(i => i.id === extraId);
    return extra?.precioAdicional ?? 0;
  }

  esConfiguracionValida(): boolean {
    return this.bizcochoSeleccionado() !== null
      && this.rellenoSeleccionado() !== null
      && this.coberturaSeleccionada() !== null;
  }

  actualizarPrecio() {}

  realizarPedido() {
    if (!this.esConfiguracionValida()) {
      alert('Por favor, completa la configuración básica de tu tarta');
      return;
    }

    const pedido = {
      tarta: this.tarta(),
      bizcocho: this.bizcochoSeleccionado(),
      relleno: this.rellenoSeleccionado(),
      cobertura: this.coberturaSeleccionada(),
      tamano: this.tamanoSeleccionado(),
      pisos: this.pisosSeleccionados(),
      extras: this.extrasSeleccionados().map(id =>
        this.ingredientes().find(i => i.id === id)
      ),
      mensaje: this.mensajeTarta(),
      ingredientesExtra: this.ingredientesExtra(),
      alergias: this.alergias(),
      comentarios: this.comentarios(),
      precioTotal: this.precioFinal()
    };

    console.log('Pedido realizado:', pedido);

    //  TODO
    // 1. Guardar en el carrito
    // 2. Enviar al back
    // 3. Redirigir al checkout

    alert(`¡Tarta añadida al carrito! Total: ${this.precioFinal().toFixed(2)}€`);

    // Opcional: redirigir
    // this.router.navigate(['/carrito']);
  }
}
