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
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return of(control.value).pipe(
      delay(2000), // Hoãn lại 2 giây để giả lập mạng chậm
      map((username) => {
        const usernameLower = username.trim().toLowerCase();
        // Nếu người dùng nhập vào 'admin' hoặc 'root'
        if (usernameLower === 'admin' || usernameLower === 'root') {
          return { usernameExists: true }; // Trả về object lỗi
        }
        return null; // Hợp lệ
      }),
    );
  };
}
