import { MalariaData } from '../malaria/malaria-data';
import { DataEntryConfig } from './data-entry-config';
import { StageStatus } from '../data-entry-stage/data-entry-stage.component';

export class DataEntryPipeline {
  photo: File | null = null;
  audio: File | null = null;
  extractedText: string = '';
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
  
  handleImageLoaded(file: File): void {
    this.photo = file;
    console.log('Image loaded:', file);
  }
  
  handlePhotoTaken(file: File): void {
    this.photo = file;
    console.log('Photo taken:', file);
  }
  
  handleAudioLoaded(file: File): void {
    this.audio = file;
    console.log('Audio loaded:', file);
  }
  
  handleAudioRecorded(file: File): void {
    this.audio = file;
    console.log('Audio recorded:', file);
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

  handleBackendSubmitSuccess($event: any) {
    this.backendSubmitStatus = 'success';
  }
  
  handleBackendSubmitError($event: string) {
    this.backendSubmitStatus = 'error';
  }
  
  hasImage(): boolean {
    return this.photo !== null;
  }
  
  hasAudio(): boolean {
    return this.audio !== null;
  }
} 