import "./GameUI.css";
import * as React from "react";
import GameLogic from "../GameLogic/GameLogic";
import ParameterInput from "./ParameterInput";
import Card from "../Card/Card";
import GameOverModal from "./GameOverModal/GameOverModal";

export interface GameUIProps {}

export interface GameUIState {
  paused: boolean;
  boardWidth: number;
  boardHeight: number;
  gameSpeed: number;
  selectedTab: number;
  score: number;
  highScore: number;
  gameOver: boolean;
  startGame: boolean;
}

export default class GameUI extends React.Component<GameUIProps, GameUIState> {
  constructor(props: GameUIProps) {
    super(props);

    this.state = {
      paused: true,
      boardWidth: 10,
      boardHeight: 10,
      gameSpeed: 100,
      selectedTab: 0,
      score: 0,
      highScore: 0,
      gameOver: false,
      startGame: false
    };
  }

  updateScore = (increment: number) => {
    this.setState({
      score: this.state.score + increment
    });
  };

  startNewGame = () => {
    if (this.state.score > this.state.highScore) {
      this.setState({ highScore: this.state.score });
    }
    this.setState({
      score: 0,
      gameOver: false,
      startGame: true,
      paused: true
    });
  };

  gameOver = () => {
    this.setState({
      gameOver: true
    });
  };

  gridWidthChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const width: number = parseInt(event.target.value);
    const widthMin: number = 5;
    const widthMax: number = 40;
    if (widthMin < width && width < widthMax) {
      this.setState({
        boardWidth: width
      });
    } else {
      alert(`Width must be in range (${widthMin}, ${widthMax})`);
    }
  };

  gridHeightChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const height: number = parseInt(event.target.value);
    const heightMin: number = 5;
    const heightMax: number = 40;
    if (heightMin < height && height < heightMax) {
      this.setState({
        boardHeight: height
      });
    } else {
      alert(`Height must be in range (${heightMin}, ${heightMax})`);
    }
  };

  gameSpeedChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gameSpeed: number = parseInt(event.target.value);
    const gameSpeedMin: number = 50;
    const gameSpeedMax: number = 1000;
    if (gameSpeedMin < gameSpeed && gameSpeed < gameSpeedMax) {
      this.setState({
        gameSpeed: gameSpeed
      });
    } else {
      alert(`Game speed must be in range (${gameSpeedMin}, ${gameSpeedMax})`);
    }
  };

  renderTab = (): JSX.Element => {
    switch (this.state.selectedTab) {
      case 0:
        return this.renderGame();
      case 1:
        return this.renderSettings();
      default:
        return <div />;
    }
  };

  renderGame = (): JSX.Element => {
    return (
      <div className="game-view">
        <div className="game-controls">
          <Card className="game-controls__card">
            <div className="control-buttons">
              <button
                className="game-controls__btn"
                onClick={() => this.setState({ paused: false })}
              >
                Continue
              </button>
              <button
                className="game-controls__btn"
                onClick={() => this.setState({ paused: true })}
              >
                Pause
              </button>
            </div>
            <div className="game-scores">
              <label className="game-scores__label">Score: {this.state.score}</label>
              <label className="game-scores__label">
                High score: {this.state.highScore}
              </label>
            </div>
          </Card>
        </div>
        <div className="game-board">
          <Card className="game-board__card">
            {this.state.paused ? <p className="pause-text">Game paused</p> : null}
            {this.state.gameOver ? (
              <GameOverModal
                score={this.state.score}
                highScore={this.state.highScore}
                closeHandler={() => this.startNewGame()}
              />
            ) : null}
            <GameLogic
              boardWidth={this.state.boardWidth}
              boardHeight={this.state.boardHeight}
              paused={this.state.paused}
              updateScore={this.updateScore}
              gameOver={this.gameOver}
              start={this.state.startGame}
              gameStarted={() => this.setState({ startGame: false })}
            />
          </Card>
        </div>
      </div>
    );
  };

  renderSettings = (): JSX.Element => {
    return (
      <div className="game-settings">
        <Card>
          <ParameterInput
            labelText="Grid width:"
            onTextChangeHandler={this.gridWidthChangeHandler}
            value={this.state.boardWidth.toString()}
          />
          <ParameterInput
            labelText="Grid height:"
            onTextChangeHandler={this.gridHeightChangeHandler}
            value={this.state.boardHeight.toString()}
          />
          <ParameterInput
            labelText="Game speed:"
            onTextChangeHandler={this.gameSpeedChangeHandler}
            value={this.state.gameSpeed.toString()}
          />
        </Card>
      </div>
    );
  };

  public render() {
    return (
      <div className="ui">
        <div className="ui__tab">{this.renderTab()}</div>
        <div className="nav">
          <Card>
            <div className="nav__buttons">
              <img
                className="tab-image"
                onClick={() => this.setState({ selectedTab: 0 })}
                src="home_icon-icons.com_73532.png"
                alt=""
                width="50"
                height="50"
              />
              <img
                className="tab-image"
                onClick={() => this.setState({ selectedTab: 1 })}
                src="cog-4-512.png"
                alt=""
                width="50"
                height="50"
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
