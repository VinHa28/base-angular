import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-dyna-accordion',
  standalone: true,
  imports: [],
  template: `
    <div class="w-full">
      <div #accordingWrapper class="accordion-wrapper">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './dyna-accordion.css',
})
export class DynaAccordion implements AfterContentChecked {
  @ContentChildren('contentParam', { read: ElementRef }) projectedElements!: QueryList<ElementRef>;

  @ViewChild('accordingWrapper', { static: true }) accordingWrapper!: ElementRef;

  constructor(private renderer: Renderer2) {}

  lastHeight = 0;

  ngAfterContentChecked() {
    // 1. Tính tổng số lượng ký tự của tất cả các đoạn văn bản đang có trong ng-content
    let totalChars = 0;
    this.projectedElements?.forEach((el) => {
      totalChars += el.nativeElement.textContent?.length || 0;
    });
    console.log('Tổng số ký tự:', totalChars);
    console.log('Tổng số phần tử:', this.projectedElements.length);
    this.updateHeight();
  }

  private updateHeight() {
    const el = this.accordingWrapper.nativeElement;

    // reset height để browser tính lại layout thật
    this.renderer.setStyle(el, 'height', 'auto');

    const newHeight = el.scrollHeight;

    if (newHeight !== this.lastHeight) {
      this.lastHeight = newHeight;

      this.renderer.setStyle(el, 'height', `${newHeight}px`);
    }
  }
}
