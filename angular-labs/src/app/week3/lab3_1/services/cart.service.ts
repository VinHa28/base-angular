import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  constructor() {}

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
