export interface PlayerState {
  frameIndex: number;
  lastFrameTime: number;
  isPlaying: boolean;
  rafId: number | null;
}
