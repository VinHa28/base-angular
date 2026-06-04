import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  standalone: true,
  imports: [],
  template: `
    <div>
      <h3>Nội dung của tab: {{ title }}</h3>
    </div>
  `,
})
export class TabItem {
  @Input() title!: string;
}
