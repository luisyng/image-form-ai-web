import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InputType {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-input-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-type-selector.component.html',
  styleUrls: ['./input-type-selector.component.scss']
})
export class InputTypeSelectorComponent {
  @Output() inputTypeSelected = new EventEmitter<InputType>();
  
  inputTypes: InputType[] = [
    {
      id: 'manual',
      name: 'Manual Entry',
      icon: '✏️'
    },
    {
      id: 'image',
      name: 'Upload Photo',
      icon: '🖼️',
    },
    {
      id: 'camera',
      name: 'Take Photo',
      icon: '📷',
    },
    {
      id: 'audio',
      name: 'Record Audio',
      icon: '🎤',
    }
  ];
  
  selectedInputType: InputType | null = null;
  
  selectInputType(inputType: InputType): void {
    this.selectedInputType = inputType;
    this.inputTypeSelected.emit(inputType);
  }
} 