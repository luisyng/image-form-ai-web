import { MalariaData } from '../malaria/malaria-data';
import { InputType } from './input-type';

export class DataEntryPipeline {
  
  photo: File | null = null;
  audio: File | null = null;
  extractedText: string = '';
  formData: MalariaData | null = null;
  
  handleInputTypeSelection(inputType: InputType): void {
    // Reset all input data
    this.photo = null;
    this.audio = null;
    this.extractedText = '';
    
    // If manual input is selected, initialize an empty form
    if (inputType.id === 'manual') {
      this.formData = new MalariaData();
    } else {
      this.formData = null;
    }
    
    console.log('Selected input type:', inputType);
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
  
  hasImage(): boolean {
    return this.photo !== null;
  }
  
  hasAudio(): boolean {
    return this.audio !== null;
  }
} 