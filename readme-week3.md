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

# Lab 3.3

### Câu hỏi:

Phân biệt ý nghĩa của 4 trạng thái kiểm tra biểu mẫu sau trong Angular Forms: `.touched` vs `.untouched`, và `.dirty` vs `.pristine`.

### Trả lời:

1. `.touched` vs `.untouched` :
- `.touched` : `true` ngay sau khi user dùng click → focus → blur. 
- `.untouched` : `true`  khi user chưa bao giờ click vào ô input đó hoặc có focus nhưng chưa blur. Khi `.touched = true`  ⇒ `.untouched = false` 
2. `.dirty` vs `.pristine` :
- `.dirty` : `true` khi user thay đổi giá trị. Dùng để kiểm tra xem user đã thực sự thay đổi bất kỳ thông tin nào trên form chưa. Thường ứng dụng cho *“Bạn có chắc rời đi khi chưa lưu thay đổi?”
- `.*pristine` : `true` nếu giá trị hoàn toàn chưa bị người dùng chỉnh sửa kể từ lúc form được khởi tạo. Khi `.dirty` thành `true`  thì `.pristine` lập tức thành `false`

# Lab 3.4

Khi viết một hàm Custom Validator cho một Control đơn lẻ so với việc viết một Cross-field Validator bọc cho cả một Group, cấu trúc dữ liệu nhận vào của hàm (AbstractControl) có điểm gì khác nhau?

### Trả lời:

Mặc dù cả 2 loại hàm Sigle-field và Multi-field (Cross-field Validator) đều nhận vào tham số `AbstractControl` nhưng bản chất **runtime instance** của dữ liệu truyền vào là khác nhau:

|  | Custom Validator cho Control đơn lẻ | Cross-field Validator cho Group |
| --- | --- | --- |
| Bản chất thực thế của đối tượng | `FormControl` đại diện cho một input duy nhất | Làm một `FormGroup` hoặc `FormArray` đại diện cho tập hợp nhiều input |
| Vị trí khai báo | gắn trong validator array của từng Control đơn lẻ
VD: `fullName:['', [noWhitespaceValidator]]`  | Gắn trong thuộc tính validators của config object cấu trúc tầng trên
VD: `formBuilder.group({...}), {validators: matchPasswordValidator}` |
| Cách truy xuất dữ liệu trong hàm | sử dụng `control.value` để lấy giá trị  | sử dụng `control.get('ten_control)` để trỏ xuống các thành phần con → lấy giá trị `control.get('pasword')?.value` |
| Tác động của error state | `ValidationErrors` nếu có sẽ đẩy trực tiếp vòa `.errors` của chính `FormControl` → input đó `invalid`  | Lỗi nằm ở `FormGorup` → toàn bộ Form bị `invalid` . Để hiển thị lỗi ở từng ô inpu → can thiệp thủ công: `confirmPassword.setErrors(...)` |