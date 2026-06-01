import { AfterContentInit, Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  templateUrl: './countdown.html',
  styleUrl: './countdown.css',
})
// OnDetroy - Lifecycle Hook cung cap ngOnDestroy de xoa, don dep khi component khong hien thi tren man hinh nua
export class CountdownComponent implements OnDestroy {
  // nếu dùng biến thông thường, setInterval không chạy trong Angular Zone -> Angular không biết có thay đổi -> không update
  // Change Detection
  // seconds: number = 30;
  seconds = signal<number>(30);
  message: string = 'ready';

  // Biến lưu trữ ID của Interval để có thể clear khi dừng/hủy component
  private intervalId: any = null;

  start() {
    if (this.intervalId) return; //neu dang co interval thi khong tao moi
    this.message = 'Counting down...';
    this.intervalId = setInterval(() => {
      if (this.seconds() > 0) {
        this.seconds.update((s) => s - 1);
      } else {
        this.pause();
        this.message = 'Timeout!';
      }
    }, 1000);
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.message = 'Paused';
    }
  }

  reset() {
    this.pause();
    this.seconds.set(30);
    this.message = 'Reseted!';
  }

  ngOnDestroy(): void {
    this.pause();
  }
}
