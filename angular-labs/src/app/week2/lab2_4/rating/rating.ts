import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  template: `
    <p style="font-size: 18px; font-weight: bold;">
      Rating tại: <span style="color: #ff8c00;">{{ rating }}</span>
    </p>
  `,
})
export class Rating implements OnChanges {
  @Input() rating!: number;

  /** SimpleChanges là một JavaScript Object
   * key = tên của biến @Input trong component (ở đây là 'rating')
   * value = 1 instance thuộc SimpleChange
   * ======
   * Thuộc tính của 1 SimpleChange
   * currentValue = chứa giá trị mới nhất
   * previousValue = giá trị ngay trước đó, ở lần đầu tiên = undefined
   * isFirstChange() = method trả về true nếu đay là lần đầu tiên nhạn dữ liệu, trả về false trong tất cả các lần thay đổi khác
   */

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    console.log('Rating: ', changes['rating']);
  }
}
