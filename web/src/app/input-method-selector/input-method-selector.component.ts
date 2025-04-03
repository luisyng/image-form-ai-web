import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputMethod, getMethodsForInputType } from '../models/input-method';
import { InputType } from '../models/input-type';

@Component({
  selector: 'app-input-method-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-method-selector.component.html',
  styleUrls: ['./input-method-selector.component.scss']
})
export class InputMethodSelectorComponent implements OnChanges {
  @Input() inputType: InputType | null = null;
  @Output() inputMethodSelected = new EventEmitter<InputMethod>();
  
  availableMethods: InputMethod[] = [];
  selectedMethod: InputMethod | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputType'] && this.inputType) {
      this.availableMethods = getMethodsForInputType(this.inputType.id);
      this.selectedMethod = null;
    }
  }
  
  selectMethod(method: InputMethod): void {
    this.selectedMethod = method;
    this.inputMethodSelected.emit(method);
  }
} 