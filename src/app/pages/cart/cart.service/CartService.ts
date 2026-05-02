import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../cart.interface/CartItem';

@Injectable({ providedIn: 'root' })
export class CartService {

  private _userId: number | null = null;

  private get storageKey(): string {
    return this._userId ? `ana_cart_${this._userId}` : 'ana_cart_guest';
  }

  private _items = signal<CartItem[]>([]);

  setUsuario(id: number | null): void {
  this._userId = id;
  this._items.set(this.loadFromStorage());
  }

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
    localStorage.removeItem(this.storageKey);
  }

  recargarCarrito(): void {
    this._items.set(this.loadFromStorage());
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._items()));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
