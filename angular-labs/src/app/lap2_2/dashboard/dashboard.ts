import { Component, ViewChild, viewChild } from '@angular/core';
import { CountdownComponent } from '../countdown/countdown';

@Component({
  selector: 'app-dashboard',
  imports: [CountdownComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  @ViewChild(CountdownComponent) private countdownComp!: CountdownComponent;

  startChildTimer() {
    if (this.countdownComp) {
      this.countdownComp.start();
    }
  }

  pauseChildTimer() {
    if (this.countdownComp) {
      this.countdownComp.pause();
    }
  }

  resetChildTimer() {
    if (this.countdownComp) {
      this.countdownComp.reset();
    }
  }
}
