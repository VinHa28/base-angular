# Angular Fundamentals

# Angular

Là một Framwork open source, được phát triển bởi google. Thường được dùng để xấy dựng SPA với hiệu suất cao, linh họa và có khả năng mở rộng quy mô lớn.

- Sử dụng TypeScript
- Cấu trúc Component
- Hệ sinh thái toàn diện: Forms, Routing, state management và API Interaction mà không cần cài đặt quá nhiều thư

## Single Page Application - SPA

Là một **kiến trúc web** nơi mà toàn bộ ứng dụng thực chất chỉ chạy trên **duy nhất một file HTML.** 

|  | Multi Page Application | Single Page Application |
| --- | --- | --- |
| Cách chạy | Bấm link → Request lên server → server xử lý → tạo file HTML mới hoàn toàn | Lần đầu tiên truy cập → trình duyệt tải duy nhất index.html  + code JS(Angular) → không cần tải lại trang |
| Trải nghiệm | Cần reload để tải lại toàn bộ trang từ đầu | Giống như đang dùng 1 phần mềm cài sẵn |

## How Angular Works

- Step 1: Khởi động file gốc  `index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MyAngularApp</title>
</head>
<body>
  <app-root></app-root> 
</body>
</html>
```

- Step 2: Kích hoạt file mồi  `main.ts`
Các files JavaScript đã được Angular biên dịch sẵn (bundles) sẽ được tải vào trình duyệt → File chạy đầu tiền là `main.ts` (hàm bootstrap).
- Step 3: Render component và quản lý DOM (Component Lifecyle)
Angular tìm thẻ `<app-root>` đang nằm chờ sẵn trong file `index.html`. Sau đó, đọc file giao diện (HTML Template) và logic (TypeScript) của `AppComponent` để tạo ra mã HTML thực tế, rồi **inject** vào bên trong thẻ `<app-root>`. Lúc này người dùng mới chính thức nhìn thấy giao diện hiển thị.
- Step 4: Cơ chế Data Bìding & Change Detection
Khác với JavaScript thuần (phải tự dùng `document.getElementById` để thay đổi trên màn hình), Angular tự động đồng bộ hóa dữ liệu giữa file TypeScript (Logic) và file HTML (Giao diện).
    - **Property Binding / Interpolation ( `value` ):** Khi thay đổi một biến trong file TypeScript, Angular sẽ tự động cập nhật giá trị đó lên màn hình HTML ngay lập tức.
    - **Event Binding (`(click)="doSomething()"`):** Khi người dùng bấm nút trên HTML, trình duyệt sẽ gọi ngay hàm tương ứng trong file TypeScript để xử lý logic.
    - **Change Detection Loop:** Angular có một vùng quản lý đặc biệt (ngầm định qua thư viện `zone.js` hoặc cơ chế `Signals` ). Mỗi khi có sự kiện xảy ra (click chuột, gõ phím, API trả về dữ liệu), Angular sẽ quét qua toàn bộ cây Component để kiểm tra xem dữ liệu có thay đổi không. Nếu có, Angular sẽ cập nhật lại giao diện (DOM) một cách tối ưu nhất.

## Standalone Component

### 1. Tại sao trước đó cần `app.module.ts`?

Trong các phiển bản cũ, compiler của Angular không thể hiểu Component một các độc lập → Cần 1 người quản lý để khai báo và gom nhóm → **NgModule** (`app.module.ts`).

- Nếu tạo ra một `ComponentA`, không thể dùng nó ngay.Bắt buộc phải vào `app.module.ts` để khai báo trong mảng `declarations`.

```tsx
// KIẾN TRÚC CŨ (Bắt buộc phải có NgModule trung gian)
@NgModule({
	declarations: [AppComponent, UserComponent, OrderComponent], //Khai báo 
	imports: [BrowserModule, FormsModule], //Import các module bổ trợ
	bootstrap: [AppComponent];
})

export class AppModule{}
```

→ Nhược điểm:

1. Dư thừa và cồng kềnh (Boilerplate code): Cứ mỗi lần tạo file → đăng ký thủ công vào file Module
2. Khó học 
3. Ảnh hướng để hiệu năng (Tối ưu hóa dung lượng - Tree Shaking): Vì các thành phần bị gom chung vào Module → Bundler đóng gói code rất khó nhận biết Componenet nào thực sự không dùng đến để xóa

### 2. Standalone Componenet

Là một kiến truc cho phép Component quản lý chính nó.

→ Component không cần `app.modules.ts` → có thể import  trực tiếp những gì Componenet cần dùng.

```tsx
@Component({
	selector: 'app-user',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
	template: `
    <div *ngIf="isLoggedIn">
      <input [(ngModel)]="username" />
      <a routerLink="/profile">Xem hồ sơ</a>
    </div>
})

export class UserComponnet
```

## Component Decorator

Bắt dầu bằng `@` , bản chất là một hàm dùng để cung cấp **Metadata**, khai báo cho compiler class bên dưới là một Component 

### 1. **`selector`**

- Định nghĩa tên của thẻ HTML (Custom HTML Tag) đại diện cho Component này
- Khi muốn chèn Component vào giao diện một Componnet khác, chỉ cần gọi tên `selector` như một thẻ HTML.
- Quy tắc đặt tên: Luôn kèm theo **prefix** để tránh trùng mới các HTML sẵn có vd: `app-user-card`, `app-navbar`

### 2. `template` or `templateUrl`

Chỉ được chọn 1 trong 2 các để định nghĩa giao diện:

- `templateUrl` : Trỏ đến một file HTML. Thường dùng khi giao diện dài phức tạp.
- `template` Viết trực tiếp mã HTML dạng chuỗi (inline HTML) vào đây băng backtick ``` Dùng khi giao diện ngắn

### 3. `styleUrls` or `styles`

Tương tự như template

### 4. Standalone

`standalone: true` 

`import: [...]` - khai báo các **module**, **component**, **directive**, **pipe** mà component hiện tại cần sử dụng trong template.

- **Các Component / Directive / Pipe con khác:** Nếu file HTML của `ParentComponent` chứa thẻ `<app-child></app-child>`, bạn bắt buộc phải đưa `ChildComponent` vào mảng `imports` của `ParentComponent`.
- **Các Module lõi của Angular:** * `CommonModule` hoặc `@if` `@for` , `FormsModule`, `RouterLink`

```tsx
//user-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-user-card', //Tên thẻ HTML
	standalone: true, //Standalone component
	imports: [CommonModule],
	template: `
		<div class='card-box'>
			<h4>Nhân viên: {{ username }}</h4>
			<p>Trạng thái: Đang hoạt động</p>
		</div> 
	`,
	styleUrls: ['./user-card.css'];
})

export class UserCardComponent {
	//Biến này để hứng dữ liệu từ component cha
	@Input() username: string = "Người dùng ẩn danh"
}
```

```tsx
//dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from './user-card.component'; //import class con

@Component({
	selector: 'app-dashboard',
	template:`
		<div class="dashboard-container">
      <h2>Hệ Thống Quản Lý Nhân Sự Intern</h2>
      <p>Dưới đây là danh sách các thành viên trong đội dự án:</p>
      <app-user-card [userName]="leaderName"></app-user-card>
      <app-user-card [userName]="internName1"></app-user-card>
      <app-user-card [userName]="internName2"></app-user-card>
    </div>
	`
	style: [`
		.dashboard-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    h2 { color: #333; }
	`]
})

export class DashboardComponent {
	// dữ liệu tại component cha
	leaderName: string = "Phùng Đức A";
	internName1: string = "Hà Văn B";
	internName2: string = "Nguyễn Văn C";
}
```

## Angular CLI

### 1. Khởi tạo và chạy dự án

**`ng new <tên-dự-án>`**: Khởi tạo một dự án Angular mới hoàn toàn từ A-Z với đầy đủ cấu trúc thư mục chuẩn.

**`ng serve`** ( **`ng s`**): Khởi động server ảo để chạy thử ứng dụng ở môi trường local (thường chạy tại cổng `http://localhost:4200`). 

### 2. Scaffolding `ng generate`

`ng generate <loại-thành-phần> <tên-thành-phần>` 

`ng g <loại> <tên>`

| Loại thành phần | Lệnh đầy đủ | Lệnh tắt | Tự động sinh ra |
| --- | --- | --- | --- |
| Component | ng generate component user | ng g c user | Folder user:
  • .ts
  • .html
  • .css
  • .spec.ts (test file) |
| Service | ng generate service auth | ng g s auth | file contain logic call API or hanlde data |
| Pipe | ng generate pipe format-date | ng g p format-date | Tạo file định dạng hiển thị dữ hiệu trên HTML |
| Directive | ng generate directive  zoom | ng g d zoom | Tạo file can thiệp hành vi các thẻ HTML |

### Standalone tự động của Angular CLI

`ng g c components/product-list` Angular sẽ:

1. Tạo một thư mục là `product-list` 
2. Từ động sinh ra cấu trúc file `.ts` với thuộc tính `standalone: true` 
3. Điền tên `selector: 'app-product-list'` 
4. Nối đường dẫn `templateUrls`  và `styleUrl`  vào `.ts`

### Flags

- `--skip-tests` : bỏ qua tạo file test
- `--inline-template` (`-t`) and `--inline-style` (`-`): Gom giao diện và style
- `--dry-run` : Chạy thử lệnh ở terminal, không tạo
- `--strict` : Chế độ nghiêm ngặt