import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageAnalyzerComponent } from '../../image-analyzer/image-analyzer.component';
import { MalariaData } from '../malaria-data';

@Component({
  selector: 'app-malaria-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImageAnalyzerComponent],
  templateUrl: './malaria-form.component.html',
  styleUrls: ['./malaria-form.component.scss']
})
export class MalariaFormComponent {
  malariaForm: FormGroup;
  submitted = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  showImageAnalyzer = false;
  fieldsFilledFromImage: { [key: string]: boolean } = {};
  highlightDuration = 3000; // 3 seconds

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
        this.resetCheckboxes();
      }, 1000);
    }
  }

  resetForm() {
    this.malariaForm.reset();
    this.submitted = false;
    this.submitSuccess = false;
    this.submitError = false;
    
    // Reset checkboxes to false
    this.resetCheckboxes();
  }
  
  toggleImageAnalyzer() {
    this.showImageAnalyzer = !this.showImageAnalyzer;
  }
  
  handleExtractedData(formData: MalariaData) {
    // Reset the highlighting
    this.fieldsFilledFromImage = {};
    
    // Track which fields are being filled from the image
    if (formData.name) this.fieldsFilledFromImage['name'] = true;
    if (formData.age) this.fieldsFilledFromImage['age'] = true;
    if (formData.fever) this.fieldsFilledFromImage['fever'] = true;
    if (formData.chills) this.fieldsFilledFromImage['chills'] = true;
    if (formData.sweating) this.fieldsFilledFromImage['sweating'] = true;
    if (formData.headache) this.fieldsFilledFromImage['headache'] = true;
    if (formData.nausea) this.fieldsFilledFromImage['nausea'] = true;
    if (formData.vomiting) this.fieldsFilledFromImage['vomiting'] = true;
    if (formData.musclePain) this.fieldsFilledFromImage['musclePain'] = true;
    if (formData.fatigue) this.fieldsFilledFromImage['fatigue'] = true;
    if (formData.otherSymptoms) this.fieldsFilledFromImage['otherSymptoms'] = true;
    
    // Update the form with the extracted data
    this.malariaForm.patchValue({
      name: formData.name || this.malariaForm.get('name')?.value,
      age: formData.age || this.malariaForm.get('age')?.value,
      fever: formData.fever,
      chills: formData.chills,
      sweating: formData.sweating,
      headache: formData.headache,
      nausea: formData.nausea,
      vomiting: formData.vomiting,
      musclePain: formData.musclePain,
      fatigue: formData.fatigue,
      otherSymptoms: formData.otherSymptoms || this.malariaForm.get('otherSymptoms')?.value
    });
    
    // Clear the highlighting after a delay
    setTimeout(() => {
      this.fieldsFilledFromImage = {};
    }, this.highlightDuration);
  }
  
  private resetCheckboxes() {
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