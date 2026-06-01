# Lab 2.5:

## Câu hỏi:

1. Hãy giải thích hiện tượng xảy ra ở Component Con khi bấm Nút 1 (Sửa trực tiếp thuộc tính) và Nút 2 (Gán Object mới). Tại sao ở Nút 1, dữ liệu JSON trên HTML vẫn đổi nhưng dòng chữ thông báo logic trong ngOnChanges lại đứng yên?
2. Dựa vào kiến thức về Vùng nhớ Tham chiếu (Reference Type) trong JavaScript và cơ chế kiểm tra dữ liệu thay đổi của Angular, hãy nêu giải pháp chuẩn khi muốn thêm một phần tử mới vào một mảng @Input() list: string[] để ngOnChanges có thể bắt được sự kiện.

## Trả lời

Khi bấm nút “Tạo Object mới - Good Practice” → statusMessage ở component con mới thay đổi

1. Giải thích:
- Khi bấm nút 1 (Sửa trực tiếp) thay đổi JSON trên HTML mà `ngOnChanges`  đứng yên vì:
- Angular kiểm tra dữ liệu của các thuộc tính `@Input()`  có thay đổi không với `===` 
- userProfile là Object → kiểu tham chiếu → `===`  so sánh địa chỉ vùng nhớ 
→ khi thay đổi trực tiếp địa chỉ vùng nhớ vẫn giữ nguyên 
→ `ngOnChanges`  đứng yên
- HTML vẫn thay đổi do cơ chế Change Detection
- Khi bấm nút 2 (Gán Object mới) → object mới được tạo → so sánh địa chỉ vùng nhớ khác nhau → thuộc tính `@Input()`  thay đổi → `ngOnChanges()`  chạy
1. Khi muốn thêm một phần tử mới vào một mảng `@Input() list: string[]` để `ngOnChanges`  có thể bắt được sự kiện:
- Thay vì dùng push() chỉ thêm phần tử nhưng địa chỉ vùng nhớ của mảng giữ nguyên → sử dụng toán tử Spread `...` → `this.list = [...this.list, newItem]`