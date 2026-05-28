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

## Tương Tác DOM Thông Qua Query

Angular cung cấp cáo decorator: `@ViewChild` , `@ViewChildren` , `@ContentChild`  và `@ContentChildren`

### 1. Truy vấn phần tử cùng Template

Dùng để tìm kiếm cá element nằm ngay trong file HTML của chính Component.

- `@ViewChild` : lấy phần tử duy nhất

```tsx
//HTML 
<input #usernameInput type="text">
//TS
//Tìm phần tử có #usernameInput trong template
@ViewChild('usernameInput') inputEl!: ElementRef<HTMLInputElement>;

constructor(private renderer: Renderer2){}

//Bắt buộc phải tương tác DOM từ lifecyle này trở đi
ngAfterViewInit(){
}

forcusInput(){
	this.renderer.selectRootElement(this.inputEl.nativeElement).focus();
}
```

- `@ViewChildren` Tìm và trả về tất cả các phần tử khớp điều kiện dưới dạng 1 danh sách có tên là `QueryList` - sẽ tự động cập nhật nếu danh sách HTML thay đổi (ví dụ dùng `@for`)

```tsx
@for (item of [1, 2, 3]; track item) {
	<div #box class='box'>Box {{item}}</div>
}
<button (click)="changeBoxesColor()">Đổi màu tất cả các hộp</button>

//Trong TS component
@ViewChildren('box') boxRefs!: QueryList<ElementRef>;
constructor(private renderer: Renderer2){}

changeBoxesColor() {
	//Duyệt qua từng phần tử
	this.boxRefs.forEach(box => {
		this.renderer.setStyle(box.nativeElement, 'color', 'red')
	})
}
```

### 2. Nhóm content

`@ContentChild`  & `@ContentChildren`  dùng để tìm kiếm các phần tử bên ngoài vào thông qua ng-content (Content Projection). Những phần tử này không thuộc về HTML gốc của component mà do Component cha gửi xuống

- `@ContentChild` : Tìm kiếm phần tử đầu tiên trong số các phần tử được duyệt qua `<ng-content>`

```tsx
//Cách componnet cha sử dụng component con
<app-card>
	<h2 @cardTitle>Tiêu đề bài viết</h2> //Phần tử đụowc truyền vào
</app-card>
//.ts
@Component({
	selector: 'app-card',
	standalone: true,
	template: `<div class='card-wrapper'><ng-content></ng-content></div>`
})

export class CardComponent implements AfterContentInit{
	//Dùng ContentChild vì phần tử này nằm ở ng-content, không phải template gốc của Card
	@ContentChild('cardTitle') titleRef!: ElementRef;
	//Đối với Content, lắng nghe ở Lifecycle AfterContentInit
	ngAfterContentInit(){
		console.log(this.titleRef.nativeElement.textContent);
	}
}
```

- `@ContentChildren`

```tsx
//tab.component.ts
@Component({
	selector: 'app-tab',
	standalone: true,
	template: `
		<!-- Chỉ hiển thị nội dung nếu tab này được kích hoạt -->
	    @if (active) {
	      <div class="tab-content">
	        <ng-content></ng-content>
	      </div>
	    }
	`,
})

export class TabComponent {
	@Input() title!: string;
	active = false; //Trạng thái của tab
}
```

```tsx
//tabs.component.ts
@Component({
	selector: 'app-tabs',
	standalone: true,
	template: `
		<div class="tabs-header">
	      <!-- Lặp qua danh sách các tab thu được từ Query để làm menu bấm -->
	      @for (tab of tabs; track tab) {
	        <button (click)="selectTab(tab)" [class.active]="tab.active">
	          {{ tab.title }}
	        </button>
	      }
	    </div>
	    <!-- Nơi chứa nội dung của các tab -->
	    <ng-content></ng-content>
	`
})

export const TabsComponent implements AfterContentInit {
	//Tìm tất cả các Component con thuộc kiểu TabComponent được truyền vào
	@ContentChinldren(TabComponent) tabs!: QueryList<TabComponent>;
	
	//Bắt buộc phải xử lý trong AfterContentInit vì lúc này nội dung truyền vào mới sẵn sàng
	ngAfterContentInit() {
		const activeTabs = this.tabs.filter(tab => tab.active);
		if (activeTabs.length === 0 && this.tabs.first) {
			this.selectTab(this.tabs.first);
		}
	}
}

//
<!-- app.component.html -->
<app-tabs>
  <app-tab title="Tab 1">
    <h3>Nội dung của Tab 1</h3>
    <p>Đây là dữ liệu động truyền vào tab thứ nhất.</p>
  </app-tab>

  <app-tab title="Tab 2">
    <h3>Nội dung của Tab 2</h3>
    <p>Giao diện sẽ tự động chuyển sang đây khi bấm nút Tab 2.</p>
  </app-tab>
</app-tabs>
```

## `ElementRef` , `TemplateRef` & `VieContainerRef`

### 1. `ElementRef` - “Viên gạch”

Đại diện cho một element DOM thực tế (<div>, <input>,…). Bao bọc element HTML bên trong thuộc tính `nativeElement` .

- Mục đích: Thay đổi thuộc tính, class, style bằng cách gọi các hàm native

```tsx
@ViewChild('myDiv') divRef!: ElementRef;
this.renderer.setStyle(this.divRef.nativeElement, 'color', 'blue');
```

### 2. `TemplateRef` - “Bản thiết kế”

Đại diện cho nội dung nằm bên trong thẻ <ng-template> - được Angular biên dịch nhưng chưa được render ra màn hình, nó nằm chờ như một bản thiết kế - blueprint

- Mục địch: Định nghĩa sẵn một vùng giao diện (UI chunk) để có thể tái sử dụng hoặc chèn vào DOM

```tsx
<ng-template #loadingTmpl>
	<div class='spinner'>Loading</div>
</ng-template>

@ViewChild('loadingTmpl) loadingTemplate! TemplateRef<any>;
```

### 3. `ViewContainerRef` - ‘Mảnh đất’

Đại diện cho một vùng chứa - container gắn liền với một phần tử. Cung cấp các hàm mạnh mẽ dể khởi tạo và chèn các Componnet hay TemplateRef vào DOM

- Mục địch: Thêm, xóa, dichuyeenr hoặc sắp xếp lại các phần tử trên giao diện tại thời điểm runtime
- Các hàm quan trọng: `createEmbeddedView(templateRef)` , `createCoponent(conponentType)` , `clear()`