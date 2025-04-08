import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormData } from '../models/form-data';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() formData!: FormData;
  @Input() initialData: any = {};
  @Output() dataUpdated = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const group: any = {};
    
    for (const element of this.formData.elements) {
      let initialValue = this.initialData[element.id];
      
      // Set default values based on type if no initial value
      if (initialValue === undefined) {
        switch (element.type) {
          case 'boolean':
            initialValue = false;
            break;
          case 'number':
          case 'text':
          case 'textarea':
          case 'select':
            initialValue = null;
            break;
        }
      }
      
      group[element.id] = [initialValue];
    }
    
    this.form = this.fb.group(group);
    
    // Subscribe to form changes to emit updates
    this.form.valueChanges.subscribe(value => {
      this.dataUpdated.emit(value);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dataUpdated.emit(this.form.value);
    }
  }
} 