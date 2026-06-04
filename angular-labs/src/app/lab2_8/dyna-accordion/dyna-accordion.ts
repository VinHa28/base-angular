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
  templateUrl: './dyna-accordion.html',
})
export class DynaAccordion implements AfterContentChecked {
  @ContentChildren('contentParam', { read: ElementRef }) projectedElements!: QueryList<ElementRef>;
  @ViewChild('accordingWrapper', { static: true }) accordingWrapper!: ElementRef<HTMLDivElement>;

  charCount: number = 0;
  lastHeight = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterContentChecked() {
    setTimeout(() => {
      this.updateHeight();
    });
  }

  updateHeight() {
    const wrapper = this.accordingWrapper?.nativeElement;
    if (!wrapper) return;

    const newHeight = wrapper.scrollHeight;

    const newCharCount = this.projectedElements
      .toArray()
      .reduce((sum, el) => sum + (el.nativeElement.innerText?.length ?? 0), 0);

    if (newHeight !== this.lastHeight || newCharCount !== this.charCount) {
      this.lastHeight = newHeight;
      this.charCount = newCharCount;
      this.renderer.setStyle(wrapper, 'max-height', newHeight + 'px');
    }
  }
}
