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

# Lab 2.6:
### Câu hỏi:
Giải thích điều gì sẽ xảy ra với hiệu năng của toàn bộ ứng dụng web nếu người dùng liên tục bấm nút Ẩn/Hiện component này 50 lần mà không cấu hình hàm hủy trong ngOnDestroy? 
### Trả lời:
1. Nếu người dùng thực hiện bật/tắt liên tục 50 lần mà không xóa tiến trình chạy ngầm, hệ thống sẽ rơi vào tình trạng ****Memory Leak ****
- Sẽ có 50 tiến trình chạy ngầm của `setInterval` cùng tồn tại song song trong nhớ RAM và chạy độc lập.
- Tab Console sẽ in ra liên tục thông báo  50 log/giây

# Lab 2.7
### Câu hỏi:
Tại sao dữ liệu được nhét từ ngoài vào qua `<ng-content>` luôn bị undefined ở hàm `ngOnInit`, và tại sao hàm `ngAfterViewInit`cũng không phải là nơi lý tưởng nhất để bắt đầu xử lý dữ liệu này?
### Trả lời:
1. dữ liệu được truyền qua `<ng-content>`  luôn bị undefined ở `ngOnInit`  vì `ngOnInit` chạy khi Angular chỉ mới khởi tạo xong các thuộc tính `@Input` nội bộ của chính `AppTabsComponent` 
- Tại thời điểm này, DOM lồng từ bên ngoài (`<app-tab-item>`) chưa được xử lý vào trong vị trí của thẻ `<ng-content>` → `@ContentChild` không thể lấy được  phần tử nào để gán vào `ElementRef`, dẫn tới giá trị của `tabItem` luôn là `undefined`.
2. Tại sao hàm `ngAfterViewInit`cũng không phải là nơi lý tưởng nhất để bắt đầu xử lý dữ liệu này?
- Sai mục đích`ngAfterContentInit` là để báo hiệu toàn bộ các content được nhét từ bên ngoài vào qua **`<ng-content>`** đã được xử lý và sẵn sàng. Trong khi đó, `ngAfterViewInit` lại là báo hiệu giao diện View Template của chính component đó vẽ xong.

# Lab 2.8
### Câu hỏi:
Hàm `ngAfterContentChecked` chạy khi nào? Tại sao nó lại đáp ứng được việc theo dõi sự thay đổi dữ liệu liên tục tốt hơn hàm ngAfterContentInit?
### Trả lời:
1. Hàm `ngAfterContentChecked` chạy ngay sau `ngAfterContentInit` ở lần khởi tạo đầu tiên. Sau đó, tự động chạy lại liên tục trong tất cả các chu kỳ Change Detection. Bản chất: cứ khi nào có sự kiện có khả năng làm biến đổi dữ liệu truyền vào `<ng-content>` → hàm này chạy lại ở component con
2. So sánh với `ngAftercontentInit`

| Đặc điểm | `ngAfterContentInit` | `ngAfterContentChecked` |
| --- | --- | --- |
| Tần xuất | Chạy duy nhất 1 lần trong component lifecycle | Chạy nhiều lần theo mọi chu kỳ Change Detection |
| Phản ứng | Nếu sau khi render, component cha có sự kiện hàm này không chạy lại | Lập tức bắt được DOM mới để tính toán lại layout |
| Ứng dụng | Thiết lập cấu hình ban đầu | Phù hợp cho các tác vụ đo đạc kích thước, giao diện động |

# Lab2.9
### Câu hỏi:

ExpressionChangedAfterItHasBeenCheckedError khi bạn cố tình đổi giá trị hiển thị trong hàm ngAfterViewChecked? Cơ chế bảo vệ dữ liệu của Angular hoạt động như thế nào?

### Trả lời

1. ExpressionChangedAfterItHasBeenCheckedError: Sau khi Angular đã render view xong
→ `ngAfterViewChecked()`  chạy
→ thay đổi giá chị binding (`loadingState`) đã được check trước đó 
→ kiểu “trước khi check là 0, sau check lại là 1” mà view đã render xong r 
→ lỗi
→ cách fix:
- bắt chạy detect change thêm một lần nữa với method  `detectChange()`  của `ChangeDetectorRef` (lưu ý ngAfterChange chạy vô tận nếu detectChange liên tục → cần bắt điều kiện `if` khi giá trị `loadingState` thay đổi)
- sử dụng `setTimeout` vì Zone.js sẽ báo các task bất đồng bộ cho Angular → trigger Change Detection
- sử dụng Signal (hoạt động gần như state của React nhưng chỉ thay đổi UI phụ thuộc vào singal không phải rerender lại toàn bộ component) 
2. Cơ chế bảo vệ của Angular:
Dữ liệu (Component) → Template → DOM
- ở dev mode Angular chạy 2 lượt, lượt 1 đọc dữ liệu → vẽ ra DOM. Lượt 2 xem giá trị thực tế ở DOM có khớp với giá trị trong code không → nếu khác sẽ báo lỗi cảnh báo
- Tầm quan trọng: tránh vòng lặp Dữ liệu đổi → DOM đổi → kích hoạt lifecycle → dữ liệu lại đổi. Đảm bảo những gì người dùng nhìn thấy là những gì logic code đang chạy.

# Lab2.10
### Câu hỏi:

Hàm `ngDoCheck` khác gì so với `ngOnChanges` khi làm việc với mảng? Khi nào chúng ta bắt buộc phải dùng đến ngDoCheck?

### Trả lời

1. Khác biệt của `ngDoCheck`  và `ngOnChanges` :

|  | `ngOnChanges` | `ngDoCheck` |
| --- | --- | --- |
| Cơ chế | chỉ chạy khi reference của biến `@Input` thay đổi (ví dụ gán mảng mới, dùng spread) | Chạy liên tục sau mỗi chu kỳ Change Detection (click, asynce task, gõ phím, … ) |
| bắt thay đổi | không bắt được .push(), .pop(), … vì không phải thay đổi reference | bắt được toàn bộ thay đổi + kết hợp với `IterableDiffer`  |
| Hiệu năng | Cao, tối ưu, chỉ so sánh địa chỉ ô nhơ `===`  | Cẩn thận khi dùng vì chạy htuonwgf xuyên |
1. Dùng `ngDoCheck`  khi:
- Theo dõi thay sâu của Reference Type (Array/Object): khi viết componenet dùng chung, không thể luôn tạo Object hay mảng mới (`[…]`) → dùng `ngDoCheck`  
- Custome Change Detection: chủ động kích hoạt check, vẽ lại giao diện dựa trên logic tự định nghĩa
- Theo dõi biến thông thương qua `@Input` : theo dõi thay đổi của một biến phụ thuộc vào hành vi bất định của người dùng, không qua luồng dữ liệu Cha-Con