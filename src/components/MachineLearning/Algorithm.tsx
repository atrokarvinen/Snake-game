import * as React from "react";
import { Direction } from "../../types/Direction";
import { isNumber } from "util";
import GameLogic from "../GameLogic/GameLogic";
import {
  takeGameStep,
  generatePointPool,
  initializeGame
} from "../GameLogic/GameFunctions";
import { GameState } from "../../types/GameState";
import { State } from "../../types/State";
import { Action } from "../../types/Action";
import { Danger } from "../../types/Danger";
import { StateActionPair } from "../../types/StateActionPair";
import { mapActionToDirection, simplifyState } from "./AlgorithmFunctions";
import { testDanger, testDirection, testFoodDirection } from "./Testing";
import { FoodDirection } from "../../types/FoodDirection";

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
  gameInitialized: boolean;
  currentState: State;
}

export default class Algorithm extends React.Component<AlgorithmProps, AlgorithmState> {
  private Q: number[];
  private Alpha: number; // Learning rate
  private Gamma: number; // Discount factor
  private Epsilon: number; // Epsilon greedy
  private t: number; // Time

  private TrainingIteration: number;
  private CumulativeReward: number;

  private Actions: (string | Action)[];
  private Dangers: (string | Danger)[];
  private Directions: (string | Direction)[];
  private FoodDirections: (string | FoodDirection)[];

  private pointPool: number[];

  private iterate: NodeJS.Timeout;
  private gameRunning: boolean;

  constructor(props: AlgorithmProps) {
    super(props);

    this.state = {
      gameState: initializeGame(),
      currentState: {
        Danger: Danger.NONE,
        FoodDirection: FoodDirection.DOWN,
        SnakeDirection: Direction.DOWN
      },
      gameInitialized: false
    };

    this.TrainingIteration = 0;
    this.CumulativeReward = 0;

    this.Alpha = 1.0;
    this.Gamma = 0.8;
    this.Epsilon = 0.02;
    this.t = 0;
    this.Q = [];
    this.Actions = [];
    this.Dangers = [];
    this.Directions = [];
    this.FoodDirections = [];
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
      return isNumber(value);
    });
    this.Directions = Object.values(Direction).filter((value: string | Direction) => {
      return isNumber(value);
    });
    this.FoodDirections = Object.values(FoodDirection).filter((value: string | FoodDirection) => {
      return isNumber(value);
    });

    // Initialize Q
    const permutations: number =
      this.Actions.length *
      this.Dangers.length *
      this.Directions.length *
      this.FoodDirections.length;
    for (let i = 0; i < permutations; i++) {
      this.Q.push(0.0);
    }

    console.log(
      `Q size: ${this.Actions.length} x ${this.Dangers.length} x ${this.Directions.length} x ${this.FoodDirections.length} = ${permutations}`
    );

    // testDanger();
    // testDirection();
    // testFoodDirection(this.props.boardWidth, this.props.boardHeight);
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

      const newGame: GameState = initializeGame();
      const inputDirection: Direction =
        newGame.Snake.directions[newGame.Snake.directions.length - 1];

      const currentState: State = simplifyState(
        newGame,
        inputDirection,
        this.Actions,
        this.props.boardWidth,
        this.props.boardHeight
      );

      this.setState({
        gameState: newGame,
        currentState: currentState,
        gameInitialized: true
      });
      this.props.gameStarted();
      this.gameRunning = true;
    }

    if (this.state.gameState.IsOver || this.t > maxTurns) {
      this.props.gameOver(true);
      this.gameRunning = false;
      console.log("Game over. Turns: " + this.t + ". Score: " + this.props.score);
    } else if (this.gameRunning && this.state.gameInitialized) {
      this.playSingleGame();
    }
  };

  playSingleGame = async () => {
    const { gameState, currentState } = this.state;

    // console.log("Turn: " + this.t);

    // const action: Action = Action.RIGHT;
    const action: Action = this.usePolicy(currentState);
    const inputDirection = mapActionToDirection(action, currentState.SnakeDirection);

    // console.log(`Turn #${this.t} Action = ${action} => ${inputDirection}`);

    const newGameState: GameState = takeGameStep(
      gameState,
      inputDirection,
      this.props.boardWidth,
      this.props.boardHeight,
      this.pointPool
    );

    const newState: State = simplifyState(
      newGameState,
      inputDirection,
      this.Actions,
      this.props.boardWidth,
      this.props.boardHeight
    );
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

    this.t++;

    this.setState({
      gameState: newGameState,
      currentState: newState
    });
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
    const foodDir: FoodDirection = Math.floor(id / l0);
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
    const epsilonFade: number = Math.pow(0.8, this.TrainingIteration);
    const explore: boolean =
      this.Epsilon + (1 - this.Epsilon) * epsilonFade > Math.random();
    if (explore) {
      const value: number = Math.round(Math.random() * this.Actions.length - 0.5);
      return value;
    } else {
      const rewards: number[] = this.GetQRewards(state);
      const value: number = Number(this.Actions[rewards.indexOf(Math.max(...rewards))]);
      return value;
    }
  };

  getReward = (gameState: GameState): number => {
    if (gameState.AddScore) {
      return 1;
    } else if (gameState.IsOver) {
      return -5;
    }
    return -0.01;
  };

  public render() {
    return (
      <GameLogic
        boardHeight={this.props.boardHeight}
        boardWidth={this.props.boardWidth}
        updateScore={this.props.updateScore}
        gameOver={() => this.props.gameOver(true)}
        paused={false}
        start={false}
        humanControlled={false}
        aiGameState={this.state.gameState}
        gameStarted={() => {}}
      />
    );
  }
}
