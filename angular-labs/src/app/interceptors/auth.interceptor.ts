import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //Lấy token từ LocalStorage
  const token = localStorage.getItem('accessToken');

  // Neu token existed -> clone request và attrach vào header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Atuhorization: `Bearer ${token}`,
      },
    });

    console.log('AuthInterceptor: attached token into request');
    return next(clonedReq);
  }
  console.log('AuthInterceptor: Token not found, gui lai request goc');

  return next(req);
};
