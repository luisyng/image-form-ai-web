import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormMetadata } from '../models/form-metadata';
import { FormDataProjection } from '../models/form-data';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() metadata!: FormMetadata;
  @Input() data!: FormDataProjection;
  @Output() dataChanged = new EventEmitter<FormDataProjection>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const group: any = {};
    
    for (const element of this.metadata.elements) {
      // Use data value if available, otherwise use element's default value
      const value = this.data?.[element.id] ?? element.defaultValue;
      group[element.id] = [value];
    }
    
    this.form = this.fb.group(group);
    
    // Subscribe to form changes to emit updates
    this.form.valueChanges.subscribe(value => {
      this.dataChanged.emit(value);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dataChanged.emit(this.form.value);
    }
  }
} 