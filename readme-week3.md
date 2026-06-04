# Lab 3.1

### Câu hỏi:

Hãy giải thích sự khác biệt về hành vi và cú pháp khi sử dụng phương thức `.set()` và phương thức `.update()` của một Writable Signal. Khi nào nên dùng `.set()`, khi nào nên dùng `update()`

### Trả lời:

`.set()` — gán giá trị trực tiếp, ghi đè giá trị cũ

```tsx
cartItems.set(MOCK_DATA);
cartItems.set([]);
```

`.update()` — cập nhật giá trị dựa trên giá trị cũ

```tsx
this.cartItems.update((currentItems) => currentItems.filter((item) => item.id != productId));
```

Khi nào dùng?

```tsx
//.set()  khi giá trị mới độc lập với giá trị cũ
clearCart():void {
	this.cartItems.set([])
}
//.update() khi giá trị mới phụ thuộc giá trị cũ
updateQuantity(id: number, qty: number):void {
	this.cartItems.update(current => current.map(item => item.id == id ? {...item, quantity: qty} : item));
}
```

# Lab 3.2

### Câu hỏi:

Bộ nhớ đệm (Caching/Memoization) của computed() hoạt động như thế nào? Điều gì xảy ra nếu bạn cố tình sử dụng các câu lệnh làm thay đổi giá trị của một Signal khác (gây write operation) ngay bên trong một hàm effect() mà không cấu hình bổ sung?

### Trả lời:

`computed()` Không tính lại nếu các signal dependencies chưa thay đổi 

```tsx
const count = signal(1);
const doubled = computed(() => {
  console.log('computing...'); // chỉ log khi count thay đổi
  return count() * 2;
});

doubled(); // log: "computing..." → trả về 2
doubled(); // KHÔNG log — trả về 2 từ cache
doubled(); // KHÔNG log — trả về 2 từ cache

count.set(5); // signal thay đổi → cache invalidated

doubled(); // log: "computing..." → trả về 10
doubled(); // KHÔNG log — trả về 10 từ cache
```

Mặc định Angular **ném lỗi** nếu gọi `.set()` hay `.update()` bên trong `effect()`

```tsx
const count = signal(0);
const double = signal(0);

effect(() => {
  double.set(count() * 2); // ❌ lỗi runtime
});

// Error: NG0600: Writing to signals is not allowed in a `computed` or
// an `effect` by default.
```

Tại vì khi này sẽ tạo vòng lặp vô hạn:
cout thay đổi → effect chạy → double.set() → cout thay đổi → effect chạy → …