import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { error } from 'console';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  mergeMap,
  Observable,
  of,
  switchMap,
} from 'rxjs';

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
          this.searchResults = results;
          //Phải có detech changes ở đây mới cập nhật được bên trong ul | có thể dùng asynce pipe
          this.cdt.detectChanges();
        },
        error: (error) => console.log('Lỗi khi tìm kiếm: ', error),
      });
  }
}
