import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
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
  audioElement: HTMLAudioElement | null = null;
  progressInterval: any = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['audioUrl'] && this.audioUrl) {
      this.setupAudio();
    }
  }
  
  ngOnDestroy(): void {
    this.clearProgressInterval();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
  }
  
  private setupAudio(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.clearProgressInterval();
    }
    
    this.audioElement = new Audio(this.audioUrl || '');
    this.isPlaying = false;
    this.currentTime = 0;
    
    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.audioElement) {
        this.duration = this.audioElement.duration;
      }
    });
    
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.clearProgressInterval();
      if (this.audioElement) {
        this.currentTime = 0;
        this.audioElement.currentTime = 0;
      }
    });
  }
  
  togglePlayPause(): void {
    if (!this.audioElement) return;
    
    if (this.isPlaying) {
      this.audioElement.pause();
      this.clearProgressInterval();
    } else {
      this.audioElement.play();
      this.startProgressTracking();
    }
    
    this.isPlaying = !this.isPlaying;
  }
  
  private startProgressTracking(): void {
    this.clearProgressInterval();
    this.progressInterval = setInterval(() => {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime;
      }
    }, 100);
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  getProgressPercentage(): number {
    if (this.duration === 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }
} 