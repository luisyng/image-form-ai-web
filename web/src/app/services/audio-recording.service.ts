import { BehaviorSubject, Observable } from 'rxjs';

export interface RecordingState {
  isRecording: boolean;
  recordingTime: number;
  audioUrl: string | null;
  isAudioSupported: boolean;
  errorMessage: string;
}

export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private timerInterval: any = null;
  private audioBlob: Blob | null = null;
  
  private state = new BehaviorSubject<RecordingState>({
    isRecording: false,
    recordingTime: 0,
    audioUrl: null,
    isAudioSupported: true,
    errorMessage: ''
  });
  
  constructor() {
    this.checkBrowserSupport();
  }
  
  get state$(): Observable<RecordingState> {
    return this.state.asObservable();
  }
  
  get currentState(): RecordingState {
    return this.state.getValue();
  }
  
  private updateState(newState: Partial<RecordingState>): void {
    this.state.next({
      ...this.currentState,
      ...newState
    });
  }
  
  private checkBrowserSupport(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.updateState({
        isAudioSupported: false,
        errorMessage: 'Audio recording is not supported in your browser.'
      });
    }
  }
  
  startRecording(): Promise<void> {
    console.log('Starting recording');
    
    if (!this.currentState.isAudioSupported) {
      return Promise.reject('Audio recording is not supported');
    }
    
    // Reset state for new recording
    this.updateState({
      errorMessage: '',
      recordingTime: 0
    });
    
    this.audioChunks = [];
    this.audioBlob = null;
    
    // Revoke previous URL if it exists
    if (this.currentState.audioUrl) {
      URL.revokeObjectURL(this.currentState.audioUrl);
      this.updateState({ audioUrl: null });
    }
    
    return navigator.mediaDevices.getUserMedia({ audio: true })
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
        this.updateState({ isRecording: true });
        this.startTimer();
        
        return Promise.resolve();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        this.updateState({
          errorMessage: 'Could not access microphone. Please ensure you have granted microphone permissions.'
        });
        return Promise.reject(error);
      });
  }
  
  stopRecording(): void {
    if (this.mediaRecorder && this.currentState.isRecording) {
      this.mediaRecorder.stop();
      this.updateState({ isRecording: false });
      this.clearTimer();
    }
  }
  
  retryRecording(): void {
    console.log('Retry recording called');
    
    // Stop any ongoing recording
    this.stopRecording();
    
    // Clean up existing audio resources
    if (this.currentState.audioUrl) {
      console.log('Revoking URL:', this.currentState.audioUrl);
      URL.revokeObjectURL(this.currentState.audioUrl);
      this.updateState({ audioUrl: null });
    }
    
    // Reset state
    this.audioBlob = null;
    this.audioChunks = [];
    this.updateState({
      recordingTime: 0,
      isRecording: false
    });
    
    console.log('State reset, audioUrl is now:', this.currentState.audioUrl);
  }
  
  private processAudio(): File | null {
    if (this.audioChunks.length === 0) return null;
    
    this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    
    // Revoke previous URL if it exists
    if (this.currentState.audioUrl) {
      URL.revokeObjectURL(this.currentState.audioUrl);
    }
    
    // Create new URL
    const audioUrl = URL.createObjectURL(this.audioBlob);
    console.log('Audio URL created:', audioUrl);
    this.updateState({ audioUrl });
    
    // Convert Blob to File
    const fileName = `recording_${new Date().getTime()}.webm`;
    const audioFile = new File([this.audioBlob], fileName, { type: 'audio/webm' });
    
    return audioFile;
  }
  
  private startTimer(): void {
    this.clearTimer();
    
    this.timerInterval = setInterval(() => {
      this.updateState({
        recordingTime: this.currentState.recordingTime + 1
      });
    }, 1000);
  }
  
  private clearTimer(): void {
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
  
  dispose(): void {
    this.stopRecording();
    this.clearTimer();
    
    if (this.currentState.audioUrl) {
      URL.revokeObjectURL(this.currentState.audioUrl);
    }
  }
} 