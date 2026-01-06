
export interface GameState {
  diceCount: number;
  lastRoll: number[];
  isRolling: boolean;
  history: GameTurn[];
}

export interface GameTurn {
  timestamp: number;
  roll: number[];
  total: number;
  diceCount: number;
}

export interface AiResponse {
  message: string;
  mood: 'happy' | 'taunting' | 'impressed' | 'neutral';
}
