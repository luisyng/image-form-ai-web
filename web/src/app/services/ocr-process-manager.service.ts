import { Injectable } from '@angular/core';
import { OcrService } from './ocr.service';
import { ProcessManager } from '../models/process-manager';

@Injectable({
  providedIn: 'root'
})
export class OcrProcessManagerService implements ProcessManager<File, string> {
  constructor(private ocrService: OcrService) {}
  
  processData(file: File): Promise<string> {
    return this.ocrService.transformImageToText(file);
  }
  
  getProcessName(): string {
    return 'OCR';
  }
} 