import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-malaria-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './malaria-form.component.html',
  styleUrls: ['./malaria-form.component.scss']
})
export class MalariaFormComponent {
  malariaForm: FormGroup;
  submitted = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.malariaForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      fever: [false],
      chills: [false],
      sweating: [false],
      headache: [false],
      nausea: [false],
      vomiting: [false],
      musclePain: [false],
      fatigue: [false],
      otherSymptoms: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    this.submitSuccess = false;
    this.submitError = false;
    
    if (this.malariaForm.valid) {
      // In a real application, you would send this data to your backend
      console.log('Form submitted:', this.malariaForm.value);
      
      // Simulate API call
      setTimeout(() => {
        // Simulate successful submission
        this.submitSuccess = true;
        this.malariaForm.reset();
        this.submitted = false;
        
        // Reset checkboxes to false
        this.malariaForm.patchValue({
          fever: false,
          chills: false,
          sweating: false,
          headache: false,
          nausea: false,
          vomiting: false,
          musclePain: false,
          fatigue: false
        });
      }, 1000);
    }
  }

  resetForm() {
    this.malariaForm.reset();
    this.submitted = false;
    this.submitSuccess = false;
    this.submitError = false;
    
    // Reset checkboxes to false
    this.malariaForm.patchValue({
      fever: false,
      chills: false,
      sweating: false,
      headache: false,
      nausea: false,
      vomiting: false,
      musclePain: false,
      fatigue: false
    });
  }
} 