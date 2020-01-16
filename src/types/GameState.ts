import { Point } from "./Point";
import { Snake } from "./Snake";

export type GameState = {
  Snake: Snake;
  FoodLocation: Point;
  IsOver: boolean;
  Turn: number;
  AddScore: boolean;
};
