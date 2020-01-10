import "./Card.css";
import * as React from "react";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  overflow?: "hidden" | "auto";
}

const Card: React.FunctionComponent<CardProps> = props => {
  const overflow: string = props.overflow ? props.overflow : "hidden";

  const style: React.CSSProperties = {overflow: overflow}
  return (
      <div className={`card ${props.className}`} style={style} >{props.children}</div>
  );
};

export default Card;
