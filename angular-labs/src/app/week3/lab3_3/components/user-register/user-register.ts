import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchPasswordValidator, noWhitespaceValidator, usernameExistsValidator } from '../../validators/validators';

@Component({
  selector: 'app-user-register',
  imports: [ReactiveFormsModule],
  templateUrl: './user-register.html',
})
export class UserRegister {
  private formBuilder = inject(FormBuilder);

  userRegisterForm = this.formBuilder.group(
    {
      username: ['', [Validators.required], [usernameExistsValidator()]],
      fullName: ['', [Validators.required, noWhitespaceValidator]],
      email: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/)],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchPasswordValidator }, // cross-field validator cho cả group
  );

  get f() {
    return this.userRegisterForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.userRegisterForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit() {
    if (!this.userRegisterForm.valid) {
      this.userRegisterForm.markAllAsTouched();
    } else {
      console.log(this.userRegisterForm.value);
    }
  }
}
