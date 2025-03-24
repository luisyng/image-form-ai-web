import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaFormComponent } from '../malaria-form/malaria-form.component';
import { DataEntryStageComponent } from '../data-entry-stage/data-entry-stage.component';
import { FormSelectorComponent, FormType } from '../form-selector/form-selector.component';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [CommonModule, MalariaFormComponent, DataEntryStageComponent, FormSelectorComponent],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent {
  selectedForm: FormType | null = null;
  
  handleFormSelection(form: FormType): void {
    this.selectedForm = form;
    console.log('Selected form:', form);
  }
} 