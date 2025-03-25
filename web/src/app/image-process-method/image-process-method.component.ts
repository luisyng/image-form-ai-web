import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProcessMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-image-process-method',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-process-method.component.html',
  styleUrls: ['./image-process-method.component.scss']
})
export class ImageProcessMethodComponent {
  @Output() methodSelected = new EventEmitter<ProcessMethod>();
  
  processMethods: ProcessMethod[] = [
    {
      id: 'ocr',
      name: 'Locally with OCR',
      description: 'Process the image using Optical Character Recognition on your device. Faster but may be less accurate for complex forms.',
      icon: '💻'
    },
    {
      id: 'llm',
      name: 'Send to LLM',
      description: 'Send the image to a Large Language Model for processing. More accurate but requires internet connection and may take longer.',
      icon: '🤖'
    }
  ];
  
  selectedMethod: ProcessMethod | null = null;
  
  selectMethod(method: ProcessMethod): void {
    this.selectedMethod = method;
    this.methodSelected.emit(method);
  }
} 