# 1. State Management với Angular Signals

## 1.1 Core Mechanics:

### Tính phản xạ dữ liệu - Reactivity

Là cơ chế cho phép hệ thống tự động theo dõi, lan truyền sự thay đổi của dữ liệu và cập nhật giao diện (các trạng thái) ngay lập tức mà không cần sự can thiệp thủ công.

### Phân biệt Biến thông thường và WriableSignal

- Biến thông tường (`let count - 0`): Bản chất chỉ là một ô nhớ lưu giá trị. Angular không thể biết khi nào bị thay đổi trừ khi `Zone.js`  được kích hoạt để so sánh giá trị cũ và mới.
- WritableSignal (`count = signal(0)`): đóng vai trò như “Producer”. Khi giá trị bên trong Signal thay đổi nó sẽ lập tức phát tín hiệu đến tất cả các nơi “Consummers” để cập nhật

### `.set()` và `.update()` :

Để quản lý và thay đổi dữ liệu của `WritableSignal` , Angular cng cấp 2 phương thức:

1. `.set(newValue)` - ghi đè: khi muốn thay đổi hoàn toàn giá trị cũ bằng một giá trị mới độc lập

```tsx
//Khởi tạo một Signal
loadingState = signal<boolean>(true);

//Ghi đè trạng thái khi tải xong dữ liệu
this.loadingState.set(false);
```

1. `.update(fn)` : Cập nhật dựa trên giá trị cũ:

```tsx
//Khởi tạo một counter
seconds = signal<number>(30);
//Giảm số giây đi 1 đơn vị sau mỗi chu kỳ 
this.seconds.update(currentSec => currentSec - 1);
```

## 1.2 Derived State

### Sử dụng `.computed()` tạo Read-only Signals

Rất nhiều trạng thái được tính toán ra từ 1 hoặc nhiều trạng thái gốc (VD: Tổng tiền = Đơn giá x Số lượng). Hàm `computed()` sinh ra để giải quyết bài toán này → tạo **Read-only** Signal (Signal chỉ đọc., không thể dùng `.set()` or `.update()`)

```tsx
price = signal<number>(100);
quantity = signal<number>(3);

//Tự động tính toán tổng tiền
totalPrice = computed(() => this.price() * this.quantity())
```

### Dependence Tracking

Khi thực hiện một hàm `computed()` , Angular sẽ ghi nhận tất cả các Signals được thực thi bằng bên trong khối lệnh → Dependencies, bất cứ signals nào bên trong dependencies thay đổi → Angular tự động chạy lại phép tính → cập nhật giá trị của `computed` → chỉ render lại DOM những phần cần thiết.

### Lazy Evaluation

Khi định nghĩa một `computed`  nó chưa được tính toán ngay. Giá trị chỉ được tính khi có nơi nào đọc giá trị (template, effect hoặc 1 computed khác).

### Caching/Memoization tối ưu hiệu năng

Sau lần tính đầu tiên → giá trị được lưu vào cache → các lần đọc tiếp theo sẽ lấy thẳng từ cache nếu không có singals dependence nào thay đổi.

```tsx
//Signals gốc
const firstName = signal('Vinh');
const lastName = signal('Hà Văn');

//Computed Signal
const fullName = this.firstName() + " " this.lastName();

console.log(this.fullName()); // Vinh Hà Văn

firstName.set('Hà');

console.log(this.fullName()); // Vinh 
```

## 1.3 Side Effect

### `effect()`

Hàm `effect()` được sử dụng khi muốn thực hiện code Side Effect bất cứ khi nào các Signals nằm trong nó thay đổi. Các trường hợp phổ biển: Ghi log hệ thống, đồng bộ dữ liệu vào `localStorage` , hoặc thao tác với UI libraries 

```tsx
constructor() {
	effect(() =>{
		console.log(`Số giây đếm được hiện tại là: ${this.seconds()}`)
	})
}
```

### Quy tắc sử dụng

- Không thay đổi trạng thái bên trong `effet()` : **tuyệt đối không gọi** `.set()`  hoặc `.update()` cho một Signal trong `effect()` , trừ khi có cấu hình đặc biệt (`allowSignalWrites`)
- Khai báo đúng ngữ cảnh: `effect()` bắt buộc phải khái báo trong một **Injection Context** (VD: `contructor` của componet) để Angular có thể quản lý lifecycle tự động

### Cơ chế dọn dẹp qua `onCleanup`

Để tránh Memory Leak, hàm callback của `effect`  cung cấp tham số là `onCleanup` . Hàm này nhận vào một hàm cleanup và tự động chạy ngay trước thực thi kế tiếp của effect hoặc khi componenet bị hủy bỏ

```tsx
effect((onCleanup) => {
	const currentToken = this.userToken();
	
	const timer = setInterval(()=>{
		console.log('Checking session...');
	}, 5000);
	
	onCleanup(() => {
		clearInterval(timer);
	})
})
```

## 1.4 Architechture Evolution

Sự ra đời của Signals → đánh giấu dịch chuyển về mặt kiến trục của Angular

| Đặc điểm architechture | Mô hình truyền thống (`Zone.js`) | Mô hình hiện đại (Signals - Granular Updates) |
| --- | --- | --- |
| Cơ chế cốt lõi  | Dựa trên thư viện `Zone.js`  thực hiện monkey-patch tất cả các asynce tasks (click, setTimeout, API) | Dựa trên Fine-grained reactivity của chính các dữ liệu Signals |
| Phạm vi quét thay đổi | Top-down Check: Toàn bộ cây Component từ trên xuống dưỡi để so sánh giá trị cũ/mỡi của mọi biến | Targeted Update: Chỉ định vị chính xác điểm thay đổi |
| Granularity | Component-level: Khi một biến nhỏ đổi → toàn bộ Component (có thể các con của nó) bị quét lại | Dome-node-level: signal truyền thẳng từ dữ liệu đến đúng vị trí hiển thị trên DOM vật lý → vẽ lại đúng pixel  |

Mô hình cũ với `Zone.js` : Giống như bảo vệ đi kiểm tra từng phòng trong toàn nhà xem có ai đổi đồ đạc không

Mô hình mới `Signals` : chỉ phòng nào có sự thay đổi thì báo ngay tại phòng đó

# 2. Dependency Injection (DI) & Services

## 2.1 Dependency Injection - DI

DI là một design partten mà trong đó một class không tự khởi tạo các dependencies của nó, mà yêu cầu inject từ một bên ngoài vào.

Ví dụ trực quan:

- Khi muốn tạo class `Car` → Cần động cơ class `Engine` để chạy
- Thông thường class `Car` tự tìm cách tạo ra instance `Engine` . Nếu trong tương lại muốn thay đổi loại động cơ (ví dụ từ xe xăng → xe điện) → phải sử code trực tiếp bên trong class `Car`
- Sử dụng Dependency Injection: `Car` không tự tạo động cơ, thay vào đó động cơ sẽ được ‘inject’ vào class `Car`  từ bên ngoài → dễ dàng thay động cơ khác nhau và không cần thay đổi cấu trúc của `Car`

Trong Angular, DI được gọi là **Angular Injector.** Khi một Component hoặc Service yêu cầu một dependency → Angular Injector đứng ra tìm kiếm, khởi tạo và inject instance đó vào vị trị cần thiết.

### Tại sao không được lạm dụng `new` bên trong Component?

Ví dụ khi cần sử dụng `UserService` , việc sử dụng `private userService = new UserService()` bên trong Componenet được coi là **Anti-parttern (Bad practice)** vì:

- **Tight Coupling:** Component sẽ phụ thuộc hoàn toàn vào structure của `UserService` → nếu `UserService` thay đổi contructor() → phải tìm tất cả Component có `new UserService()` để sửa
- **Testing Block:** khi viết Unit Test cho Component, cần giả lập Mock Data dữ liệu từ Service để tránh gọi API thật → nếu dùng `new` , Service không thể thay thế bằng một MockService được
- **State Sharing:** mỗi lần gọi `new UserService()` , JS sẽ cấp phất 1 vùng nhớ mới cho một **instance** mới → mất đi khả năng chia sẻ data chung giữa các Components (VD: lưu thông tin cart, user đăng nhập)
- 

## 2.2 Services

Service trong Angular là một class TypeScript, cho phép inject một instance của class đó như một dependency.

### **Các loại Service:**

- **Data clients:** trừu tượng hóa việc lấy API
- **State management**
- **Authentication & Authorization**
- **Logging & Error handling**
- **Event handing & dispatch**
- **Utility functions**

```tsx
//VD:
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged: ', {
      category,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}

//Use
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsLogger } from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `<a href="#" (click)="navigateToDetail($event)">Detail Page</a>`,
})
export class Navbar {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

## 2.3 Provider Scopes

`providedIn: 'root'` vs `providers: [...]` 

DI system của Angular hoạt động theo cơ chế **Hierarchical Injection** (phân cấp) → tùy thuộc vào nơi khai báo (provide) thì phạm vi hoạt động và vòng đời của Service sẽ khác nhau hoàn toàn.

### `@Injectable({ providedIn: 'root' })`  (Singleton Service)

- Đây là cách khai báo mặc định và được khuyên dùng → Khai báo với Angular rằng Service này thuộc về Root Injector (Tầng cao nhất của ứng dụng)
- Phạm vi hoạt động toàn hệ thống → chỉ tồn tại DUY NHẤT MỘT Instance (Singleton) của Service này
- Tree-shacking: nếu cấu hình `providedIn: 'root'`  nhưng trong toàn bộ src code không có nơi nào dùng Service này → Angular compiler tự động loại bỏ (tree-shake) hoàn toàn file Service ra khỏi file build cuối cùng - `bundle.js`

### `providers: [...]`

- Khi đưa Service vào mảng `providers`  của một `@Componnet` → tạo ra injector cục bộ gắn liền với Componnet đó (Element Injector)
- Phạm hoạt động: mỗi khi Component được mount → Angular tạo ra một instance hoàn toàn mới của Service dành riêng cho Component đó và các Component con của nó
- Khi Component unmount - ngOnDestroy → instance của Service bị giải phóng khỏi bộ nhớ (Garbage Collected)
- Khi nào nên dùng: Khi muốn tạo ra các khối xử lý hoàn toàn độc lập, không muốn chia sẻ trạng thái ra bên ngoài
- VD: 1 Componenet Form nhập liệu có tính năng “Hủy/Hoàn tác” → tạo một `FormStateService`  đưa vào providers của Component đó → user tắt Form → Service tự chết → dọn dẹp bộ nhớ

## 2.4 Modern Injection `inject()`  (Angular 14+)

### Cách cũ - Constructor Injection

```tsx
@Component({
	selector: 'app-profile',
	template: '...'
})
export class ProfileComponent implements OnInit {
	//khai báo tường minh trong constructor()
	constructor(private userService: UserService) {}
	
	ngOnInit(){
		this.userService.getProfile();
	}
}
```

### Cách mới - Modern `inject()` Function

```tsx
@Component({
	selector: 'app-profile',
	template: `...`,
	standalone: true //Phổ biến trong kiến trúc Standalone
})

export class ProfileComponent implements OnInit {
//Khởi tọa trực tiếp như một attribute của class không cần 
	private userService = inject(UserService);
	
	ngOnInit(){
		this.userService.getProfile();
	}
}
```

### Tại sao hàm `inject()` ra đời và ưu điểm vượt trội của nó là gì?

1. **Code ngắn gọn, sạch sẽ hơn:** không phải viết một hàm `constructor`  chỉ để khai báo danh sách các Service 
2. **Hỗ trợ Class Inheritance - kế thừa:** trước đó nếu có một `BaseComponent` chứa 3 services trong constructor, và một `ChildComponent extends BaseComponent`→ `ChildComponent` bắt buộc phải viết lại constructor và gọi hàm `super(service1, service2, service3)`→ `BaseComponent` bổ sung thêm service thứ 4 → ối dồi ôi. Với `inject()`, component con chỉ cần `extends` là tự động kế thừa, hoàn toàn không cần đụng vào `super()`.
3. **Sử dụng linh hoạt ngoài Class (Functional Ng-gains):** Hàm `inject()` có thể hoạt động bên trong các hàm thuần túy (Functions) chứ không ép buộc phải nằm trong Class như Constructor → của việc viết **Custom Functions / Functional Router Guards / Functional Interceptors** cực kỳ gọn nhẹ.
    - *Ví dụ:*  Có thể tạo một hàm kiểm tra quyền truy cập Router chỉ bằng 2 dòng code sử dụng `inject(AuthService)` thay vì phải tạo nguyên một Class Guard cồng kềnh như trước đây.

### *Lưu ý:

Hàm `inject()` chỉ có thể được gọi ở nơi mà Angular hiểu được context inject dữ liệu - Inject Context:

- Khi khai báo attribute của Class
- Bên trong `constructor()`
- Bên trong các hàm Factory Providers.

*Không thể* gọi `inject()` bên trong các Lifecycle hook muộn như `ngOnInit()` , `ngAfterViewInit()` hay các function xử lý sự kiện click `onClik()` 
→ hệ thống sẽ báo lỗi `NG203: inject() must be called from an injection context`

# 3. Forms in Angular

Angular cung cấp **hai cách** để xử lý input từ user thông qua form:

- **Reactive Forms**
- **Template-driven Forms**

Cả hai cách tiếp cận này đều:

- Lắng nghe các sự kiện nhập liệu từ giao diện (view)
- Kiểm tra tính hợp lệ của dữ liệu (validation)
- Tạo form và mô hình dữ liệu (data model)
- Cung cấp cách theo dõi sự thay đổi của dữ liệu

### Reactive Forms

- Cung cấp quyền truy cập **trực tiếp và rõ ràng** vào form object model
- So với template-driven forms:
    - Dễ mở rộng (scalable)
    - Tái sử dụng tốt (reusable)
    - Dễ kiểm thử (testable)
- Phù hợp khi:
    - Form là phần quan trọng trong ứng dụng
    - Đang dùng các pattern reactive (RxJS, signals, etc.)

→ **Kết luận:** Nên dùng khi project lớn, logic phức tạp

### Template-driven Forms

- Dựa vào **directive trong template (HTML)** để tạo và thao tác với form model
- Phù hợp cho các form đơn giản
- Ưu điểm: Dễ dùng, nhanh chóng tích hợp
- Nhược điểm: Khó mở rộng khi ứng dụng lớn

**→ Kết luận:** Nên dùng khi form nhỏ, ít logic

|  | Reactive Forms | Template-driven Forms |
| --- | --- | --- |
| Khởi tạo form model | Tường minh (viết trong component class) | Ngầm định (Angular tự tạo qua directive) |
| Data model | Có cấu trúc, immutable (ít bị thay đổi trực tiếp) | Không cấu trúc rõ ràng, mutable |
| Luồng dữ liệu | Đồng bộ (synchronous) | Bất đồng bộ (asynchronous) |
| Validation | Dùng function | Dùng directive |

### Base classes

Cả reactive và template-driven forms đều được xây dựng dựa trên các lớp cơ bản sau:

| **FormControl** | Theo dõi giá trị và trạng thái validation của một control đơn lẻ |
| --- | --- |
| **FormGroup** | Theo dõi giá trị và trạng thái của một nhóm các form control |
| **FormArray** | Theo dõi giá trị và trạng thái của một mảng các form control |
| **ControlValueAccessor** | Tạo cầu nối giữa FormControl của Angular và các phần tử DOM có sẵn |

### Code

```tsx
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-reactive-favorite-color',
  template: ` Favorite Color: <input type="text" [formControl]="favoriteColorControl" /> `,
  imports: [ReactiveFormsModule],
})
export class FavoriteColorReactive {
  favoriteColorControl = new FormControl('');
}
```

```tsx
import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-template-favorite-color',
  template: ` Favorite Color: <input type="text" [(ngModel)]="favoriteColor" /> `,
  imports: [FormsModule],
})
export class FavoriteColorTemplate {
  favoriteColor = signal('');
}
```

### Data flow

#### In Reactive Forms

**View-to-model:** User types in the input
→ form `<input>`fires ‘`input`’ event
→ The `ControlValueAccessor` calls `setValue()` on the `FormControl` instance
→ `FormControl` fires a ‘`valueChanges`’ event to observers
→ Observers

**Model-to-view:** User call `favoriteColorControl.setValue()` 
→ updates the `FormControl`  value
→ `FormControl` instance fires ‘valueChanges’ event → observers
→ And `FormControl` notifies `ControlValueAccessor` 
→ Update the value of `<input>`

#### In Template-driven Forms

Trong template-driven forms, mỗi element được liên kết với 1 **directive** quản lý form model một cách nội bộ.

**View-to-model:** User types in the input 
→ `<input>` fires ‘input’ event
→ `ControlValueAccessor` calls `setValue()` on `FormControl` instance → Fires ‘valueChanges’ event to Observers
→ `ControlValueAccesor` also calls `viewToModelUpdate()`  → `ngModel` → emit an `ngModelChange`  event → Component updates value of the **two-way-bound → Two-way binding**

**Model-to-view:** Khi giá trị thay đổi trong component
→ change detection
→ `ngOnChanges` được gọi trên instance của directive `NgModel` 
→ `ngOnChanges()` đưa một async task vào queu → thiế lập giá trị cho `FormControl` 
→ change detection done
→ Instance FormControl emits ‘valueChanges’ event → observers
→ ControlValueAccessor cập nhật phần tử input của form

# **4.Reactive Forms (Model-driven Forms)**

## 4.1 Core Building Blocks

Reactive Forms của Angular được xây đựng từ các class core extends từ `AbstractControl` 

- **FormControl:** là phần tử độc lập nhỏ nhất (input, checkbox, select). Quản lý value, validity state, và lịch sử tương tác.
- **FormGroup:** Là một tập hợp nhóm các phần tử `FormControl` , `FormArray` hoặc `FormGroup` con khác dưới dnajg Object Key-value. Valid state của một `FormGroup` phụ thuộc hoàn toàn vào state của các thành phần bên trong
- **FormBuilder:** Là một Utility Service giúp devs viết code gọn hơn khi khởi tạo các cấu trúc form lớn thay vì `new FormControl()` hay `new FormGroup()`
- **NonNullableFormBuilder:** Khi thực hiện  lệnh `form.reset()` , mặc định các form control sẽ bị gán lại giá trị là `null` . Để ngăn chăn điều này và giữ nguyên data type gốc (ví dụ: `‘’` thay vì `null`). `NonNullableFormBuilder` → ép các thuộc tính luôn có giá trị không thể mang giá trị `null`

## 4.2 Form validation & State

#### Built-in Validators:

- `Validators.required` : bắt buộc
- `Validators.minLength(n)` / `maxLength()` : Giới hạn số lượng ký tự
- `Validators.parttern(regex)` : Kiểm tra định dạng dữ liệu dựa trên regex

#### State attribute:

- `.valid` : `true`  khi toàn bộ validation rule đều thỏa mãn
- `.invalid` : `true` khi có bất kỳ validation error nào
- `.touched` : `true` ngay khi user click vào form control rôi bluer, bất kể có nhập gì hay không. Thường dùng để hiển thị thông báo lỗi sau khi user bỏ qua
- `.dirty` : `true` khi user đã thực hiện thay đổi giá trị gốc bên trong form control
- `.errors` : Chứa một đối tượng chứa chi  tiết các error code (VD: `{required: true, minLength: {requiredLength: 5, actuallLength: 2}}`). Thuộc tính này sẽ trả về `null` nểu ô đó hoàn toàn hợp lệ

## 4.3 Dynamic Structures với FormArray

FormArray là class đặc biệt dùng để quản lý 1 danh sách các ô nhập liệu hoặc một mảng các nhóm form có số lượng dòng thay đổi.

- Ứng dụng: làm các tính năng như: Danh sách sdt, form thêm nhiều sản phẩm → mỗi dòng là một FormGroup (gồm tên, số lượng, giá,…).
- Cơ chế: Khác với `FormGroup`  định danh phần tử con bằn key-value, `FormArray` định danh và quản lý qua index. Cung cấp các built-in methods: `.push()` , `.insert()` , `.removeAt()` , `.clear()`

## 4.4 Custom & Async Validators

Khi các validators có sẵn không đáp ứng được yêu cầu phức tạp → 

1. Synchronous Validator:
- Là một function nhân vào một `AbstracControl` → kiểm tra dữ liệu ngay trên RAM
- Trả về `null` nếu dữ liệu valid, hoặc một đối tượng `ValidationErrors` nếu dữ liệu invalid
- VD: Kiểm tra mật khẩu nhập lại có khớp với mật khẩu ban đầu không?
2. Asynchronous Validator:
- Là một function xủ lý các tác vụ cần thời gian chờ (async) → trả về bắt buộc phải bọc trong một `Observable`  hoặc một `Promise` 
- Khi Async Validator đang chạy, state của Form → ‘PENDING’
- VD: Kiểm tra Username hoặc Email đã tồn tại trong DB chưa bằng cách call API request để kiểm tra

## 4.5 Reactive Streams

Một trong những điểm vượt trội của Reactive-Forms so với Template-driven Forms là cũng cáp các luồng dữ liệu - Streams dưới dạng **RxJS Observable** để devs lắng nghe các biến động của form trong thời gian thực

A. `valueChanges` :

- Trả ra giá trị với nhất của toàn một form model hay một input đơn lẻ ngay sau khi user vừa gõ bất kỳ ký tự nào hoặc khi có lệnh gán lại giá trị mới
- Ứng dụng: Auto-completement/Live Search, kết hợ với toán tử RxJS (như `debounceTime` , `distincUntilChanged` , `switchMap` ) → tránh spam API, hoặc Auto-save drafts

B. `statusChanges` :

- Phát ra trạng thái hợp lệ mới nhất dưới dạng string: `VALID` , `INVALID` , `PENDING` (khi Async Validator chạy) hoặc `DISABLE`
- Ứng dụng: Theo dõi trạng thái Form để tự động log, thay đổi giao diện theo thời gian thực, hiện thị quá trình loading khi có Async Validator, bật/tắt bubtton Submit