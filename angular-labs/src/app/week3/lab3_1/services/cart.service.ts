import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private platformId = inject(PLATFORM_ID);

  private isBrowser = isPlatformBrowser(this.platformId);

  cartItems = signal<CartItem[]>(this.loadFromStorage());

  constructor() {
    if (this.isBrowser) {
      const stored = this.loadFromStorage();

      this.cartItems.set(stored.length > 0 ? stored : this.getMockData());

      effect(() => {
        localStorage.setItem('cart', JSON.stringify(this.cartItems()));
      });
    }
  }

  private loadFromStorage(): CartItem[] {
    if (!this.isBrowser) return [];
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }

  private getMockData(): CartItem[] {
    return [
      { id: 1, name: 'Bia 333', price: 8000, quantity: 1 },
      { id: 2, name: 'Bia Heineken', price: 13500, quantity: 2 },
      { id: 3, name: 'Bia Tiger Bạc', price: 14000, quantity: 1 },
    ];
  }

  addProduct(newProduct: CartItem): void {
    this.cartItems.update((currentCartItems) => {
      const isExist = currentCartItems.find((item) => item.id === newProduct.id);

      if (isExist) {
        return currentCartItems.map((item) =>
          item.id === newProduct.id
            ? { ...item, quantity: item.quantity + newProduct.quantity }
            : item,
        );
      }

      return [...currentCartItems, newProduct];
    });
  }

  removeProduct(productId: number | string): void {
    this.cartItems.update((currentItems) => {
      return currentItems.filter((item) => item.id != productId);
    });
  }

  updateQuantity(productId: number | string, newQuantity: number): void {
    this.cartItems.update((currentItems) => {
      return currentItems.map((item) =>
        item.id == productId ? { ...item, quantity: newQuantity } : item,
      );
    });
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
