import { Component } from '@angular/core';
import { TaskNotification } from '../task-notification/task-notification';

@Component({
  selector: 'app-task-container',
  imports: [TaskNotification],
  templateUrl: './task-container.html',
})
export class TaskContainer {
  parentTasks: string[] = ['Task 1', 'Task 2'];

  addTask() {
    this.parentTasks.push('Task Mới');
  }
}
