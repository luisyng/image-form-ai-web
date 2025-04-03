import { FormType } from '../form-selector/form-selector.component';
import { InputType } from '../input-type-selector/input-type-selector.component';
import { ProcessMethod } from '../image-process-method/image-process-method.component';
import { MalariaData } from '../malaria/malaria-data';

export class DataEntryPipeline {
  selectedForm: FormType | null = null;
  selectedInputType: InputType | null = null;
  uploadedImage: File | null = null;
  capturedPhoto: File | null = null;
  selectedProcessMethod: ProcessMethod | null = null;
  extractedText: string = '';
  formData: MalariaData | null = null;

  handleFormSelection(form: FormType): void {
    this.selectedForm = form;
    console.log('Selected form:', form);
  }
  
  handleInputTypeSelection(inputType: InputType): void {
    this.selectedInputType = inputType;
    if (inputType.id === 'manual') {
      this.formData = new MalariaData();
    }
    console.log('Selected input type:', inputType);
  }
  
  handleImageLoaded(file: File): void {
    this.uploadedImage = file;
    this.capturedPhoto = null; // Clear any previously captured photo
    console.log('Image loaded:', file);
  }
  
  handlePhotoTaken(file: File): void {
    this.capturedPhoto = file;
    this.uploadedImage = null; // Clear any previously uploaded image
    console.log('Photo taken:', file);
  }
  
  handleProcessMethodSelected(method: ProcessMethod): void {
    this.selectedProcessMethod = method;
    console.log('Selected process method:', method);
  }
  
  handleTextExtracted(text: string): void {
    this.extractedText = text;
    console.log('Extracted text:', text);
  }

  handleParsedData(data: MalariaData): void {
    this.formData = data;
    console.log('Parsed malaria data:', data);
  }

  handleFormSubmission(data: any) {
    this.formData = data;
    console.log('Form submitted:', data);
  }
} 