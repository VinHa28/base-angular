import { Component } from '@angular/core';
import { ChatConnection } from '../chat-connection/chat-connection';

@Component({
  selector: 'app-chat-container',
  imports: [ChatConnection],
  standalone: true,
  template: ` <div
    style="border: 2px solid #ccc; padding: 20px; max-width: 500px; margin: 30px auto; border-radius: 8px; font-family: sans-serif;"
  >
    <button
      (click)="toggleChat()"
      [style.background-color]="isChatVisible ? '#f44336' : '#4caf50'"
      style="padding: 12px 20px; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold; width: 100%;"
    >
      {{ isChatVisible ? 'Ẩn Component Con (Unmount)' : 'Hiện Component Con (Mount)' }}
    </button>

    @if (isChatVisible) {
      <app-chat-connection></app-chat-connection>
    }
  </div>`,
})
export class ChatContainer {
  isChatVisible: boolean = true;

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }
}
