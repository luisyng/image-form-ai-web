import { Component, Output, EventEmitter, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';
import { AudioRecordingService, RecordingState } from '../services/audio-recording.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  imports: [CommonModule, AudioPlayerComponent],
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})
export class AudioRecorderComponent implements OnInit, OnDestroy {
  @Output() audioRecorded = new EventEmitter<File>();
  
  state: RecordingState = {
    isRecording: false,
    recordingTime: 0,
    audioUrl: null,
    isAudioSupported: true,
    errorMessage: ''
  };
  
  private subscription: Subscription = new Subscription();
  private recordingService: AudioRecordingService = new AudioRecordingService();
  
  constructor(
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.subscription.add(
      this.recordingService.state$.subscribe(state => {
        this.state = state;
        this.cdr.detectChanges();
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  startRecording(): void {
    this.recordingService.startRecording()
      .then(() => {
        console.log('Recording started successfully');
      })
      .catch(error => {
        console.error('Failed to start recording:', error);
      });
  }
  
  stopRecording(): void {
    console.log('Stopping recording');
    this.recordingService.stopRecording();
    
    // Wait a short time for the audio processing to complete
    setTimeout(() => {
      // Get the audio file and emit it
      const audioFile = this.getAudioFileFromBlob();
      if (audioFile) {
        console.log('Emitting audio file:', audioFile);
        this.audioRecorded.emit(audioFile);
      } else {
        console.error('Failed to create audio file');
      }
    }, 300); // Short delay to ensure audio processing is complete
  }
  
  retryRecording(): void {
    this.recordingService.retryRecording();
  }
  
  formatTime(seconds: number): string {
    return this.recordingService.formatTime(seconds);
  }
  
  private getAudioFileFromBlob(): File | null {
    if (!this.state.audioUrl) return null;
    
    // Get the blob from the recording service
    const blob = this.recordingService.getAudioBlob();
    if (!blob) {
      console.error('No audio blob available');
      return null;
    }
    
    // Create a File object from the blob
    const fileName = `recording_${new Date().getTime()}.webm`;
    return new File([blob], fileName, { type: 'audio/webm' });
  }
  
  private fetchBlobFromUrl(url: string): Blob | null {
    // This is a placeholder - in a real implementation,
    // you would need to fetch the blob from the URL or store it in the service
    return null;
  }
} 