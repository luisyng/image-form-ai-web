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
export class SelectorComponent {
  @Input() options: Selectable[] = [];
  @Input() selectedOption: Selectable | null = null;
  @Output() optionSelected = new EventEmitter<Selectable>();
      
  selectOption(option: Selectable): void {
    this.selectedOption = option;
    this.optionSelected.emit(option);
  }
} 