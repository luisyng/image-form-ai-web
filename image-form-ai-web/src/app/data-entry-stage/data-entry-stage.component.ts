import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-entry-stage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-entry-stage.component.html',
  styleUrls: ['./data-entry-stage.component.scss']
})
export class DataEntryStageComponent {
  @Input() title: string = '';
  @Input() active: boolean = false;
} 