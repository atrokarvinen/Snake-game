import * as React from "react";

interface ParameterInputProps {
  labelText: string;
  value: string;
  onTextChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ParameterInput: React.FunctionComponent<ParameterInputProps> = props => {
  return (
    <div>
      <label>{props.labelText}</label>
      <input type="text" onChange={props.onTextChangeHandler} value={props.value}></input>
    </div>
  );
};

export default ParameterInput;
