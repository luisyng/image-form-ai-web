import { DataEntryConfig } from './data-entry-config';
import { StageStatus } from '../data-entry-stage/data-entry-stage.component';
import { FormData } from './form-data';
import { getFormDataForForm } from './form-data-samples';
import { DataProcessors, DataProcessorsFactory } from './data-processors';

export class DataEntryPipeline {
  c!: DataEntryConfig;
  processors!: DataProcessors;
  file: File | null = null;
  extractedText: string | null = null;
  reviewedText: string | null = null;

  hasInputBeenProcessed: boolean = false;

  formData: FormData | null = null;
  reviewedFormData: FormData | null = null;
  backendSubmitStatus: StageStatus = 'normal';

  constructor(c: DataEntryConfig, dataProcessorsFactory: DataProcessorsFactory) {
    this.c = c;
    this.formData = getFormDataForForm(c.selectedForm!);
    this.processors = dataProcessorsFactory.getProcessors(c, this.formData);
  }
  
  handleFileLoaded(file: File): void {
    this.file = file;
    console.log('File loaded:', file);
  }
  
  private handleTextExtracted(text: string): void {
    this.extractedText = text;
    this.reviewedText = text;
    console.log('Extracted text:', text);
  }
  
  handleTextReviewed(text: string): void {
    this.reviewedText = text;
    console.log('Reviewed text:', text);
  }

  handleParsedData(data: FormData): void {
    this.formData = data;
    this.hasInputBeenProcessed = true;
    console.log('Parsed form data:', data);
  }

  handleInputProcessed(data: any) {
    const m = this.c.selectedProcessMethod!;
    console.log('Input processed:', data);
    if (m.outputType === 'JSON') {
      this.handleParsedData(data);
    } else {
      this.handleTextExtracted(data);
    }
  }

  handleFormSubmission(data: any) {
    this.reviewedFormData = data;
    console.log('Form submitted:', data);
  }

  handleBackendSubmitSuccess($event: any) {
    this.backendSubmitStatus = 'success';
  }
  
  handleBackendSubmitError($event: string) {
    this.backendSubmitStatus = 'error';
  }
  
  hasFile(): boolean {
    return this.file !== null;
  }

  showForm(): boolean {
    return this.c.selectedInputType?.id === 'manual' || this.hasInputBeenProcessed;
  }
} 