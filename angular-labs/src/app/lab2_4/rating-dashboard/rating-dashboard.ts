import { Component } from '@angular/core';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-rating-dashboard',
  imports: [Rating],
  template: `
    <div class="flex items-center gap-4">
      <button
        (click)="randomRating()"
        style="padding: 10px; background: #3498db; color: white; border: none; cursor: pointer; border-radius: 4px;"
      >
        Ngẫu Nhiên
      </button>
      <app-rating [rating]="currentRating"></app-rating>
    </div>
  `,
})
export class RatingDashboard {
  currentRating: number = 0;
  randomRating() {
    this.currentRating = parseFloat((Math.random() * 4 + 1).toFixed(1));
  }
}
