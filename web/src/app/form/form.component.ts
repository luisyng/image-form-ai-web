import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormMetadata } from '../models/form-metadata';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() formData!: FormMetadata;
  @Output() dataUpdated = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const group: any = {};
    
    for (const element of this.formData.elements) {
      group[element.id] = [element.defaultValue];
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