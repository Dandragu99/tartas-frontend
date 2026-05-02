import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CartService } from '../cart.service/CartService';
import { DecimalPipe } from '@angular/common';
import { CrearPedidoCarritoDTO, PedidoService } from '../../../services/pedido.service';
import { AuthService } from '../../../auth/auth-service/auth.service';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe],
  templateUrl: './cart.html',
})
export class Cart {

  private cartService = inject(CartService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly freeShippingThreshold = 60;
  readonly baseShipping = 5.90;

  readonly cartItems = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;

  readonly shippingCost = computed(() =>
    this.subtotal() >= this.freeShippingThreshold ? 0 : this.baseShipping
  );

  readonly total = computed(() =>
    this.subtotal() + this.shippingCost()
  );

  removeItem(cartId: string): void {
    this.cartService.removeItem(cartId);
  }

  increaseQty(cartId: string): void {
    const item = this.cartItems().find(i => i.cartId === cartId);
    if (item) this.cartService.updateQuantity(cartId, item.cantidad + 1);
  }

  decreaseQty(cartId: string): void {
    const item = this.cartItems().find(i => i.cartId === cartId);
    if (item && item.cantidad > 1) {
      this.cartService.updateQuantity(cartId, item.cantidad - 1);
    } else if (item?.cantidad === 1) {
      this.removeItem(cartId);
    }
  }

  clearCart(): void {
    this.cartService.clear();
  }

  goToCatalog(): void {
    this.router.navigate(['/catalogo']);
  }

  checkout(): void {
    // TODO: navegar a la página de checkout / formulario de pedido / IMPLEMENTAR STRIPE
    const user = this.authService.user();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const dto: CrearPedidoCarritoDTO = {
      usuarioId: user.id,
      precioTotal: this.total(),
      items: this.cartItems().map(item => ({
        productoBaseId: item.productoBaseId,
        ingredientesIds: item.ingredientesIds,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        mensaje: item.mensaje,
        alergias: item.alergias
      })),
    };

    this.pedidoService.crearDesdeCarrito(dto).subscribe({
      next: () => {
        this.cartService.clear();
        this.router.navigate(['/pedido-confirmado']);
      },
      error: err => console.error('Error al crear pedido', err),
    });

  }

}
