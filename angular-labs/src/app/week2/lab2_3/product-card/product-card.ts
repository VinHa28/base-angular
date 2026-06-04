import { Component, Input } from '@angular/core';

export interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input() product!: Product;
}
