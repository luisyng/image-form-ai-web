import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  
  constructor() { }
  
  async transformImageToText(file: File): Promise<string> {
    try {
      const worker = await createWorker({
        logger: progress => {
          if (progress.status === 'recognizing text') {
            // console.log(Math.round(progress.progress * 100));
          }
        }
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      console.log('Extracted text:', text);
      
      
      await worker.terminate();
      
      return text;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }
} 