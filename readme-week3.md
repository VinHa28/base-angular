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