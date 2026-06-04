import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [],
  template: ` <p>{{ loadingState }}</p> `,
})
export class SystemStatus implements AfterViewChecked {
  loadingState: string = 'Đang tải...';
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    console.log(this.changeDetectorRef);
  }

  ngAfterViewChecked(): void {
    this.loadingState = 'Tải xong hoàn toàn!';
    this.changeDetectorRef.detectChanges();
  }
}
