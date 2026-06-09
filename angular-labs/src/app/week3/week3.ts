import { Component } from '@angular/core';
import { CartLisst } from "./lab3_1/components/cart-list/cart-list";
import { UserRegister } from "./lab3_3/components/user-register/user-register";

@Component({
  selector: 'app-week3',
  standalone: true,
  imports: [CartLisst, UserRegister],
  templateUrl: './week3.html',
})
export class Week3 {}
