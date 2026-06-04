import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo.html',
})
export class Todo {
  todos = signal<Array<{ id: number; title: string }>>([
    { id: 1, title: 'Learn TypeScript' },
    { id: 2, title: 'Learn Angular' },
  ]);

  newTodo: string = '';
  addTodo() {
    if (!this.newTodo.trim()) return;
    const newItem = {
      id: Date.now(),
      title: this.newTodo,
    };

    this.todos.update((list) => [...list, newItem]);
    this.newTodo = '';
  }

  deleteTodo(id: number) {
    this.todos.update((list) => list.filter((t) => t.id !== id));
  }
}
