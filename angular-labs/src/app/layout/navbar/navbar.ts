import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { error } from 'console';
import { NgClass } from "../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private http = inject(HttpClient);

  ngOnInit(): void {
    localStorage.setItem('accessToken', 'my-secret-jwt-token-12345');
  }

  fetchData() {
    this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe({
      next: (res) => console.log('Data API: ', res),
      error: (error) => console.error('API error: ', error),
    });
  }
}
