import { Component, signal } from '@angular/core';
import { Product, ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './product-list.html',
})
export class ProductList {
  products = signal<Product[]>([]);

  isUsingCorrectTrack = signal<boolean>(true);

  protected Math = Math;

  constructor() {
    this.generateProducts();
  }

  generateProducts() {
    const newProducts: Product[] = [];

    for (let i = 0; i < 1000; i++) {
      newProducts.push({
        id: `pro-${i}`,
        name: 'Product number ' + i,
      });
    }

    this.products.set(newProducts);
  }

  suffleProducts() {
    const shuffled = [...this.products()];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.products.set(shuffled);
  }

  updateRandomProduct() {
    if (this.products().length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.products().length);

    this.products.update((prods) =>
      prods.map((prod, index) => {
        if (index === randomIndex)
          return {
            ...prod,
            name: prod.name + 'Đã cập nhật',
          };
        return prod;
      }),
    );
  }
}
