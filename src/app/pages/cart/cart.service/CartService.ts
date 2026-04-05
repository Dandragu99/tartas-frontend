import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../cart.interface/CartItem';

@Injectable({ providedIn: 'root' })
export class CartService {

  private _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, i) => sum + i.cantidad, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.precioUnitario * i.cantidad, 0)
  );

  addItem(item: Omit<CartItem, 'cartId' | 'cantidad'>): void {
    const newItem: CartItem = {
      ...item,
      cartId: crypto.randomUUID(),
      cantidad: 1,
    };
    this._items.update(items => [...items, newItem]);
    this.saveToStorage();
  }

  removeItem(cartId: string): void {
    this._items.update(items => items.filter(i => i.cartId !== cartId));
    this.saveToStorage();
  }

  updateQuantity(cartId: string, cantidad: number): void {
    if (cantidad < 1) return;
    this._items.update(items =>
      items.map(i => i.cartId === cartId ? { ...i, cantidad } : i)
    );
    this.saveToStorage();
  }

  clear(): void {
    this._items.set([]);
    localStorage.removeItem('ana_cart');
  }

  private saveToStorage(): void {
    localStorage.setItem('ana_cart', JSON.stringify(this._items()));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem('ana_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
