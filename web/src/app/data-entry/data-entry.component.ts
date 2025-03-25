import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaFormComponent } from '../malaria/malaria-form/malaria-form.component';
import { DataEntryStageComponent } from '../data-entry-stage/data-entry-stage.component';
import { FormSelectorComponent, FormType } from '../form-selector/form-selector.component';
import { InputTypeSelectorComponent, InputType } from '../input-type-selector/input-type-selector.component';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';
import { ImageProcessMethodComponent, ProcessMethod } from '../image-process-method/image-process-method.component';
import { OcrImageProcessorComponent } from '../ocr-image-processor/ocr-image-processor.component';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [
    CommonModule, 
    MalariaFormComponent, 
    DataEntryStageComponent, 
    FormSelectorComponent,
    InputTypeSelectorComponent,
    ImageLoaderComponent,
    ImageProcessMethodComponent,
    OcrImageProcessorComponent
  ],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent {
  selectedForm: FormType | null = null;
  selectedInputType: InputType | null = null;
  uploadedImage: File | null = null;
  selectedProcessMethod: ProcessMethod | null = null;
  extractedText: string = '';
  
  handleFormSelection(form: FormType): void {
    this.selectedForm = form;
    console.log('Selected form:', form);
  }
  
  handleInputTypeSelection(inputType: InputType): void {
    this.selectedInputType = inputType;
    console.log('Selected input type:', inputType);
  }
  
  handleImageLoaded(file: File): void {
    this.uploadedImage = file;
    console.log('Image loaded:', file);
  }
  
  handleProcessMethodSelected(method: ProcessMethod): void {
    this.selectedProcessMethod = method;
    console.log('Selected process method:', method);
  }
  
  handleTextExtracted(text: string): void {
    this.extractedText = text;
    console.log('Extracted text:', text);
  }
} 