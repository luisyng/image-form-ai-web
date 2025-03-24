import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaFormComponent } from '../malaria-form/malaria-form.component';
import { DataEntryStageComponent } from '../data-entry-stage/data-entry-stage.component';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [CommonModule, MalariaFormComponent, DataEntryStageComponent],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent {
  // No navigation logic needed for now
} 