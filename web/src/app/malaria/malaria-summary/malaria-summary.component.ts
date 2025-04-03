import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaData } from '../malaria-data';

@Component({
  selector: 'app-malaria-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './malaria-summary.component.html',
  styleUrls: ['./malaria-summary.component.scss']
})
export class MalariaSummaryComponent {
  @Input() data!: MalariaData;

  hasDetectedSymptoms(): boolean {
    if (!this.data) return false;
    
    return this.data.fever || 
           this.data.chills || 
           this.data.sweating || 
           this.data.headache || 
           this.data.nausea || 
           this.data.vomiting || 
           this.data.musclePain || 
           this.data.fatigue || 
           !!this.data.otherSymptoms;
  }
} 