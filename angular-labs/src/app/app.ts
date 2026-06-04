import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskContainer } from './week2/lab2_10/task-container/task-container';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-labs');
}
