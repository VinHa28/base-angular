import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Chỉ thực hiện lấy token nếu đang chạy trên Trình duyệt (Client)
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('AuthInterceptor: attached token into request');
      return next(clonedReq);
    }
  }

  console.log('AuthInterceptor: Chạy trên Server hoặc không có Token, gửi request gốc');
  return next(req);
};
