import "./GameLogic.css";
import * as React from "react";
import Grid from "../Grid/Grid";
import { Snake } from "../../types/Snake";
import { Direction } from "../../types/Direction";
import { takeGameStep, initializeGame, generatePointPool } from "./GameFunctions";
import { GameState } from "../../types/GameState";

export interface GameLogicProps {
  boardWidth: number;
  boardHeight: number;
  paused: boolean;
  start: boolean;
  humanControlled: boolean;
  aiGameState?: GameState;

  updateScore: (increment: number) => void;
  gameOver: (willAutoClose: boolean) => void;
  gameStarted: () => void;
}

export interface GameLogicState {
  inputDirection: Direction;
  gameState: GameState;
}

export default class GameLogic extends React.Component<GameLogicProps, GameLogicState> {
  gameTick: NodeJS.Timeout | undefined;
  pointPool: Array<number> = [];

  constructor(props: GameLogicProps) {
    super(props);

    this.state = {
      inputDirection: Direction.RIGHT,
      gameState: initializeGame()
    };

    this.pointPool = generatePointPool(this.props.boardWidth, this.props.boardHeight);
  }

  componentDidMount() {
    if (this.props.humanControlled) {
      window.addEventListener("keydown", this.keyDownHandler);
      this.gameTick = setInterval(this.performGameStep, 100);
    }
  }

  componentWillUnmount() {
    if (this.gameTick) {
      clearInterval(this.gameTick);
    }
  }

  keyDownHandler = (event: KeyboardEvent) => {
    // console.log(`Key pressed: ${event.key}`)

    let snakeDirection: Direction;
    switch (event.key) {
      case "ArrowUp":
        snakeDirection = Direction.UP;
        break;
      case "ArrowDown":
        snakeDirection = Direction.DOWN;
        break;
      case "ArrowLeft":
        snakeDirection = Direction.LEFT;
        break;
      case "ArrowRight":
        snakeDirection = Direction.RIGHT;
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
    const newSnake: Snake = { ...this.state.gameState.Snake };

    const N: number = newSnake.coordinates.length;

    // Check illegal direction changes.
    const currentDirection: Direction = newSnake.directions[N - 1];
    if (direction === Direction.DOWN && currentDirection === Direction.UP) {
      return;
    } else if (direction === Direction.UP && currentDirection === Direction.DOWN) {
      return;
    } else if (direction === Direction.LEFT && currentDirection === Direction.RIGHT) {
      return;
    } else if (direction === Direction.RIGHT && currentDirection === Direction.LEFT) {
      return;
    }

    this.setState({
      inputDirection: direction
    });
  };

  performGameStep = () => {
    if (this.props.start) {
      this.setState({
        inputDirection: Direction.RIGHT,
        gameState: initializeGame()
      });

      this.props.gameStarted();

      return;
    }

    if (this.props.paused) {
      return;
    }

    console.log("Turn #" + this.state.gameState.Turn);

    // const { snake, food, nextDirection } = this.state;
    // const newSnake: Snake = this.updateSnake(snake, nextDirection, food, this.state.turn);
    const newGameState: GameState = this.updateGame(this.state.gameState);

    // Handle game over
    if (newGameState.IsOver) {
      this.props.gameOver(false);
      return;
    }

    this.setState({
      gameState: newGameState
    });

    // this.setState({
    //   snake: newSnake,
    //   turn: this.state.turn + 1
    // });

    // this.spawnNewFood(snake.coordinates);
  };

  updateGame = (gameState: GameState): GameState => {
    const newGameState: GameState = takeGameStep(
      gameState,
      this.state.inputDirection,
      this.props.boardWidth,
      this.props.boardHeight,
      this.pointPool
    );

    if (newGameState.AddScore) {
      // this.setState({
      //   score: this.state.score + 1,
      //   food: newGameState.FoodLocation
      // });
      this.props.updateScore(1);
    }

    return newGameState;
  };

  public render() {
    const { boardWidth, boardHeight } = this.props;
    const { Snake, FoodLocation } = this.props.aiGameState
      ? this.props.aiGameState
      : this.state.gameState;
    return (
      <Grid
        snake={Snake}
        food={FoodLocation}
        boardWidth={boardWidth}
        boardHeight={boardHeight}
      />
    );
  }
}
