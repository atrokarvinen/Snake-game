import "./GameOverModal.css";
import * as React from "react";

interface GameOverModalProps {
  score: number;
  highScore: number;
  closeHandler: () => void;
}

const GameOverModal: React.FunctionComponent<GameOverModalProps> = props => {
  return (
    <div className="dark-bg" onClick={props.closeHandler}>
      <div className="message-box">
        <div className="score-labels">
          <label>Game over!</label>
          <label>Score: {props.score}</label>
          {props.score > props.highScore ? (
            <label>New High score: {props.score}</label>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
