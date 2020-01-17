import { Direction } from "../../../types/Direction";
import { Action } from "../../../types/Action";
import { GameState } from "../../../types/GameState";
import { State } from "../../../types/State";
import { Point } from "../../../types/Point";
import { moveSnake, movePoint, pointsAreEqual } from "../../GameLogic/GameFunctions";
import { Danger } from "../../../types/Danger";
import { Snake } from "../../../types/Snake";
import { FoodDirection } from "../../../types/FoodDirection";

export const mapActionToDirection = (
  action: string | Action,
  currentDir: Direction
): Direction => {
  if (action !== Action.FORWARD)
    switch (currentDir) {
      case Direction.UP:
        if (action === Action.LEFT) {
          return Direction.LEFT;
        } else if (action === Action.RIGHT) {
          return Direction.RIGHT;
        }
        break;
      case Direction.RIGHT:
        if (action === Action.LEFT) {
          return Direction.UP;
        } else if (action === Action.RIGHT) {
          return Direction.DOWN;
        }
        break;
      case Direction.DOWN:
        if (action === Action.LEFT) {
          return Direction.RIGHT;
        } else if (action === Action.RIGHT) {
          return Direction.LEFT;
        }
        break;
      case Direction.LEFT:
        if (action === Action.LEFT) {
          return Direction.DOWN;
        } else if (action === Action.RIGHT) {
          return Direction.UP;
        }
        break;
      default:
        return Direction.RIGHT;
    }
  return currentDir;
};

export const simplifyState = (
  gameState: GameState,
  InputDirection: Direction,
  actions: (Action | string)[],
  boardWidth: number,
  boardHeight: number
): State => {
  const { Snake, FoodLocation } = gameState;
  const headCoordinate: Point = Snake.coordinates[Snake.coordinates.length - 1];
  const snakeHeadDir: Direction = Snake.directions[Snake.directions.length - 1];
  const foodDir: FoodDirection = getFoodDirection(
    headCoordinate,
    FoodLocation,
    boardWidth,
    boardHeight
  );
  const danger: Danger = getDanger(
    Snake,
    snakeHeadDir,
    InputDirection,
    boardWidth,
    boardHeight,
    actions
  );

  const state: State = {
    Danger: danger,
    SnakeDirection: snakeHeadDir,
    FoodDirection: foodDir
  };

  return state;
};

export const getFoodDirection = (
  headCoordinate: Point,
  FoodLocation: Point,
  boardWidth: number,
  boardHeight: number
): FoodDirection => {
  // Flip direction if its shorter to go through a wall
  const flipX: boolean = Math.abs(FoodLocation.x - headCoordinate.x) > boardWidth / 2;
  const flipY: boolean = Math.abs(FoodLocation.y - headCoordinate.y) > boardHeight / 2;
  if (FoodLocation.x > headCoordinate.x) {
    return flipX ? FoodDirection.LEFT : FoodDirection.RIGHT;
  } else if (FoodLocation.x < headCoordinate.x) {
    return flipX ? FoodDirection.RIGHT : FoodDirection.LEFT;
  } else if (FoodLocation.y > headCoordinate.y) {
    return flipY ? FoodDirection.UP : FoodDirection.DOWN;
  } else if (FoodLocation.y < headCoordinate.y) {
    return flipY ? FoodDirection.DOWN : FoodDirection.UP;
  } else {
    return FoodDirection.NONE;
  }
};

const getDanger = (
  Snake: Snake,
  snakeHeadDir: Direction,
  InputDirection: Direction,
  boardWidth: number,
  boardHeight: number,
  actions: (Action | string)[]
): Danger => {
  const headCoordinate: Point = Snake.coordinates[Snake.coordinates.length - 1];
  const movedSnake: Snake = moveSnake(Snake, InputDirection, boardWidth, boardHeight);

  const imminentDangers: number[] = new Array<number>(actions.length);
  for (let actionId = 0; actionId < imminentDangers.length; actionId++) {
    imminentDangers[actionId] = 0;

    const action: Action | string = actions[actionId];
    const realAction: Direction = mapActionToDirection(action, snakeHeadDir);
    const peekHeadCoordinate: Point = movePoint(
      headCoordinate,
      realAction,
      boardWidth,
      boardHeight
    );

    for (let i = 0; i < movedSnake.coordinates.length - 1; i++) {
      const element: Point = movedSnake.coordinates[i];
      if (pointsAreEqual(peekHeadCoordinate, element)) {
        imminentDangers[actionId] = 1;
        break;
      }
    }
  }

  let sum: number = 0;
  imminentDangers.forEach((isDangerous: number, index: number) => {
    sum += isDangerous * Math.pow(2, imminentDangers.length - index - 1);
  });

  return sum;
};
