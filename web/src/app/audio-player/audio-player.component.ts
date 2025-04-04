import { Component, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnChanges, OnDestroy {
  @Input() audioUrl: string | null = null;
  @Input() showFileName: boolean = false;
  @Input() fileName: string = 'Audio recording';
  
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  isValidDuration: boolean = false;
  audioElement: HTMLAudioElement | null = null;
  progressInterval: any = null;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['audioUrl']) {
      // Handle both setting and clearing the audio URL
      if (this.audioUrl) {
        this.setupAudio();
      } else {
        this.cleanupAudio();
      }
    }
  }
  
  ngOnDestroy(): void {
    this.cleanupAudio();
  }
  
  private cleanupAudio(): void {
    this.clearProgressInterval();
    
    if (this.audioElement) {
      // Stop any ongoing playback
      try {
        this.audioElement.pause();
      } catch (e) {
        console.warn('Error pausing audio element:', e);
      }
      
      // Clear the source
      this.audioElement.src = '';
      this.audioElement.load();
      this.audioElement = null;
    }
    
    // Reset state
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.isValidDuration = false;
    
    // Update UI
    this.cdr.detectChanges();
  }
  
  private setupAudio(): void {
    // Clean up any existing audio element first
    this.cleanupAudio();
    
    if (!this.audioUrl) return;
    
    try {
      this.audioElement = new Audio(this.audioUrl);
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 0;
      this.isValidDuration = false;
      
      this.audioElement.addEventListener('loadedmetadata', () => {
        if (this.audioElement) {
          this.duration = this.audioElement.duration;
          this.isValidDuration = !isNaN(this.duration) && isFinite(this.duration) && this.duration > 0;
          console.log('Audio metadata loaded, duration:', this.duration, 'isValid:', this.isValidDuration);
          this.cdr.detectChanges();
        }
      });
      
      this.audioElement.addEventListener('durationchange', () => {
        if (this.audioElement) {
          this.duration = this.audioElement.duration;
          this.isValidDuration = !isNaN(this.duration) && isFinite(this.duration) && this.duration > 0;
          console.log('Duration changed:', this.duration, 'isValid:', this.isValidDuration);
          this.cdr.detectChanges();
        }
      });
      
      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
        this.clearProgressInterval();
        if (this.audioElement) {
          this.currentTime = 0;
          this.audioElement.currentTime = 0;
        }
        this.cdr.detectChanges();
      });
      
      this.audioElement.addEventListener('error', (e) => {
        console.error('Audio element error:', e);
        // Handle the error gracefully
        this.isPlaying = false;
        this.isValidDuration = false;
        this.cdr.detectChanges();
      });
      
      this.audioElement.addEventListener('timeupdate', () => {
        if (this.audioElement) {
          this.currentTime = this.audioElement.currentTime;
          this.cdr.detectChanges();
        }
      });
      
      // Force the audio element to load
      this.audioElement.load();
    } catch (error) {
      console.error('Error setting up audio:', error);
      this.cleanupAudio();
    }
  }
  
  togglePlayPause(): void {
    if (!this.audioElement) return;
    
    try {
      if (this.isPlaying) {
        console.log('Pausing audio');
        this.audioElement.pause();
        this.clearProgressInterval();
      } else {
        console.log('Playing audio');
        const playPromise = this.audioElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playback started successfully');
              this.startProgressTracking();
            })
            .catch(error => {
              console.error('Error playing audio:', error);
              // Handle play error (e.g., autoplay policy)
              this.isPlaying = false;
            });
        } else {
          this.startProgressTracking();
        }
      }
      
      this.isPlaying = !this.isPlaying;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error in togglePlayPause:', error);
      this.isPlaying = false;
      this.cdr.detectChanges();
    }
  }
  
  private startProgressTracking(): void {
    this.clearProgressInterval();
    
    // Update immediately before starting the interval
    if (this.audioElement) {
      this.currentTime = this.audioElement.currentTime;
      this.cdr.detectChanges();
    }
    
    this.progressInterval = setInterval(() => {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime;
        this.cdr.detectChanges(); // Ensure UI updates
      }
    }, 100); // Update more frequently for smoother progress
  }
  
  private clearProgressInterval(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
  
  onProgressBarClick(event: MouseEvent): void {
    if (!this.audioElement || this.duration === 0) return;
    
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    
    const newTime = this.duration * clickPosition;
    this.audioElement.currentTime = newTime;
    this.currentTime = newTime;
  }
  
  formatTime(seconds: number): string {
    // Handle invalid values
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return '00:00';
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  getProgressPercentage(): number {
    if (!this.isValidDuration || this.duration <= 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }
} 