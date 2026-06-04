import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

const MOCK_ITEMS = [
  { id: 1, name: 'Bia 333', price: 8000, quantity: 1 },
  { id: 2, name: 'Bia Heineken', price: 13500, quantity: 2 },
  { id: 3, name: 'Bia Tiger Bạc', price: 14000, quantity: 1 },
];

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CartItemComponent],
  templateUrl: './cart-list.html',
})
export class CartLisst {
  private cartService = inject(CartService);
  cartItems = this.cartService.cartItems;

  constructor() {}
  totalQuantity = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  tax = computed(() => this.subtotal() * 0.1);
  total = computed(() => this.subtotal() + this.tax());

  onClearAll(): void {}
}
