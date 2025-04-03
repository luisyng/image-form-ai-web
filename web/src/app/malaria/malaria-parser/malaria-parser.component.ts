import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaParserService } from '../malaria-parser.service';
import { MalariaData } from '../malaria-data';
import { MalariaSummaryComponent } from '../malaria-summary/malaria-summary.component';

@Component({
  selector: 'app-malaria-parser',
  standalone: true,
  imports: [CommonModule, MalariaSummaryComponent],
  templateUrl: './malaria-parser.component.html',
  styleUrls: ['./malaria-parser.component.scss']
})
export class MalariaParserComponent implements OnChanges {
  @Input() extractedText: string = '';
  @Output() dataParsed = new EventEmitter<MalariaData>();
  
  parsedData: MalariaData | null = null;
  isProcessing = false;
  
  constructor(private malariaParserService: MalariaParserService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['extractedText'] && this.extractedText) {
      this.parseText();
    }
  }
  
  parseText(): void {
    this.isProcessing = true;
    
    // Small timeout to allow UI to update with loading state
    setTimeout(() => {
      try {
        this.parsedData = this.malariaParserService.parseText(this.extractedText);
        this.dataParsed.emit(this.parsedData);
      } catch (error) {
        console.error('Error parsing malaria data:', error);
      } finally {
        this.isProcessing = false;
      }
    }, 500);
  }
} 