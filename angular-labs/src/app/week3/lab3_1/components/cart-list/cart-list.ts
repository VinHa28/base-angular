import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item';
import { CartService } from '../../services/cart.service';
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
