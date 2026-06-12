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