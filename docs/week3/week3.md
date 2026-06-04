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