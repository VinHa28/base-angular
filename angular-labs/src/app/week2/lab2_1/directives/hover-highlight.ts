import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]', //Tên thẻ sẽ sử dụng trong HTML
  standalone: true, //Kiến trúc standalone
})
export class Highlight {
  // @Input để cho phép truyền màu tùy biến từ bên ngoài
  @Input() highlightColor: string = 'red';

  constructor(
    private el: ElementRef, // lấy ra phần tử gốc (Host Element)
    private renderer: Renderer2, //Công cụ để thay đổi DOM
  ) {}

  // 1. Lắng nghe sự kiện khi hover
  @HostListener('mouseenter') onMouseEnter() {
    this.changeStyle(this.highlightColor, 'scale(1.03)', 'all o.3s ease');
  }

  // 2. Lắng nghe sự kiện khi mouseleave
  @HostListener('mouseleave') onMouseleave() {
    this.changeStyle('', '', 'all 0.3s ease');
  }

  //Hàm changeStyle dùng Renderer2 để can thiệp vào DOM
  private changeStyle(backgroudColor: string, transform: string, transition: string) {
    const nativeEl = this.el.nativeElement;

    //thay vì dùng nativeEl.style.backgroundColor = color
    this.renderer.setStyle(nativeEl, 'background-color', backgroudColor);
    this.renderer.setStyle(nativeEl, 'transform', transform);
    this.renderer.setStyle(nativeEl, 'transition', transition);
  }
}
