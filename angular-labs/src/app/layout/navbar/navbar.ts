import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', 'my-secret-jwt-token-12345');
    }
  }

  fetchData() {
    this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe({
      next: (res) => console.log('Data API: ', res),
      error: (error) => console.error('API error: ', error),
    });
  }

  getError500() {
    this.http.get('https://httpbin.org/status/500').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log('Component nhận diện lỗi:', err),
    });
  }

  getError401() {
    this.http.get('https://httpbin.org/status/401').subscribe();
  }
}
