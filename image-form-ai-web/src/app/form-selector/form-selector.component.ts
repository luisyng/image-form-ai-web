import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FormType {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-form-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-selector.component.html',
  styleUrls: ['./form-selector.component.scss']
})
export class FormSelectorComponent {
  @Output() formSelected = new EventEmitter<FormType>();
  
  availableForms: FormType[] = [
    {
      id: 'malaria',
      name: 'Malaria Symptoms',
      description: 'Form for recording malaria symptoms and patient information'
    }
    // More forms can be added here in the future
  ];
  
  selectedForm: FormType | null = null;
  
  selectForm(form: FormType): void {
    this.selectedForm = form;
    this.formSelected.emit(form);
  }
} 