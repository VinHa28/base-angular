import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shell } from './lab1_3/shell/shell';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Shell],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-labs');
}
