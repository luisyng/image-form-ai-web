import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormData } from '../models/form-data';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
      <div *ngFor="let element of formData?.elements" class="form-field">
        <ng-container [ngSwitch]="element.type">
          <!-- Text Input -->
          <ng-container *ngSwitchCase="'text'">
            <label [for]="element.id">{{ element.name }}</label>
            <input 
              [id]="element.id"
              type="text"
              [formControlName]="element.id"
              [placeholder]="element.placeholder || ''"
            >
          </ng-container>

          <!-- Number Input -->
          <ng-container *ngSwitchCase="'number'">
            <label [for]="element.id">{{ element.name }}</label>
            <input 
              [id]="element.id"
              type="number"
              [formControlName]="element.id"
              [placeholder]="element.placeholder || ''"
            >
          </ng-container>

          <!-- Boolean Input -->
          <ng-container *ngSwitchCase="'boolean'">
            <label class="checkbox-label">
              <input 
                type="checkbox"
                [formControlName]="element.id"
              >
              {{ element.name }}
            </label>
          </ng-container>

          <!-- Select Input -->
          <ng-container *ngSwitchCase="'select'">
            <label [for]="element.id">{{ element.name }}</label>
            <select [id]="element.id" [formControlName]="element.id">
              <option value="">Select an option</option>
              <option *ngFor="let option of element.options" [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </ng-container>

          <!-- Textarea Input -->
          <ng-container *ngSwitchCase="'textarea'">
            <label [for]="element.id">{{ element.name }}</label>
            <textarea 
              [id]="element.id"
              [formControlName]="element.id"
              [placeholder]="element.placeholder || ''"
              rows="3"
            ></textarea>
          </ng-container>
        </ng-container>
      </div>

      <div class="form-actions">
        <button type="submit" [disabled]="!form.valid">Submit</button>
      </div>
    </form>
  `,
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
            initialValue = null;
            break;
          case 'text':
          case 'textarea':
          case 'select':
            initialValue = '';
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