import { Snake } from "../../types/Snake";
import { Point } from "../../types/Point";
import { Direction } from "../../types/Direction";
import { GameState } from "../../types/GameState";

export const initializeGame = (): GameState => {
  return {
    Snake: initializeSnake(),
    FoodLocation: { x: 2, y: 2 },
    IsOver: false,
    AddScore: false,
    Turn: 0
  };
};

export const initializeSnake = (): Snake => {
  const coords: Array<Point> = [
    { x: 0, y: 0 },
    // { x: 1, y: 0 },
    // { x: 2, y: 0 },
    // { x: 3, y: 0 },
    // { x: 4, y: 0 }
  ];
  const directions: Array<Direction> = [
    Direction.RIGHT,
    // Direction.RIGHT,
    // Direction.RIGHT,
    // Direction.RIGHT,
    // Direction.RIGHT
  ];
  return {
    coordinates: coords,
    directions: directions,
    eatPoints: [],
    growthTimers: []
  };
};

export const generatePointPool = (boardWidth: number, boardHeight: number): number[] => {
  const pointPool: number[] = [];
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      const p: Point = { x: col, y: row };
      const cellNumber: number = pointToNumber(p, boardWidth);
      pointPool.push(cellNumber);
    }
  }
  return pointPool;
};

export const takeGameStep = (
  gameState: GameState,
  inputDirection: Direction,
  boardWidth: number,
  boardHeight: number,
  pointPool: number[]
): GameState => {
  const { Snake, FoodLocation, Turn } = gameState;

  // Handle move snake
  const movedSnake: Snake = moveSnake(Snake, inputDirection, boardWidth, boardHeight);

  const newCoordinates: Point[] = movedSnake.coordinates;
  const headCoordinate: Point = newCoordinates[newCoordinates.length - 1];

  // Handle eating
  let newFood: Point;
  const addScore: boolean = pointsAreEqual(headCoordinate, FoodLocation);
  if (addScore) {
    movedSnake.eatPoints.push(FoodLocation);
    movedSnake.growthTimers.push(
      Turn + Snake.coordinates.length + Snake.growthTimers.length
    );

    newFood = spawnFood(newCoordinates, boardWidth, boardHeight, pointPool);
  } else {
    newFood = gameState.FoodLocation;
  }

  // Handle growing snake
  const growDirection: Direction =
    Snake.directions.length > 1 ? Snake.directions[0] : inputDirection;
  const newSnake: Snake = growSnake(movedSnake, Turn, growDirection);

  // Handle game over
  const gameOver: boolean = isGameOver(headCoordinate, newCoordinates);

  return {
    Snake: newSnake,
    FoodLocation: newFood,
    IsOver: gameOver,
    Turn: Turn + 1,
    AddScore: addScore
  };
};

export const moveSnake = (
  snake: Snake,
  headDirection: Direction,
  boardWidth: number,
  boardHeight: number
): Snake => {
  const newCoordinates: Array<Point> = [...snake.coordinates];
  const newDirections: Array<Direction> = [...snake.directions];
  for (let index = 0; index < snake.coordinates.length; index++) {
    const point: Point = snake.coordinates[index];
    const moveDirection: Direction =
      index + 1 < snake.coordinates.length ? snake.directions[index] : headDirection;
    // const moveDirection: Direction = snake.directions[index];

    const newPoint: Point = movePoint(point, moveDirection, boardWidth, boardHeight);

    newCoordinates[index] = newPoint;

    // Set next direction to next snake part. If it's the head, keep direction.
    // let newDirection: Direction;
    // if (index + 1 < snake.coordinates.length) {
    //   newDirection = snake.directions[index + 1];
    // } else {
    //   newDirection = headDirection;
    // }

    newDirections[index] =
      index < snake.coordinates.length - 2 ? snake.directions[index + 1] : headDirection;

    // console.log(
    //   `Moving part #${index} from point (${point.x}, ${point.y}) [${moveDirection}] to point (${newPoint.x}, ${newPoint.y}) [${newDirections[index]}]`
    // );
  }

  return { ...snake, coordinates: newCoordinates, directions: newDirections };
};

export const movePoint = (
  point: Point,
  direction: Direction,
  boardWidth: number,
  boardHeight: number
): Point => {
  let newY: number = 0;
  let newX: number = 0;
  switch (direction) {
    case Direction.UP:
      if (point.y === 0) {
        newY = boardHeight - 1;
      } else {
        newY = point.y - 1;
      }
      newX = point.x;
      break;
    case Direction.RIGHT:
      if (point.x === boardWidth - 1) {
        newX = 0;
      } else {
        newX = point.x + 1;
      }
      newY = point.y;
      break;
    case Direction.DOWN:
      if (point.y === boardHeight - 1) {
        newY = 0;
      } else {
        newY = point.y + 1;
      }
      newX = point.x;
      break;
    case Direction.LEFT:
      if (point.x === 0) {
        newX = boardWidth - 1;
      } else {
        newX = point.x - 1;
      }
      newY = point.y;
      break;
    default:
      break;
  }

  // console.log(`Moved from (${point.x}, ${point.y}) [${direction}] => (${newX}, ${newY})`)

  return { x: newX, y: newY };
};

export const growSnake = (
  movedSnake: Snake,
  turn: number,
  growthDir: Direction
): Snake => {
  const grownSnake: Snake = { ...movedSnake };
  if (movedSnake.growthTimers.length > 0 && movedSnake.growthTimers[0] === turn) {
    grownSnake.growthTimers.splice(0, 1);
    const eatPoint: Point[] = grownSnake.eatPoints.splice(0, 1);
    grownSnake.coordinates = eatPoint.concat(grownSnake.coordinates);
    grownSnake.directions = [growthDir].concat(grownSnake.directions);
  }
  return grownSnake;
};

export const isGameOver = (headCoordinate: Point, newCoordinates: Point[]): boolean => {
  const selfIntersect: number = newCoordinates.findIndex((p: Point, index: Number) => {
    if (
      index < newCoordinates.length - 1 &&
      p.x === headCoordinate.x &&
      p.y === headCoordinate.y
    ) {
      return true;
    } else {
      return false;
    }
  });
  return selfIntersect !== -1;
};

export const spawnFood = (
  snakeCoordinates: Array<Point>,
  boardWidth: number,
  boardHeight: number,
  pointPool: number[]
): Point => {
  const availablePoints: Array<number> = [...pointPool];

  snakeCoordinates.forEach((p: Point, index: number) => {
    const num: number = pointToNumber(p, boardWidth);
    availablePoints.splice(num - index, 1);
  });

  const rng: number = Math.round(Math.random() * (availablePoints.length - 1));
  return numberToPoint(availablePoints[rng], boardWidth, boardHeight);
};

export const pointToNumber = (p: Point, xMax: number): number => {
  return p.y * xMax + p.x;
};

const numberToPoint = (num: number, xMax: number, yMax: number): Point => {
  const x: number = num % xMax;
  const y: number = Math.floor(num / xMax);
  return { x: x, y: y };
};

export const pointsAreEqual = (p1: Point, p2: Point): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};
