export {};

declare global {
  interface Window {
    RNBridge?: {
      sendScore: (score: number) => void;
      gameOver: (finalScore: number) => void;
      complete: (score: number) => void;
    };
  }
}
