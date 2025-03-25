import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MalariaData } from '../malaria-data';

@Component({
  selector: 'app-malaria-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './malaria-form.component.html',
  styleUrls: ['./malaria-form.component.scss']
})
export class MalariaFormComponent implements OnInit {
  @Input() malariaData: MalariaData | null = null;
  @Output() dataUpdated = new EventEmitter<MalariaData>();
  
  malariaForm: FormGroup;
  
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

    // Listen for form value changes to emit updates
    this.malariaForm.valueChanges.subscribe(value => {
      this.dataUpdated.emit(value as MalariaData);
    });
  }
  
  ngOnInit() {
    // Initialize form with data if provided
    if (this.malariaData) {
      this.malariaForm.patchValue({
        name: this.malariaData.name || '',
        age: this.malariaData.age || '',
        fever: this.malariaData.fever,
        chills: this.malariaData.chills,
        sweating: this.malariaData.sweating,
        headache: this.malariaData.headache,
        nausea: this.malariaData.nausea,
        vomiting: this.malariaData.vomiting,
        musclePain: this.malariaData.musclePain,
        fatigue: this.malariaData.fatigue,
        otherSymptoms: this.malariaData.otherSymptoms || ''
      });
    }
  }

  onSubmit() {
    if (this.malariaForm.valid) {
      const formData = this.malariaForm.value as MalariaData;
      this.dataUpdated.emit(formData);
    }
  }

  resetForm() {
    this.malariaForm.reset();
    
    // Reset checkboxes to false
    this.resetCheckboxes();
    
    // Emit the reset data
    this.dataUpdated.emit(this.malariaForm.value as MalariaData);
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