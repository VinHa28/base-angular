import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // inject Router ngay trong môi trường Functional
  const router = inject(Router);

  // Chuyển tiếp request và đặt "bẫy" lắng nghe luồng response trả về bằng pipe
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Kiểm tra nếu lỗi trả về từ máy chủ Backend
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
          case 403:
            console.warn('Hệ thống phát hiện lỗi bảo mật:', error.status);
            alert('Phiên đăng nhập hết hạn hoặc bạn không có quyền truy cập!');

            // Tự động điều hướng người dùng về trang login
            router.navigate(['/login']);
            break;

          case 500:
            console.error('Hệ thống phát hiện lỗi phía máy chủ: 500');
            alert('Máy chủ đang bảo trì, vui lòng quay lại sau!');
            break;

          default:
            console.error(`Mã lỗi không xác định: ${error.status}`, error.message);
            break;
        }
      }

      // Ném lỗi đi tiếp để Component nếu cần thì vẫn bắt lại được (Giải thích ở Phần 2)
      return throwError(() => error);
    }),
  );
};
