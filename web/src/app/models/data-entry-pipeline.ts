import { MalariaData } from '../malaria/malaria-data';
import { DataEntryConfig } from './data-entry-config';
import { StageStatus } from '../data-entry-stage/data-entry-stage.component';

export class DataEntryPipeline {
  c!: DataEntryConfig;
  file: File | null = null;
  extractedText: string | null = null;
  reviewedText: string | null = null;
  formData: MalariaData | null = null;
  reviewedFormData: MalariaData | null = null;
  backendSubmitStatus: StageStatus = 'normal';

  constructor(c: DataEntryConfig) {
    this.c = c;
    if (c.selectedInputType?.id === 'manual') {
      this.formData = new MalariaData();
    } else {
      this.formData = null;
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

  handleParsedData(data: MalariaData): void {
    this.formData = data;
    console.log('Parsed malaria data:', data);
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
} 