# Angular Advance

# Template Syntax & Directives

Directive là các classes đặc biệt cho phép mở rộng cú pháp HTML, thao tác với DOM.

Có 3 loại chính trong Angular:

1. Component: mỗi component thực chất đã là một directive đi kèm với một template
2. Atribute Directive: dùng để thay đổi giao diện hoặc hành vi của 1 phần tử, thuộc tích hoặc component hiện có. 
- Được áp dụng như 1 property trên HTML tag
- [ngClass]: thêm hoạc xóa class CS, [ngStyle]: Thay đổi nhiều kiểu style CSS, [ngModule]: thực hiện ràng buộc dữ liệu Two-way Data Biding
3. Structural Directive: Thay đổi cấu trúc DOM
4. Custome Directive: Ngoài các loại có sẵn, Angular cho phép tự tạo các directives để đáp ứng nghiệp vụ. VD: directive tự động đổi màu khi hover

## Template Syntax

Template làm một đoạn HTML đóng vai trò là giao diện người dùng (UI) cho một component.

### 1. Khai báo Template trong Component

- `templateUrl` : Trỏ tới 1 file HTML riêng biệt
- `template` : Viết trực tiếp HTML inline vào file TypeScript

```tsx
@Component({
 selector: "app-hello",
 //Sử dụng templateUrl cho file HTML riêng
 templateUrl: './hello.component.html'
 //template: `<h1>Xin chao {{name}}</h1>`
})

export class HelloComponent {
	name: string = 'Angular';
}
```

### 2. Cú pháp Data Binding (Liên kết dữ liệu)

Là cầu nối giữa TS của component với Template:

- Interpolation (Nội suy): hiển thị dữ liệu từ Component ra HTML

```tsx
<h1>{{title}}</h1>
//trong component
title = "Hello Angular"
//-> <h1>Hello Angular</h1>
```

- Property Binding: Gán giá trị từ Component cho thuộc tính của thẻ HTML

```tsx
<img [src]="imageUrl">
<button [disabled]="isDisabled">Click</button>
//Trong component
imageUrl = "https://example.image.com/image.png";
isDisabled = true;
```

- Event Binding: Lắng nghe sự kiên (click, input,…) từ user

```tsx
<button (onclick)='hanldeClick()'>Click me</button>
//Trong Component
handleClick() {
	console.log("Button Clicked!");
}
```

- Two-way Binding: Liên kết dữ liệu 2 chiều (Thường dùng trong form)

```tsx
<input [(ngModel)]="username">
<p>{{ username }}</p>
//Trong componet
username = "";
//Gõ input → biến username thay đổi
```

## Structural Directive (Chỉ thị cấu trúc):

Dùng để thay đổi cấu trúc của DOM (thêm/xóa/lặp phần tử)

- `@ngIf` : Hiển thị phần tử dựa trên điều kiện (đã thay cho `*ngIf`)

```tsx
@if (isLogin) {
	<p>Wellcome</p>
} @else {
	<p>Please Login</p>
}
```

- `@for` Lặp qua một mảng dữ liệu (cũ `*ngFor`)

```tsx
@for (item of items; track item.id) {
	<li>{{item.name}}<li/>
}
```

- `@defer` : lazy loading

```tsx
@defer {
	<heavy-component/>
} @loading {
	<p>Loading...</p>
}
```

Các Atrribute Directives:

- `[ngClass]` : `<div [ngClass]="{active: isActive}"></div>`
- `[ngStyle]` : `<div [ngStyle: "{color: 'red'}"]>`
- `ngModel`  (Forms)
- `[hidden]` : `<div [hidden]=”isHidden”>`

## Custome Directive

Angular cung cấp `ElementRef` , `Renderer2` và `@HostListener` 

- `ElementRef` : Bọc lấy phần tử HTML thực tế, cung cấp attribute `nativeElement` nhằm xác định chính xác HTML
- `Renderer2` : Giúp thay đổi DOM, thay vì sửa trực tiếp Renderer 2 sẽ tính toán can thiệp vào DOM một cách an toàn trên mọi môi trường (Browser, Server, Web Worker)
- `@HostListener` : Là một decorator đóng vai trò lắng nghe các sự kiện của người dùng lên HTML tags (`mouseenter` - di chuột vào, `mouseleave` - di chuột ra, `click` - bấm chuột)