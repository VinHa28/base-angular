import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartLisst } from './week3/lab3_1/components/cart-list/cart-list';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartLisst],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-labs');
}
