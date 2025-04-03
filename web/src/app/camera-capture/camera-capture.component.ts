import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-capture.component.html',
  styleUrls: ['./camera-capture.component.scss']
})
export class CameraCaptureComponent implements OnDestroy {
  @Output() photoTaken = new EventEmitter<File>();
  
  videoStream: MediaStream | null = null;
  videoElement: HTMLVideoElement | null = null;
  canvasElement: HTMLCanvasElement | null = null;
  isCameraActive = false;
  isCameraSupported = true;
  errorMessage = '';
  capturedImage: string | null = null;
  
  ngOnInit() {
    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.isCameraSupported = false;
      this.errorMessage = 'Camera access is not supported in your browser.';
    }
  }
  
  ngOnDestroy() {
    this.stopCamera();
  }
  
  startCamera() {
    if (!this.isCameraSupported) return;
    
    this.errorMessage = '';
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoStream = stream;
        this.isCameraActive = true;
        
        // Need to wait for the DOM to be updated with the video element
        setTimeout(() => {
          this.videoElement = document.querySelector('#camera-feed');
          if (this.videoElement) {
            this.videoElement.srcObject = stream;
          }
        }, 100);
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
        this.errorMessage = 'Could not access camera. Please ensure you have granted camera permissions.';
      });
  }
  
  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    
    this.isCameraActive = false;
  }
  
  capturePhoto() {
    if (!this.videoElement) return;
    
    // Create canvas if it doesn't exist
    if (!this.canvasElement) {
      this.canvasElement = document.createElement('canvas');
    }
    
    const width = this.videoElement.videoWidth;
    const height = this.videoElement.videoHeight;
    
    this.canvasElement.width = width;
    this.canvasElement.height = height;
    
    const context = this.canvasElement.getContext('2d');
    if (context) {
      context.drawImage(this.videoElement, 0, 0, width, height);
      
      // Convert canvas to data URL
      this.capturedImage = this.canvasElement.toDataURL('image/jpeg');
      
      // Convert data URL to File object
      this.dataURLtoFile(this.capturedImage, 'captured-photo.jpg')
        .then(file => {
          this.photoTaken.emit(file);
          this.stopCamera();
        })
        .catch(error => {
          console.error('Error converting image:', error);
          this.errorMessage = 'Error processing captured image.';
        });
    }
  }
  
  retakePhoto() {
    this.capturedImage = null;
    this.startCamera();
  }
  
  private async dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
  }
} 