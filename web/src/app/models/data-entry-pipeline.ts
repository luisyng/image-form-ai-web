import { MalariaData } from '../malaria/malaria-data';
import { DataEntryConfig } from './data-entry-config';
import { StageStatus } from '../data-entry-stage/data-entry-stage.component';

export class DataEntryPipeline {
  file: File | null = null;
  extractedText: string | null = null;
  reviewedText: string | null = null;
  formData: MalariaData | null = null;
  backendSubmitStatus: StageStatus = 'normal';

  constructor(c: DataEntryConfig) {
    if (c.selectedInputType?.id === 'manual') {
      this.formData = new MalariaData();
    } else {
      this.formData = null;
    }
    console.log(this.formData);
  }
  
  handleFileLoaded(file: File): void {
    this.file = file;
    console.log('File loaded:', file);
  }
  
  handleTextExtracted(text: string): void {
    this.extractedText = text;
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

  handleFormSubmission(data: any) {
    this.formData = data;
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