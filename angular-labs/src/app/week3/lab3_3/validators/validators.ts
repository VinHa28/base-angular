import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  // Nếu null hoặc undefined thì để required xử lý
  if (value == null) return null;
  // Trim rồi kiểm tra rỗng
  if (value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}

export const matchPasswordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (password.value === confirmPassword.value) {
    // Xóa lỗi cũ nếu có
    if (confirmPassword.hasError('passwordMismatch')) {
      delete confirmPassword.errors?.['passwordMismatch'];
      // Gắn lỗi con FormControl
      if (!Object.keys(confirmPassword.errors || {}).length) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }
  confirmPassword.setErrors({ passwordMismatch: true });
  return { passwordMismatch: true };
};

export function usernameExistsValidator(): AsyncValidatorFn {
  // 1 Async Validator bắt buộc phải trả về một hàm nhận vào một control
  // và trả về 1 Observable hoặc một Promise
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    //Hàm này trả về Observable phát ra giá trị là VadiationErrors hoặc null - nếu khồn có lỗi validation
    if (!control.value) return of(null); // operator of() -> tạo một Observable phát ra null

    return of(control.value).pipe( // biến giá trị control.value -> observable | pipe
      delay(2000), // delay 2s sau khi user dừng gõ
      map((username) => { // biến đổi dữ liệu
        const usernameLower = username.trim().toLowerCase();

        if (usernameLower === 'admin' || usernameLower === 'root') {
          return { usernameExists: true }; 
        }
        return null;
      }),
    );
  };
}
