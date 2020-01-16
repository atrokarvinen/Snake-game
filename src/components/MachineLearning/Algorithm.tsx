import * as React from "react";
import { Direction } from "../../types/Direction";
import { isNumber } from "util";
import GameLogic from "../GameLogic/GameLogic";
import { Snake } from "../../types/Snake";
import {
  moveSnake,
  movePoint,
  pointsAreEqual,
  takeGameStep,
  generatePointPool,
  initializeGame
} from "../GameLogic/GameFunctions";
import { Point } from "../../types/Point";
import { GameState } from "../../types/GameState";

enum Action {
  LEFT,
  FORWARD,
  RIGHT
}

enum Danger {
  NONE,
  RIGHT,
  FORWARD,
  FORWARD_AND_RIGHT,
  LEFT,
  LEFT_AND_RIGHT,
  LEFT_AND_FORWARD,
  LEFT_AND_FORWARD_AND_RIGHT
}

declare type State = {
  Danger: Danger;
  SnakeDirection: Direction;
  FoodDirection: Direction;
};

declare type StateActionPair = {
  State: State;
  Action: Action;
};

export interface AlgorithmProps {
  boardWidth: number;
  boardHeight: number;
  paused: boolean;
  score: number;
  startGame: boolean;
  updateScore: (increment: number) => void;
  gameOver: (willAutoClose: boolean) => void;
  gameStarted: () => void;
}

export interface AlgorithmState {
  gameState: GameState;
}

export default class Algorithm extends React.Component<AlgorithmProps, AlgorithmState> {
  private Q: number[];
  private Alpha: number; // Learning rate
  private Gamma: number; // Discount factor
  private Epsilon: number; // Epsilon greedy
  private t: number; // Time

  private TrainingIteration: number;
  private TrainingIterationPrev: number;
  private CumulativeReward: number;

  private Actions: (string | Action)[];
  private Dangers: (string | Danger)[];
  private Directions: (string | Direction)[];

  private pointPool: number[];

  private iterate: NodeJS.Timeout;
  private gameRunning: boolean;

  constructor(props: AlgorithmProps) {
    super(props);

    this.state = {
      gameState: initializeGame()
    };

    this.TrainingIteration = 0;
    this.TrainingIterationPrev = 0;
    this.CumulativeReward = 0;

    this.Alpha = 1.0;
    this.Gamma = 0.8;
    this.Epsilon = 0.02;
    this.t = 0;
    this.Q = [];
    this.Actions = [];
    this.Dangers = [];
    this.Directions = [];
    this.pointPool = generatePointPool(this.props.boardWidth, this.props.boardHeight);
    this.iterate = setInterval(this.train, 50);
    this.gameRunning = false;
  }

  componentDidMount() {
    // Transform enumerations into number arrays
    this.Actions = Object.values(Action).filter((value: string | Action) => {
      return isNumber(value);
    });
    this.Dangers = Object.values(Danger).filter((value: string | Danger) => {
      console.log(value);
      return isNumber(value);
    });
    this.Directions = Object.values(Direction).filter((value: string | Direction) => {
      return isNumber(value);
    });

    // Initialize Q
    const permutations: number =
      this.Actions.length *
      this.Dangers.length *
      this.Directions.length *
      this.Directions.length;
    for (let i = 0; i < permutations; i++) {
      this.Q.push(0.0);
    }

    console.log(
      `Q size: ${this.Actions.length} x ${this.Dangers.length} x ${this.Directions.length} x ${this.Directions.length} = ${permutations}`
    );

    // [0, 1, 2] = [LEFT, FORWARD, RIGHT]
    // [UP, DOWN, LEFT, RIGHT]
    // const actionStr = ["LEFT", "FORWARD", "RIGHT"];
    // const dirStr = ["UP", "DOWN", "LEFT", "RIGHT"];
    // for (let i = 0; i < this.Actions.length; i++) {
    //   const action = this.Actions[i];
    //   for (let j = 0; j < this.Directions.length; j++) {
    //     const direction = this.Directions[j];
    //     const realDir: Direction = this.MapActionToDirection(i, j);
    //     console.log(
    //       `Head dir ${dirStr[j]}, action ${actionStr[i]} => ${dirStr[realDir]}`
    //     );
    //   }
    // }

    // for (let foodDir = 0; foodDir < this.Directions.length; foodDir++) {
    //   for (let snakeDir = 0; snakeDir < this.Directions.length; snakeDir++) {
    //     for (let danger = 0; danger < this.Dangers.length; danger++) {
    //       for (let action = 0; action < this.Actions.length; action++) {
    //         const sa: StateActionPair = {
    //           Action: action,
    //           State: { Danger: danger, FoodDirection: foodDir, SnakeDirection: snakeDir }
    //         };
    //         const id = this.MapStateActionToId(sa);
    //         const s: StateActionPair = this.MapIdToState(id);

    //         console.log(
    //           `(${action}, ${danger}, ${snakeDir}, ${foodDir}) => ${id} => (${s.Action}, ${s.State.Danger}, ${s.State.SnakeDirection}, ${s.State.FoodDirection})`
    //         );
    //       }
    //     }
    //   }
    // }

    // const dangersStr: string[] = Object.keys(Danger);
    // for (let i = 0; i < 2; i++) {
    //   for (let j = 0; j < 2; j++) {
    //     for (let k = 0; k < 2; k++) {
    //       const imminentDangers: number[] = [i, j, k];
    //       let sum: number = 0;
    //       imminentDangers.forEach((isDangerous: number, index: number) => {
    //         sum += isDangerous * Math.pow(2, imminentDangers.length - index - 1);
    //       })

    //       const danger: Danger = sum;

    //       console.log(`Danger (${i}, ${j}, ${k}) => ${danger} => ${dangersStr[dangersStr.length / 2 + danger]}`);
    //     }
    //   }
    // }
  }

  componentWillUnmount() {
    clearInterval(this.iterate);
  }

  train = () => {
    if (this.props.paused) {
      return;
    }
    const maxTurns: number = 10000;

    if (this.props.startGame && !this.gameRunning) {
      console.log(`Starting iteration #${this.TrainingIteration}`);
      this.t = 0;
      this.TrainingIteration++;
      this.setState({
        gameState: initializeGame()
      });
      this.props.gameStarted();
      this.gameRunning = true;
    }
    
    if (this.state.gameState.IsOver || this.t > maxTurns) {
      this.props.gameOver(true);
      this.gameRunning = false;
      console.log("Game over. Turns: " + this.t + ". Score: " + this.props.score);
    } else if (this.gameRunning) {
      this.playSingleGame();
    }
  };

  playSingleGame = async () => {
    // let gameState: GameState = initializeGame();
    // let inputDirection: Direction =
    //   gameState.Snake.directions[gameState.Snake.directions.length - 1];
    // gameState = this.takeAction(gameState, inputDirection);
    // let currentState: State = this.simplifyState(this.state.gameState, inputDirection);

    const { gameState } = this.state;

    let inputDirection: Direction =
      gameState.Snake.directions[gameState.Snake.directions.length - 1];
    let currentState: State = this.simplifyState(gameState, Direction.DOWN);

    // console.log("Turn: " + this.t);

    const action: Action = this.usePolicy(currentState);
    // const action: Action = Action.RIGHT;
    inputDirection = this.mapActionToDirection(action, currentState.SnakeDirection);

    // console.log(`Turn #${this.t} Action = ${action} => ${inputDirection}`);

    const newGameState: GameState = this.takeAction(gameState, inputDirection);
    const newState: State = this.simplifyState(newGameState, inputDirection);
    const immediateReward: number = this.getReward(newGameState);

    //Console.WriteLine($"Moved from ({_CurrentState.X}, {_CurrentState.Y})[{action}] => ({newState.X}, {newState.Y}): {immediateReward}");

    this.UpdateQ(currentState, newState, action, immediateReward);

    if (immediateReward !== 0) {
      const reward: number = Math.pow(this.Gamma, this.t) * immediateReward;
      this.CumulativeReward += reward;
      // console.log(
      //   "Cumulative reward: " + this.CumulativeReward / (this.TrainingIteration + 1)
      // );
    }

    if (gameState.AddScore) {
      this.props.updateScore(1);
    }

    currentState = newState;
    this.t++;

    this.setState({
      gameState: newGameState
    });
  };

  simplifyState = (gameState: GameState, InputDirection: Direction): State => {
    const { Snake, FoodLocation } = gameState;
    const { boardWidth, boardHeight } = this.props;
    const snakeHeadDir: Direction = Snake.directions[Snake.directions.length - 1];

    const headCoordinate: Point = Snake.coordinates[Snake.coordinates.length - 1];
    let foodDir: Direction;
    if (FoodLocation.x > headCoordinate.x) {
      foodDir = Direction.RIGHT;
    } else if (FoodLocation.x < headCoordinate.x) {
      foodDir = Direction.LEFT;
    } else if (FoodLocation.y < headCoordinate.y) {
      foodDir = Direction.DOWN;
    } else {
      foodDir = Direction.UP;
    }

    const movedSnake: Snake = moveSnake(Snake, InputDirection, boardWidth, boardHeight);
    const imminentDangers: number[] = new Array<number>(this.Actions.length);
    for (let actionId = 0; actionId < imminentDangers.length; actionId++) {
      imminentDangers[actionId] = 0;

      const action: Action | string = this.Actions[actionId];
      const realAction: Direction = this.mapActionToDirection(action, snakeHeadDir);
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

    const danger: Danger = sum;

    const state: State = {
      Danger: danger,
      SnakeDirection: snakeHeadDir,
      FoodDirection: foodDir
    };

    return state;
  };

  UpdateQ = (stateFrom: State, stateTo: State, a: Action, r: number) => {
    const sa: StateActionPair = {
      State: stateFrom,
      Action: a
    };

    const oldValue: number = this.GetQValue(sa);

    const optimalValue: number = Math.max(...this.GetQRewards(stateTo));
    const x: number =
      (1 - this.Alpha) * oldValue + this.Alpha * (r + this.Gamma * optimalValue);

    this.SetQValue(sa, x);
  };

  GetQValue(sa: StateActionPair): number {
    const qId = this.MapStateActionToId(sa);
    // console.log(`Q[${qId}] = ${this.Q[qId]}`)
    return this.Q[qId];
  }

  SetQValue(sa: StateActionPair, x: number) {
    const qId = this.MapStateActionToId(sa);
    this.Q[qId] = x;
  }

  MapStateActionToId = (sa: StateActionPair): number => {
    const id: number =
      sa.Action +
      sa.State.Danger * this.Actions.length +
      sa.State.SnakeDirection * this.Actions.length * this.Dangers.length +
      sa.State.FoodDirection *
        this.Actions.length *
        this.Dangers.length *
        this.Directions.length;
    return id;
  };

  MapIdToState = (id: number): StateActionPair => {
    const l0: number = this.Actions.length * this.Dangers.length * this.Directions.length;
    const l1: number = this.Actions.length * this.Dangers.length;
    const foodDir: Direction = Math.floor(id / l0);
    const snakeDir: Direction = Math.floor((id - foodDir * l0) / l1);
    const danger: Danger = Math.floor(
      (id - foodDir * l0 - snakeDir * l1) / this.Actions.length
    );
    const action: Action =
      id - foodDir * l0 - snakeDir * l1 - danger * this.Actions.length;

    return {
      Action: action,
      State: { Danger: danger, FoodDirection: foodDir, SnakeDirection: snakeDir }
    };
  };

  GetQRewards = (stateTo: State): number[] => {
    const rewards: number[] = new Array<number>();
    for (let i = 0; i < this.Actions.length; i++) {
      const action = this.Actions[i];
      const sa: StateActionPair = { State: stateTo, Action: Number(action) };
      rewards[i] = this.GetQValue(sa);
    }

    return rewards;
  };

  usePolicy = (state: State): Action => {
    // const explore: boolean = Math.random() < this.Epsilon;
    const epsilonFade: number = Math.pow(0.80, this.TrainingIteration);
    const explore: boolean = this.Epsilon + (1 - this.Epsilon) * epsilonFade > Math.random();
    if (explore) {
      const value: number = Math.round(Math.random() * this.Actions.length - 0.5);
      return value;
    } else {
      const rewards: number[] = this.GetQRewards(state);
      const value: number = Number(this.Actions[rewards.indexOf(Math.max(...rewards))]);
      return value;
    }
  };

  takeAction = (stateFrom: GameState, inputDirection: Direction): GameState => {
    return takeGameStep(
      stateFrom,
      inputDirection,
      this.props.boardWidth,
      this.props.boardHeight,
      this.pointPool
    );
  };

  mapActionToDirection(action: string | Action, currentDir: Direction): Direction {
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
  }

  getReward = (gameState: GameState): number => {
    if (gameState.AddScore) {
      return 1;
    } else if (gameState.IsOver) {
      return -5;
    }
    return -0.01;
  };

  algorithmUpdateScore = () => {
    this.props.updateScore(1);
  };

  algorithmGameOver = () => {
    this.props.gameOver(true);
  };

  public render() {
    return (
      <GameLogic
        boardHeight={this.props.boardHeight}
        boardWidth={this.props.boardWidth}
        updateScore={this.algorithmUpdateScore}
        gameOver={this.algorithmGameOver}
        paused={false}
        start={false}
        humanControlled={false}
        aiGameState={this.state.gameState}
        gameStarted={() => {}}
      />
    );
  }
}
