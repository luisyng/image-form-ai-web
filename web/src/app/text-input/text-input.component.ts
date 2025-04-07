import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ocr-image-processor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {
  @Input() text!: string;
  @Output() textChanged = new EventEmitter<string>();
  
  onTextChanged(text: string): void {
    console.log('Text changed, emitting');
    this.textChanged.emit(text);
  }
} 