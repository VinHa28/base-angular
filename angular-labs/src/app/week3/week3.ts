import { Component } from '@angular/core';
import { CartLisst } from './lab3_1/components/cart-list/cart-list';
import { UserRegister } from './lab3_3/components/user-register/user-register';
import { CvBuilder } from './lab3_6/components/cv-builder/cv-builder';
import { CurrencyConverter } from './lab3_7/components/currency-converter/currency-converter';

@Component({
  selector: 'app-week3',
  standalone: true,
  imports: [CartLisst, UserRegister, CvBuilder, CurrencyConverter],
  templateUrl: './week3.html',
})
export class Week3 {}
