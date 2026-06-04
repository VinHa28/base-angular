import { Component, DoCheck, Input, IterableDiffers } from '@angular/core';

@Component({
  selector: 'app-task-notification',
  imports: [],
  templateUrl: './task-notification.html',
})
export class TaskNotification implements DoCheck {
  @Input() tasks: string[] = [];
  taskCount: number = 0;
  private differ: any;
  constructor(private differs: IterableDiffers) {
    this.differ = differs.find(this.tasks).create();
  }
  ngDoCheck(): void {
    const changes = this.differ.diff(this.tasks);
    if (changes) {
      this.taskCount = this.tasks.length;
    }
  }
}
