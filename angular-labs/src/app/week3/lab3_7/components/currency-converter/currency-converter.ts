import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-currency-converter',
  imports: [ReactiveFormsModule, CurrencyPipe],
  standalone: true,
  templateUrl: './currency-converter.html',
  styleUrl: './currency-converter.css',
})
export class CurrencyConverter implements OnInit {
  private formBuilder = inject(FormBuilder);

  converterForm!: FormGroup;
  convertedResult: number = 0;

  private exchangeToUSD: { [key: string]: number } = {
    USD: 1,
    EUR: 1.16,
    CNY: 0.15,
    JPY: 0.0062,
    VND: 0.000038,
  };
  symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    CNY: '¥',
    JPY: '¥',
    VND: 'đ',
  };

  ngOnInit(): void {
    this.converterForm = this.formBuilder.group({
      amount: [0, [Validators.required, Validators.min(0)]],
      sourceCurrency: ['USD', Validators.required],
      targetCurrency: ['VND', Validators.required],
    });
    this.listenToValueChanges();
  }

  private listenToValueChanges(): void {
    this.converterForm.valueChanges.subscribe((formValue) => {
      console.log('Luồng valueChanges bắt được giá trị mới:', formValue.amount);

      // if (formValue.amount !== null) {
      //   this.converterForm.patchValue(
      //     {
      //       amount: formValue.amount + 1,
      //     },
      //     { emitEvent: false },
      //   );
      // }

      this.convert(formValue);
    });
  }

  private convert(formValue: any): void {
    const { amount, sourceCurrency, targetCurrency } = formValue;

    if (amount === null || amount === undefined || amount < 0) {
      this.convertedResult = 0;
      return;
    }

    if (sourceCurrency === targetCurrency) {
      this.convertedResult = amount;
    }

    const amountInUSD = amount * this.exchangeToUSD[sourceCurrency];

    this.convertedResult = amountInUSD / this.exchangeToUSD[targetCurrency];
  }
}
