import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  imports: [],
  standalone: true,
  template: `
    <h3 class="font-bold mt-5 ml-2">{{ statusMessage }}</h3>
    <p><strong>Dữ liệu JSON thực tế trên HTML:</strong></p>
    <pre>{{ userProfile.name }}</pre>
  `,
})
export class UserProfileComponent implements OnChanges {
  @Input() userProfile!: { name: string; age: number };
  statusMessage: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userProfile']) {
      this.statusMessage = 'Hồ sơ của ' + this.userProfile.name;
    }
  }
}
