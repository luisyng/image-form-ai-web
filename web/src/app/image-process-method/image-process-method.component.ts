import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { processMethods, ProcessMethod } from '../models/process-method';


@Component({
  selector: 'app-image-process-method',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-process-method.component.html',
  styleUrls: ['./image-process-method.component.scss']
})
export class ImageProcessMethodComponent {
  @Output() methodSelected = new EventEmitter<ProcessMethod>();
  
  processMethods = processMethods;
  
  selectedMethod: ProcessMethod | null = null;
  
  selectMethod(method: ProcessMethod): void {
    this.selectedMethod = method;
    this.methodSelected.emit(method);
  }
} 