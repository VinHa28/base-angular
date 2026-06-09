import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-cv-builder',
  imports: [MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cv-builder.html',
  styleUrl: './cv-builder.css',
})
export class CvBuilder implements OnInit {
  private formBuilder = inject(FormBuilder);
  cvForm!: FormGroup;

  ngOnInit(): void {
    this.cvForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      workExperiences: this.formBuilder.array([]),
    });

    this.addExperience();
  }

  get workExperiences(): FormArray {
    return this.cvForm.get('workExperiences') as FormArray;
  }

  createNewExperience(): FormGroup {
    return this.formBuilder.group({
      companyName: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get cvF() {
    return this.cvForm.controls;
  }

  isInvalidArray(index: number, controlName: string): boolean {
    const control = this.workExperiences.at(index).get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isInvalid(controlName: string): boolean {
    const control = this.cvForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
  // add experience
  addExperience(): void {
    this.workExperiences.push(this.createNewExperience());
  }

  // reomve
  removeExperience(index: number): void {
    if (this.workExperiences.length > 1) {
      this.workExperiences.removeAt(index);
    } else {
      alert('Phải có ít nhất 1 kinh nghiệm làm việc!');
    }
  }

  onSubmit(): void {
    if (this.cvForm.valid) {
      console.log('Form Dât: ', this.cvForm.value);
    } else {
      this.cvForm.markAllAsTouched();
    }
  }
}
