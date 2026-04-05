import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoBase } from '../../../../models/producto-base.model';
import { ProductoService } from '../../../../services/producto.service';
import { IngredienteService } from '../../../../services/ingrediente.service';
import { Ingrediente } from '../../../../models/ingrediente.model';
import { CartService } from '../../../cart/cart.service/CartService';

@Component({
  selector: 'app-configurador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurador.component.html',
})
export class ConfiguradorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private ingredienteService = inject(IngredienteService);
  private cartService = inject(CartService);

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

  bizcochos = computed(() => this.ingredientes().filter(i => i.tipo === 'BIZCOCHO' && i.disponible));
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

      this.ingredienteService.getIngredientesPorProducto(id).subscribe({
        next: (data) => this.ingredientes.set(data),
        error: (err) => console.error('Error cargando ingredientes', err)
      });
    }
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

  actualizarPrecio() { }

  realizarPedido() {
    if (!this.esConfiguracionValida()) {
      alert('Por favor, completa la configuración básica de tu tarta');
      return;
    }

    this.cartService.addItem({
      nombre: this.tarta()?.nombre ?? 'Tarta personalizada',
      imagen: this.imagenActual(),
      bizcocho: this.bizcochoSeleccionado()?.nombre,
      relleno: this.rellenoSeleccionado()?.nombre,
      cobertura: this.coberturaSeleccionada()?.nombre,
      tamano: this.tamanoSeleccionado(),
      pisos: this.pisosSeleccionados(),
      extras: this.extrasSeleccionados().map(id => this.obtenerNombreExtra(id)),
      mensaje: this.mensajeTarta() || undefined,
      alergias: this.alergias() || undefined,
      comentarios: this.comentarios() || undefined,
      precioUnitario: this.precioFinal(),
    });

    this.router.navigate(['/cart']);
  }


  private readonly imagenPorSabor: Record<string, { img1: string, img2: string, img3: string }> = {
    'chocolate': {
      img1: 'assets/img/chocolate-1.png',
      img2: 'assets/img/chocolate-2.jpeg',
      img3: 'assets/img/chocolate-3.png',
    },
    'velvet': {
      img1: 'assets/img/red-velvet-1.png',
      img2: 'assets/img/red-velvet-2.png',
      img3: 'assets/img/red-velvet-3.png',
    },
    'cheescake': {
      img1: 'assets/img/cheescake-1.png',
      img2: 'assets/img/cheescake-2.png',
      img3: 'assets/img/cheescake-3.png',
    },
    'limon': {
      img1: 'assets/img/tarta-limon-1.png',
      img2: 'assets/img/tarta-limon-2.png',
      img3: 'assets/img/tarta-limon-3.png',
    },
    'limón': {
      img1: 'assets/img/tarta-limon-1.png',
      img2: 'assets/img/tarta-limon-2.png',
      img3: 'assets/img/tarta-limon-3.png',
    },
    'vainilla': {
      img1: 'assets/img/vainilla-1.jpg',
      img2: 'assets/img/vainilla-2.jpg',
      img3: 'assets/img/vainilla-3.jpg',
    },
  };

  imagenActual = computed(() => {
    const tarta = this.tarta();
    if (!tarta) return '';

    const pisos = this.pisosSeleccionados();
    const bizcocho = this.bizcochoSeleccionado()?.nombre?.toLowerCase() ?? '';
    const cobertura = this.coberturaSeleccionada()?.nombre?.toLowerCase() ?? '';

    const sabor = cobertura || bizcocho;

    const clave = Object.keys(this.imagenPorSabor).find(k => sabor.includes(k));

    if (!clave) return tarta.imgPaso1;

    const imagenes = this.imagenPorSabor[clave];

    if (pisos === 3) return imagenes.img3;
    if (this.coberturaSeleccionada()) return imagenes.img2;
    return imagenes.img1;
  });

  iconoRelleno(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('chocolate')) return '🍫';
    if (n.includes('fresa')) return '🍓';
    if (n.includes('vainilla')) return '🍦';
    if (n.includes('limón') || n.includes('limon')) return '🍋';
    return '🎂';
  }

  iconoCobertura(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('chocolate')) return '🍫';
    if (n.includes('velvet')) return '🎂';
    if (n.includes('cheescake') || n.includes('queso')) return '🧀';
    if (n.includes('limón') || n.includes('limon')) return '🍋';
    return '✨';
  }

  iconoExtra(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('fresa') || n.includes('frutos')) return '🍓';
    if (n.includes('limón') || n.includes('limon')) return '🍋';
    if (n.includes('chocolate')) return '🍫';
    if (n.includes('nata')) return '🍦';
    return '⭐';
  }
}
