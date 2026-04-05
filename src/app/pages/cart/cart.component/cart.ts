import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service/CartService';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe],
  templateUrl: './cart.html',
})
export class Cart {

  private cartService = inject(CartService);
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
    this.router.navigate(['/catalog']);  // ajustar la ruta
  }

  checkout(): void {
    // TODO: navegar a la página de checkout / formulario de pedido / IMPLEMENTAR STRIPE
    this.router.navigate(['/checkout']);
  }

}
