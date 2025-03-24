import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaFormComponent } from '../malaria-form/malaria-form.component';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [CommonModule, MalariaFormComponent],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent {

  
} 