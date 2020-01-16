import './TabButton.css'
import * as React from "react";

interface TabButtonProps {
  id: number;
  selectedId: number
  src: string;
  onClick: () => void;
}

const TabButton: React.FunctionComponent<TabButtonProps> = props => {
  const getClassName = (): string => {
      return props.id === props.selectedId ? "tab-image selected" : "tab-image";
  };

  return (
    <img
      className={getClassName()}
      onClick={props.onClick}
      src={props.src}
      alt=""
      width="50"
      height="50"
    />
  );
};

export default TabButton;
