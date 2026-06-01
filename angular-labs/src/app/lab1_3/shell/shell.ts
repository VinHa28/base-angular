import { Component } from '@angular/core';

// Đường dẫn đến 2 components
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Highlight } from '../../lab2_1/directives/hover-highlight';
import { DashboardComponent } from '../../lab2_2/dashboard/dashboard';
import { Todo } from '../../lab2_3/todo/todo';
import { ProductList } from '../../lab2_3/product-list/product-list';

/**
 * Khi Angular biên dịch một Standalone Component (vd: ShellComponent),
 * quá trình tìm kiếm diễn ra:
 * 1. Quét file Template HTML để tìm thẻ Selector
 * --> Angular Compiler sẽ đọc file HTML (shell.component.html) và
 *  phát hiện ra các Custom Tags không phải của HTML chuẩn, ví dụ: <app-navbar> và <app-sidebar>.
 *
 * 2. Đối chiếu trực tiếp vào mảng imports của @Component
 * --> Nếu NgModule sẽ phải tìm ở file app.ts ở xa
 * --> Angular Compiler tìm trong shell.ts
 *
 * 3.Tìm file vật lý dựa vào import của TypeScript:
 * --> sau khi tìm được Navbar trong thuộc tính imports
 * --> dựa vào import { NavbarComponent } from '../navbar/navbar.component'; để tìm ra file .ts
 *
 */

@Component({
  selector: 'app-shell',
  standalone: true,
  // Thêm các component vào đây
  imports: [Navbar, Sidebar, Highlight, DashboardComponent, ProductList],
  templateUrl: './shell.html',
})
export class Shell {}
