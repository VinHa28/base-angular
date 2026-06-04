import { Component, inject, Input } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart-item.html',
})
export class CartItemComponent {
  @Input() item!: CartItem;

  private carService = inject(CartService);

  // TODO: Inject CartService and wire up these handlers
  onDecrease(): void {
    if (this.item.quantity > 1) {
      this.carService.updateQuantity(this.item.id, this.item.quantity - 1);
    } else {
      this.carService.removeProduct(this.item.id);
    }
  }
  onIncrease(): void {
    this.carService.updateQuantity(this.item.id, this.item.quantity + 1);
  }

  onRemove(): void {
    this.carService.removeProduct(this.item.id);
  }
}
