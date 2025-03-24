import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss']
})
export class ImageLoaderComponent {
  @Output() imageLoaded = new EventEmitter<File>();
  
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragging = false;
  
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
      if (file.type.match(/image\/*/) || file.type === 'application/pdf') {
        this.processFile(file);
      } else {
        alert('Please upload an image or PDF file.');
      }
    }
  }
  
  private processFile(file: File): void {
    this.selectedFile = file;
    
    // Create preview for image files
    if (file.type.match(/image\/*/)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.imageLoaded.emit(file);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      // For PDF files, we don't show a preview but still emit the file
      this.previewUrl = null;
      this.imageLoaded.emit(file);
    }
  }
  
  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }
} 