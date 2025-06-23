// Global audio manager for persistent playback across pages
class GlobalAudioManager {
    private static instance: GlobalAudioManager;
    private audio: HTMLAudioElement | null = null;
    private tracks: string[] = [
        '/audio/ambient-background-1.mp3',
        '/audio/ambient-background-2.mp3'
    ];
    private currentTrackIndex: number = 0;
    private isInitialized: boolean = false;
    private volume: number = 0.2;
    private isPlaying: boolean = false;
    private isMuted: boolean = false;
    private listeners: Set<() => void> = new Set();

    private constructor() { }

    public static getInstance(): GlobalAudioManager {
        if (!GlobalAudioManager.instance) {
            GlobalAudioManager.instance = new GlobalAudioManager();
        }
        return GlobalAudioManager.instance;
    }

    public initialize(): void {
        if (this.isInitialized || typeof window === 'undefined') return;

        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.preload = 'auto';

        // Shuffle tracks on initialization
        this.shuffleTracks();
        this.loadCurrentTrack();        // Handle track ended - move to next track and continue playing
        this.audio.addEventListener('ended', () => {
            // Always continue playing when track ends naturally
            this.nextTrack(true);
        });

        // Handle play state changes
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.notifyListeners();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.notifyListeners();
        });

        // Add error handling
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
        });

        this.isInitialized = true;
    }

    private shuffleTracks(): void {
        for (let i = this.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
        this.currentTrackIndex = 0;
    }

    private loadCurrentTrack(): void {
        if (!this.audio) return;
        this.audio.src = this.tracks[this.currentTrackIndex];
        this.audio.load();
    } private nextTrack(shouldContinuePlaying: boolean = false): void {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;

        // If we've played all tracks, shuffle again
        if (this.currentTrackIndex === 0) {
            this.shuffleTracks();
        }

        this.loadCurrentTrack();

        // Continue playing if we were playing before or explicitly requested
        if (this.isPlaying || shouldContinuePlaying) {
            // Small delay to ensure the track is loaded
            setTimeout(() => {
                this.play();
            }, 100);
        }
    }

    public async play(): Promise<void> {
        if (!this.audio) return;

        try {
            await this.audio.play();
        } catch (error) {
            console.error('Audio play failed:', error);
        }
    }

    public pause(): void {
        if (!this.audio) return;
        this.audio.pause();
    }

    public togglePlay(): void {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    public setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.notifyListeners();
    }

    public getVolume(): number {
        return this.volume;
    }

    public toggleMute(): void {
        this.isMuted = !this.isMuted;
        if (this.audio) {
            this.audio.muted = this.isMuted;
        }
        this.notifyListeners();
    }

    public getIsPlaying(): boolean {
        return this.isPlaying;
    }

    public getIsMuted(): boolean {
        return this.isMuted;
    }

    public getCurrentTrackName(): string {
        const trackPath = this.tracks[this.currentTrackIndex];
        const trackName = trackPath.split('/').pop()?.replace('.mp3', '') || 'Unknown';
        return trackName.replace('ambient-background-', 'Track ');
    }

    public addListener(callback: () => void): void {
        this.listeners.add(callback);
    }

    public removeListener(callback: () => void): void {
        this.listeners.delete(callback);
    }

    private notifyListeners(): void {
        this.listeners.forEach(callback => callback());
    }

    public skipToNext(): void {
        this.nextTrack(this.isPlaying);
    }
}

export default GlobalAudioManager;
