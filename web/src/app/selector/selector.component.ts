import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Selectable } from '../models/selectable';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent <S extends Selectable> {
  @Input() options: S[] = [];
  @Input() selectedOption: S | null = null;
  @Output() optionSelected = new EventEmitter<S>();
      
  selectOption(option: S): void {
    this.selectedOption = option;
    this.optionSelected.emit(option);
  }
} 