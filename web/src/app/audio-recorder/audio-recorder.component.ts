import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  imports: [CommonModule, AudioPlayerComponent],
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})
export class AudioRecorderComponent implements OnDestroy {
  @Output() audioRecorded = new EventEmitter<File>();
  
  isRecording = false;
  recordingTime = 0;
  timerInterval: any = null;
  audioChunks: Blob[] = [];
  mediaRecorder: MediaRecorder | null = null;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;
  isAudioSupported = true;
  errorMessage = '';
  
  ngOnInit() {
    // Check if audio recording is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.isAudioSupported = false;
      this.errorMessage = 'Audio recording is not supported in your browser.';
    }
  }
  
  ngOnDestroy() {
    this.stopRecording();
    this.clearTimer();
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }
  
  startRecording() {
    if (!this.isAudioSupported) return;
    
    this.errorMessage = '';
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        
        this.mediaRecorder.onstop = () => {
          this.processAudio();
          // Stop all audio tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        this.startTimer();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        this.errorMessage = 'Could not access microphone. Please ensure you have granted microphone permissions.';
      });
  }
  
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.clearTimer();
    }
  }
  
  private processAudio() {
    if (this.audioChunks.length === 0) return;
    
    this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    this.audioUrl = URL.createObjectURL(this.audioBlob);
    
    // Convert Blob to File
    const fileName = `recording_${new Date().getTime()}.webm`;
    const audioFile = new File([this.audioBlob], fileName, { type: 'audio/webm' });
    
    // Emit the audio file
    this.audioRecorded.emit(audioFile);
  }
  
  private startTimer() {
    this.recordingTime = 0;
    this.clearTimer();
    
    this.timerInterval = setInterval(() => {
      this.recordingTime++;
    }, 1000);
  }
  
  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  retryRecording() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
    this.audioBlob = null;
    this.audioChunks = [];
    this.recordingTime = 0;
  }
} 