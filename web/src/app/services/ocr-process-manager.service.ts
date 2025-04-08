import { Injectable } from '@angular/core';
import { OcrService } from './ocr.service';
import { ProcessManager } from '../models/process-manager';
import { ProcessMethod } from '../models/process-method';

@Injectable({
  providedIn: 'root'
})
export class OcrProcessManagerService extends ProcessManager<File, string> {
  private static readonly OCR_METHOD: ProcessMethod = {
    id: 'ocr',
    name: 'OCR: image to text',
    description: 'Process the image locally on your device. Library: Tesseract OCR.',
    icon: '💻',
    inputType: 'photo',
    outputType: 'text'
  };
  
  constructor(private ocrService: OcrService) {
    super(OcrProcessManagerService.OCR_METHOD);
  }
  
  processData(file: File): Promise<string> {
    return this.ocrService.transformImageToText(file);
  }
} 