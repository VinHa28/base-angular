# HTTP Client & Intercepters

## 1. Asynchronnous HTTP & RxJS Cold Observable

### Config applications với `provideHttpClient()`

Trong Angular với Standalone Architecture, không còn sử dụng `HttpClientModule` của cấu trúc NgModule cũ. Thay vào đó, cấu hình `HttpClient` trực tiếp tại file `app.config.ts` bằng hàm `providenHttpClient()` 

```tsx
import { ApplicationConfig } from "@angular/core";
import { procideHttpClient, withInterceptors } from "@angular/common/http"

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(
			withInterceptors([]) //nơi đnawg ký các Functional Intercepters
		)
	]
}
```

## 2. Tại sao `HttpClient.get() / post()` không chạy nếu thiếu `.subcribe()`

### Cold Observable

Là một loại Observable chỉ bắt đầu sản sinh dữ liệu khi có Subcriber.

Các điểm cốt lõi của Cold Observable

- Lazy: không làm gì cả cho đến khi gọi hàm `.subcribe()`
- Dữ liệu độc lập (Fresh data): Mỗi Subcribe sẽ nhận được một chuỗi dữ liệu hoàn toàn mới và riêng biệt
- Nguồn phát nằm bên trong: Bản thân Observable tự tạo ra và quản lý nguồn dữ liệu (tự khởi tạo mảng, tự gọi API)

VD:

```tsx
import {Observable} from 'rxjs';

const cold$ = new Observable(subcriber => {
	console.log('Nguồn phát được khởi tạo!');
	subcriber.next();
	subcriber.next();
})

cold$.subcribe(val => console.log('Subcriber A:', val));

cold$.subcribe(val => console.log('Subcriber B:', val));
//Nguồn phát được khởi tạo!
//Subcriber A: 1
//Subcriber A: 2

//Nguồn phát được khởi tạo!
//Subcriber B: 1
//Subcriber B: 2
```

Phân biệt nhanh với Hot Observable

|  | Cold Observable (HttpClient, of, from) | Hot Observable (click, subject, websocket) |
| --- | --- | --- |
| Thời điểm phát dữ liệu | Chỉ phát sau khi có người `subscibe` | Phát liên tục bất kể có subcriber hay không |
| Chia sẻ dữ liệu  | Không chia sẻ, mỗi subcriber nhận một dữ liệu riêng | Chia sẻ chung một luồng dữ liệu (Multicast) |
| Sự tương đồng | giống như xem video trên du túp | giống như xem Tivi truyền hình |

Bản chất của RxJS Observables mà `HttpClient`  sử dụng: Các hàm của `HttpClient`  đều trả về một Cold Observable

Lợi ích của việc này:

1. Tiết kiềm tài nguyên: Cho phép cầu hình, pipe, chuẩn bị dữ liệu cho request thoải mái mà không sợ kích hoạt ngầm API quá sớm
2. Reusability: một hàm chứa `HttpClient.get()` có thể được gọi subcribe nhiều lần, mỗi lần subcribe là một request độc lập gửi lên Server.

## 3. Functional Interceptors (Angular 15+)

Từ Angular 15 → sang cơ chế Functional programming. Thay vì viết Class thực thi `HttpOInterceptor` phức tạm cùng cơ chế Dependency Injection kiểu cũ → 1 Interceptor chỉ đơn thuần là một Arrow Function

### Cấu trúc cơ bản của 1 Functional Interceptor

Một Functional Interceptor nhận vào 2 tham số:

- `req: HttpRequest<unknown>` : Object Requet immutable - không thể sửa đổi trực tiếp
- `next: HttpHandlerFn` : Hàm chuyển Request tới mắt xích tiếp theo trong chuỗi Interceptors hoặc gửi tới Server nếu đó là mắt xích cuối

```tsx
import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`Đang gửi request tới URL: ${req.url}`);
  
  // Chuyển tiếp request đi tiếp
  return next(req);
};
```

## 3. Global sercurity & Error handling

Tự động đính kèm Token bảo mật cho mọi API và bắt lấy tất cả các lỗi hệ thống (401, 403, 500) tại một nơi duy nhất.

### Kỹ thuật đính kèm Bearer Token (Auth Interceptor)

Do đối tượng `req` (HttpRequest) trong Angular mang đặc tính **Immutable** (bất biến) để đảm bảo an toàn luồng dữ liệu, bạn **không thể** viết theo kiểu `req.headers.set(...)`. Muốn chỉnh sửa, bạn bắt buộc phải dùng hàm `req.clone()` để tạo ra một bản sao đã được tinh chỉnh.

```tsx
import { HttpInterceptorFn } from '@angular/common/http';

**export const authInterceptor: HttpInterceptorFn = (req, next) => {
	// Giả lập lấy token từ LocalStorage (hoặc một Inject Service)
  const token = localStorage.getItem('accessToken');
  
  // Nếu có token, tiến hành nhân bản và thêm Header Authorization
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq); // Gửi bản mã hóa đi
  }
  // Nếu không có token, cho request gốc đi tiếp
  return next(req);
}**
```

### Thiết lập bẫy lỗi tập trung (Global Error Interceptor)

Bằng cách sử dụng toán tử `catchError` của RxJS trong chuỗi trả về (`pipe`) của `next(req)`, dữ liệu Response khi từ Server quay trở lại app có thể bị "đánh chặn", lọc riêng các lỗi HTTP để xử lý tập trung (như hiển thị thông báo, chuyển hướng trang khi hết hạn token).

```tsx
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Đã có lỗi không xác định xảy ra!';

      if (error.error instanceof ErrorEvent) {
        // Lỗi xảy ra phía Client (mạng lag, lỗi logic code client...)
        errorMessage = `Lỗi Client: ${error.error.message}`;
      } else {
        // Lỗi trả về từ Backend Server (Status code 4xx, 5xx)
        switch (error.status) {
          case 401:
            errorMessage = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!';
            // Logic bổ sung: Điều hướng về trang /login hoặc xóa token cũ
            break;
          case 403:
            errorMessage = 'Bạn không có quyền truy cập vào tài nguyên này!';
            break;
          case 500:
            errorMessage = 'Hệ thống Server đang bảo trì, vui lòng quay lại sau!';
            break;
          default:
            errorMessage = `Mã lỗi: ${error.status}\nNội dung: ${error.message}`;
        }
      }

      console.error('--- LOG LỖI TẬP TRUNG ---', errorMessage);
      
      // Trả lỗi về lại cho Component nơi gọi API nếu chỗ đó cần xử lý riêng biệt thêm
      return throwError(() => new Error(errorMessage));
    })
  );
};
```

### Bước cuối cùng: Đăng ký các Interceptors vào Hệ thống

```tsx
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,   // Thêm token trước
        errorInterceptor   // Bẫy lỗi sau cùng để bao quát toàn bộ luồng
      ])
    )
  ]
};
```