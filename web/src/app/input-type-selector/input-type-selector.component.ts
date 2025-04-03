import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inputTypes, InputType } from '../models/input-type';


@Component({
  selector: 'app-input-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-type-selector.component.html',
  styleUrls: ['./input-type-selector.component.scss']
})
export class InputTypeSelectorComponent {
  @Output() inputTypeSelected = new EventEmitter<InputType>();
  
  inputTypes: InputType[] = inputTypes;
  
  selectedInputType: InputType | null = null;
  
  selectInputType(inputType: InputType): void {
    this.selectedInputType = inputType;
    this.inputTypeSelected.emit(inputType);
  }
} 