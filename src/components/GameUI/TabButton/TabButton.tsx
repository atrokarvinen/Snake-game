import "./TabButton.css";
import * as React from "react";

interface TabButtonProps {
  id: number;
  selectedId: number;
  src: string;
  text: string;
  onClick: () => void;
}

const TabButton: React.FunctionComponent<TabButtonProps> = props => {
  const getClassName = (): string => {
    return props.id === props.selectedId ? "tab-button selected" : "tab-button";
  };

  return (
    <div className={getClassName()}>
      <img
        className="tab-image"
        onClick={props.onClick}
        src={props.src}
        alt=""
        width="50"
        height="50"
      />
      <label>{props.text}</label>
    </div>
  );
};

export default TabButton;
