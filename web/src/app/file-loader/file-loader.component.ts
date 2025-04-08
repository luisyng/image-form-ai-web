import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.scss']
})
export class FileLoaderComponent {
  @Input() acceptedFileTypes: string = 'image/*,application/pdf';
  @Input() fileTypeDescription: string = 'Supported formats: JPG, PNG, PDF';
  @Input() icon: string = '📄';
  @Output() fileLoaded = new EventEmitter<File>();
  
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragging = false;
  isAudio = false;
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      
      // Check if the file type matches the accepted types
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = this.acceptedFileTypes;
      
      // This is a hack to check if the file type is accepted
      const acceptsFile = Array.from(input.accept.split(',')).some(type => {
        if (type.includes('/*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType + '/');
        }
        return type === file.type;
      });
      
      if (acceptsFile) {
        this.processFile(file);
      } else {
        alert(`Please upload a valid file. ${this.fileTypeDescription}`);
      }
    }
  }
  
  private processFile(file: File): void {
    this.selectedFile = file;
    this.isAudio = file.type.startsWith('audio/');
    
    // Create preview for image files
    if (file.type.match(/image\/*/)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.fileLoaded.emit(file);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      // For PDF files, we don't show a preview but still emit the file
      this.previewUrl = null;
      this.fileLoaded.emit(file);
    } else if (file.type.startsWith('audio/')) {
      // For audio files, we don't show a preview but still emit the file
      this.previewUrl = null;
      this.fileLoaded.emit(file);
    }
  }
  
  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }
  
  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewUrl = null;
    this.isAudio = false;
  }
} 