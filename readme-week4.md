# Lab 4.1

Câu hỏi: Điều gì sẽ xảy ra với hệ thống Backend và giao diện người dùng nếu thay thế toán tử switchMap bằng toán tử mergeMap trong bài Lab tìm kiếm này?

```tsx
const mockProductService = {
  search: (keyword: string): Observable<string[]> => {
    console.log('Đang gọi API tìm kiếm cho từ khóa: ', keyword);
    return of([`${keyword} 1`, `${keyword} 2`, `${keyword} 3`]);
  },
};

@Component({
  selector: 'app-product-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-search.html',
})
export class ProductSearch implements OnInit {
  searchControl = new FormControl('');
  searchResults: string[] = [];
  private cdt = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        // text is string (type guard), nếu hàm trả về true -> text chắn chắn là string
        filter((text): text is string => text !== null && text.length >= 3),
        distinctUntilChanged(),
        switchMap((keyword: string) => {
          const results = mockProductService.search(keyword);
          return results;
        }),
      )
      .subscribe({
        next: (results) => {
          console.log('Đã gọi api cho keyword: ', results[0]);
          this.searchResults = results;
          //Phải có detech changes ở đây mới cập nhật được bên trong ul | có thể dùng asynce pipe
          this.cdt.detectChanges();
        },
        error: (error) => console.log('Lỗi khi tìm kiếm: ', error),
      });
  }
}

```

### Trả lời:

- Về cơ bản ở bài Lab này không có độ trễ (hoặc độ trễ sẽ bằng nhau) khi tìm kiếm → không có sự chồng chéo giữa các mock request → nên sẽ không thể thấy sự khác biệt

→ Cần fake delay cho 2 keword khác nhau để test thử

```tsx
const mockProductService = {
  search: (keyword: string): Observable<string[]> => {
    console.log('Đang gọi API tìm kiếm cho từ khóa: ', keyword);
    let fakeDelay = 1000; 
    if (keyword === 'app') {
       fakeDelay = 5000; // Bị kẹt mạng, mất 5 giây mới trả về
    } 
    else if (keyword === 'apple') {
       fakeDelay = 500;  // Mạng nhanh, chỉ mất 0.5 giây để trả về
    }

    return of([`${keyword} 1`, `${keyword} 2`, `${keyword} 3`]).pipe(
      delay(fakeDelay)
    );
  },
};

// thay switchMap = mergeMap
```

- Từ đây nếu gõ ‘app’ sau đó đợi 400ms và gõ thêm ‘le’ (apple) → kết quả sẽ là apple nhưng sau đó sẽ nhảy ngược lại là app.

→ Kết quả bị hỗn loạn kết quả phụ thuộc vào request nào xong cuối cùng chứ không phải từ khóa user cần tìm

# Lab 4.2

Câu hỏi: Điểm yếu lớn nhất của toán tử `forkJoin` là gì nếu 1 trong 3 request gặp lỗi? Giải pháp khắc phục là gì?

### Trả lời:

1. Điểm yếu của `forkJoin` : cơ chế “All-or-Nothing” - Được hết hoặc không được gì. Nếu bất kỳ 1 Observable nào nhận lỗi → toàn bộ luồng `forkJoin` bị cancel ngay lập tức → lỗi. Dù 2 request kia thành công nhưng 1 thằng chết → chết hết
2. Giải pháp: phải catch error bằng `catchError` , trong mỗi API call, thêm `cathError(()=>of(null));` → khi 1 api bị lỗi → nó trả về null → `forkJoin` vẫn đợi 2 thằng kia chạy xong rồi trả về kết quả hợp lệ + null


# Lab 4.3

Câu hỏi: Tại sao đối tượng req (HttpRequest) trong Interceptor lại là một đối tượng bất biến (Immutable)? Tại sao chúng ta không thể viết trực tiếp req.headers.set(...) mà bắt buộc phải dùng hàm .clone()?

### Trả lời:

1. Đảm bảo tính nhất quán và an toàn lường dữ liệu - Thread Safty & Predictability:
- Một request có thể đi qua nhiều Interceptors khác nhau → nếu Angular cho phép sửa trực tiếp đối tượng `req`  → một Interceptor đứng trước có thể làm sai dữ liệu quan trọng mà cac Interceptors sau đang cần.
2. Cơ chế hoạt động của `req.headers.set()` thực tế không thay đổi đối tượng cũ:
- hàm `.set()`  tạo ra một instance mới của `HttpHeaders` → nếu dùng `.set()` thì đối tượng `req` sẽ giữnguyên các headers cũ còn header mới sinh ra → Garbage Collector thu hồi vì không có biến nào nhận giá trị
3. Bắt buộc dùng `.clone()`  để kiểm soát sự thay đổi:
- Hàm `.clone()` tạo một shallow coppy của request cũ (coppy nông)
- Đồng thời tiếp nhân các thuộc tính mới để ghi đè lên bản sao đó
→ một đối tượng `HttpRequest hoàn toàn mới clonedReq` → đây tiếp vào `next(clonedReq)`