import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formTypes, FormType } from '../models/form-type';

@Component({
  selector: 'app-form-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-selector.component.html',
  styleUrls: ['./form-selector.component.scss']
})
export class FormSelectorComponent {
  @Output() formSelected = new EventEmitter<FormType>();
  
  availableForms: FormType[] = formTypes;
  
  selectedForm: FormType | null = null;
  
  selectForm(form: FormType): void {
    this.selectedForm = form;
    this.formSelected.emit(form);
  }
} 