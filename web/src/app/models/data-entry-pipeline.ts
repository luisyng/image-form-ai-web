import { DataEntryConfig } from './data-entry-config';
import { StageStatus } from '../data-entry-stage/data-entry-stage.component';
import { FormMetadata } from './form-metadata';
import { DataProcessors, DataProcessorsFactory } from './data-processors';
import { FormDataProjection } from './form-data';

export class DataEntryPipeline {
  c!: DataEntryConfig;
  processors!: DataProcessors;
  file: File | null = null;
  extractedText: string | null = null;
  reviewedText: string | null = null;

  hasInputBeenProcessed: boolean = false;

  formData: FormDataProjection | null = null;
  reviewedFormData: FormDataProjection | null = null;
  
  backendSubmitStatus: StageStatus = 'normal';

  constructor(c: DataEntryConfig, dataProcessorsFactory: DataProcessorsFactory) {
    this.c = c;
    this.processors = dataProcessorsFactory.getProcessors(c, this.c.selectedFormMetadata!);
    if (this.c.selectedInputType?.id === 'manual') {
      this.formData = {};
    }
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

  handleParsedData(data: FormMetadata): void {
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