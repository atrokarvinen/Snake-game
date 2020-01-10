import "./GameLogic.css";
import * as React from "react";
import Grid from "../Grid/Grid";
import { Snake } from "../../types/Snake";
import { Point } from "../../types/Point";
import { Direction } from "../../types/Direction";

export interface GameLogicProps {
  boardWidth: number;
  boardHeight: number;
  paused: boolean;
  start: boolean;

  updateScore: (increment: number) => void;
  gameOver: () => void;
  gameStarted: () => void;
}

export interface GameLogicState {
  turn: number;
  snake: Snake;
  nextDirection: Direction;
  food: Point;
  score: number;
}

export default class GameLogic extends React.Component<GameLogicProps, GameLogicState> {
  tickStep: NodeJS.Timeout;
  intervalID: any;
  pointPool: Array<number> = [];

  constructor(props: GameLogicProps) {
    super(props);

    this.state = this.initializeState();

    console.log("int");
    this.tickStep = setInterval(this.performGameStep, 100);
    for (let row = 0; row < this.props.boardHeight; row++) {
      for (let col = 0; col < this.props.boardWidth; col++) {
        const p: Point = { x: col, y: row };
        const cellNumber: number = this.pointToNumber(p);
        this.pointPool.push(cellNumber);

        // const c: Point = this.numberToPoint(cellNumber);
        // console.log(`Point (${p.x}, ${p.y}) => ${cellNumber} => (${c.x}, ${c.y})`);
      }
    }
  }

  initializeState(): Readonly<GameLogicState> {
    return {
      snake: this.initializeSnake(),
      turn: 0,
      food: { x: this.props.boardHeight - 1, y: this.props.boardWidth - 1 },
      nextDirection: "right",
      score: 0
    };
  }

  initializeSnake = (): Snake => {
    const coords: Array<Point> = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ];
    const directions: Array<Direction> = ["right", "right", "right", "right", "right"];
    return {
      coordinates: coords,
      directions: directions,
      hasEaten: false,
      eatPoints: [],
      growthTimers: []
    };
  };

  componentDidMount() {
    window.addEventListener("keydown", this.keyDownHandler);
  }

  keyDownHandler = (event: KeyboardEvent) => {
    // console.log(`Key pressed: ${event.key}`)

    let snakeDirection: Direction;
    switch (event.key) {
      case "ArrowUp":
        snakeDirection = "up";
        break;
      case "ArrowDown":
        snakeDirection = "down";
        break;
      case "ArrowLeft":
        snakeDirection = "left";
        break;
      case "ArrowRight":
        snakeDirection = "right";
        break;
      case " ":
        this.performGameStep();
        return;
      default:
        // this.performGameStep();
        return;
    }
    this.setSnakeDirection(snakeDirection);
  };

  setSnakeDirection = (direction: Direction) => {
    const newSnake: Snake = { ...this.state.snake };

    const N: number = newSnake.coordinates.length;

    // Check illegal direction changes.
    const currentDirection: Direction = newSnake.directions[N - 1];
    if (direction === "down" && currentDirection === "up") {
      return;
    } else if (direction === "up" && currentDirection === "down") {
      return;
    } else if (direction === "left" && currentDirection === "right") {
      return;
    } else if (direction === "right" && currentDirection === "left") {
      return;
    }

    this.setState({
      nextDirection: direction
    });
  };

  performGameStep = () => {
    if (this.props.start)
    {
      this.setState({
        snake: this.initializeSnake(),
        turn: 0,
        food: { x: this.props.boardHeight - 1, y: this.props.boardWidth - 1 },
        nextDirection: "right"
      });

      this.props.gameStarted();

      return;
    }

    if (this.props.paused) {
      return;
    }

    console.log("Turn #" + this.state.turn);
    const { snake } = this.state;

    const newSnake: Snake = { ...snake };
    const newCoordinates: Array<Point> = [...snake.coordinates];
    const newDirections: Array<Direction> = [...snake.directions];
    for (let index = 0; index < snake.coordinates.length; index++) {
      const point: Point = snake.coordinates[index];
      let newY: number = 0;
      let newX: number = 0;
      switch (snake.directions[index]) {
        case "up":
          if (point.y === 0) {
            newY = this.props.boardHeight - 1;
          } else {
            newY = point.y - 1;
          }
          newX = point.x;
          break;
        case "right":
          if (point.x === this.props.boardWidth - 1) {
            newX = 0;
          } else {
            newX = point.x + 1;
          }
          newY = point.y;
          break;
        case "down":
          if (point.y === this.props.boardHeight - 1) {
            newY = 0;
          } else {
            newY = point.y + 1;
          }
          newX = point.x;
          break;
        case "left":
          if (point.x === 0) {
            newX = this.props.boardWidth - 1;
          } else {
            newX = point.x - 1;
          }
          newY = point.y;
          break;
        default:
          break;
      }

      // Set next direction to next snake part. If it's the head, keep direction.
      let newDirection: Direction;
      if (index + 1 < snake.coordinates.length) {
        newDirection = snake.directions[index + 1];
      } else {
        newDirection = this.state.nextDirection;
      }

      const newPoint: Point = { x: newX, y: newY };
      newCoordinates[index] = newPoint;
      newDirections[index] = newDirection;

      // console.log(
      //   `Moving part #${index} from point (${point.x}, ${point.y}) [${snake.directions[index]}] to point (${newPoint.x}, ${newPoint.y})`
      // );
    }

    newSnake.coordinates = newCoordinates;
    newSnake.directions = newDirections;

    const headCoordinate: Point = newCoordinates[newCoordinates.length - 1];
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

    if (selfIntersect !== -1) {
      this.props.gameOver();
      return;
    }

    const snakeEats: boolean =
      headCoordinate.x === this.state.food.x && headCoordinate.y === this.state.food.y;

    let newFood: Point;
    if (snakeEats) {
      console.log("Snake eats.");
      newSnake.hasEaten = true;
      newSnake.eatPoints.push(this.state.food);

      newSnake.growthTimers.push(
        this.state.turn + snake.coordinates.length + snake.growthTimers.length
      );
      console.log(
        `Snake grows at turn = ${this.state.turn} + ${snake.coordinates.length} ${
          snake.growthTimers.length
        } = ${this.state.turn + snake.coordinates.length + snake.growthTimers.length}`
      );

      this.setState({
        score: this.state.score + 1
      });
      newFood = this.spawnNewFood(newCoordinates);

      this.props.updateScore(1);
    } else {
      newFood = this.state.food;
    }

    if (
      newSnake.growthTimers.length > 0 &&
      newSnake.growthTimers[0] === this.state.turn
    ) {
      console.log("Time to grow.");
      newSnake.growthTimers.splice(0, 1);
      const eatPoint: Point[] = newSnake.eatPoints.splice(0, 1);
      newSnake.coordinates = eatPoint.concat(newSnake.coordinates);
      newSnake.directions = [snake.directions[0]].concat(newSnake.directions);
    }

    this.setState({
      snake: newSnake,
      turn: this.state.turn + 1,
      food: newFood
    });

    // this.spawnNewFood(snake.coordinates);
  };

  spawnNewFood(snakeCoordinates: Array<Point>): Point {
    const availablePoints: Array<number> = [...this.pointPool];

    snakeCoordinates.forEach((p: Point, index: number) => {
      const num: number = this.pointToNumber(p);
      availablePoints.splice(num - index, 1);
    });

    const rng: number = Math.round(Math.random() * (availablePoints.length - 1));
    return this.numberToPoint(availablePoints[rng]);
  }

  pointToNumber(p: Point): number {
    return p.y * this.props.boardWidth + p.x;
  }

  numberToPoint(num: number): Point {
    const x: number = num % this.props.boardWidth;
    const y: number = Math.floor(num / this.props.boardWidth);
    return { x: x, y: y };
  }

  public render() {
    return (
      <Grid
        snake={this.state.snake}
        food={this.state.food}
        boardWidth={this.props.boardWidth}
        boardHeight={this.props.boardHeight}
      />
    );
  }
}
