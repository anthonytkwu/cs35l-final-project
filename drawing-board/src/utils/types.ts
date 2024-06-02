import { ModalState } from "../modules/modals/slice";

export type RootState = {
  currentStroke: Stroke;
  currentGame: Game;
  strokes: Stroke[];
  historyIndex: number;
  modalVisible: ModalState;
};

export type Stroke = {
  points: Point[];
  color: string;
  size: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Game = {
    gameId: number;
    playerId: number;
    round: number;
    totalRounds: number;
    prompt: string;
}