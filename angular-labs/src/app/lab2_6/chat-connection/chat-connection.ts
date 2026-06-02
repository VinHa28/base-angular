import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-connection',
  standalone: true,
  imports: [],
  templateUrl: './chat-connection.html',
})
export class ChatConnection implements OnInit, OnDestroy {
  private intervalId: any;

  ngOnInit(): void {
    console.log('ChatConnection Componenet được khởi tạo.');

    this.intervalId = setInterval(() => {
      console.log('Đang nhận tin nhắn mới từ Server...');
    }, 1000);
  }
  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
