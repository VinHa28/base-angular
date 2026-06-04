import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './lab2_7/dashboard/dashboard';
import { SystemStatus } from './lab2_9/system-status/system-status';
import { DynaAccordion } from './lab2_8/dyna-accordion/dyna-accordion';
import { Container } from './lab2_8/container/container';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SystemStatus],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-labs');
}
