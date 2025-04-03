import { MalariaData } from '../malaria/malaria-data';
import { FormType } from './form-type';
import { InputType } from './input-type';
import { InputMethod } from './input-method';
import { ProcessMethod } from './process-method';

export class DataEntryPipeline {
  selectedForm: FormType | null = null;
  selectedInputType: InputType | null = null;
  selectedInputMethod: InputMethod | null = null;
  photo: File | null = null;
  uploadedAudio: File | null = null;
  recordedAudio: File | null = null;
  selectedProcessMethod: ProcessMethod | null = null;
  extractedText: string = '';
  formData: MalariaData | null = null;

  handleFormSelection(form: FormType): void {
    this.selectedForm = form;
    console.log('Selected form:', form);
  }
  
  handleInputTypeSelection(inputType: InputType): void {
    this.selectedInputType = inputType;
    this.selectedInputMethod = null;
    
    // Reset all input data
    this.photo = null;
    this.uploadedAudio = null;
    this.recordedAudio = null;
    this.selectedProcessMethod = null;
    this.extractedText = '';
    
    // If manual input is selected, initialize an empty form
    if (inputType.id === 'manual') {
      this.formData = new MalariaData();
    } else {
      this.formData = null;
    }
    
    console.log('Selected input type:', inputType);
  }
  
  handleInputMethodSelection(method: InputMethod): void {
    this.selectedInputMethod = method;
    console.log('Selected input method:', method);
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
    this.uploadedAudio = file;
    this.recordedAudio = null;
    console.log('Audio loaded:', file);
  }
  
  handleAudioRecorded(file: File): void {
    this.recordedAudio = file;
    this.uploadedAudio = null;
    console.log('Audio recorded:', file);
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
  
  getActiveAudio(): File | null {
    return this.uploadedAudio || this.recordedAudio;
  }
  
  hasImage(): boolean {
    return this.photo !== null;
  }
  
  hasAudio(): boolean {
    return this.uploadedAudio !== null || this.recordedAudio !== null;
  }
  
  isManualEntry(): boolean {
    return this.selectedInputType?.id === 'manual';
  }
  
  isPhotoEntry(): boolean {
    return this.selectedInputType?.id === 'photo';
  }
  
  isAudioEntry(): boolean {
    return this.selectedInputType?.id === 'audio';
  }
  
  isCameraMethod(): boolean {
    return this.selectedInputMethod?.id === 'camera';
  }
  
  isUploadPhotoMethod(): boolean {
    return this.selectedInputMethod?.id === 'upload-photo';
  }
  
  isMicrophoneMethod(): boolean {
    return this.selectedInputMethod?.id === 'microphone';
  }
  
  isUploadAudioMethod(): boolean {
    return this.selectedInputMethod?.id === 'upload-audio';
  }
} 