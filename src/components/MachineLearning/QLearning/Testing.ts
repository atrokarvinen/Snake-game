import { Danger } from "../../../types/Danger";
import { Direction } from "../../../types/Direction";
import { Action } from "../../../types/Action";
import { StateActionPair } from "../../../types/StateActionPair";
import { mapActionToDirection, getFoodDirection } from "./AlgorithmFunctions";
import { isNumber } from "util";
import { FoodDirection } from "../../../types/FoodDirection";
import { Point } from "../../../types/Point";

export const testDirection = () => {
  const actionStrs: string[] = getEnumStrings(Action);
  const dirStrs: string[] = getEnumStrings(Direction);
  for (let i = 0; i < actionStrs.length; i++) {
    for (let j = 0; j < dirStrs.length; j++) {
      const realDir: Direction = mapActionToDirection(i, j);
      console.log(
        `Head dir ${dirStrs[j]}, action ${actionStrs[i]} => ${dirStrs[realDir]}`
      );
    }
  }
};

export const testFoodDirection = (boardWidth: number, boardHeight: number) => {
  const foodDirStrs: string[] = getEnumStrings(FoodDirection);
  const foodLocation: Point = { x: 2, y: 2 };
//   const foodLocation: Point = { x: boardWidth / 2, y: boardHeight / 2 };
  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
      const p: Point = { x: x, y: y };
      const dir: FoodDirection = getFoodDirection(p, foodLocation, boardWidth, boardHeight);
      console.log(`From (${p.x}, ${p.y}) to (${foodLocation.x}, ${foodLocation.y}) => [${foodDirStrs[dir]}]`)
    }
  }
};

export const testDanger = () => {
  const dangersStr: string[] = getEnumStrings(Danger);
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        const imminentDangers: number[] = [i, j, k];
        let sum: number = 0;
        imminentDangers.forEach((isDangerous: number, index: number) => {
          sum += isDangerous * Math.pow(2, imminentDangers.length - index - 1);
        });
        const danger: Danger = sum;
        console.log(`Danger (${i}, ${j}, ${k}) => ${danger} => ${dangersStr[danger]}`);
      }
    }
  }
};

export const testQMappings = () => {
  const dirStrs: string[] = getEnumStrings(Direction);
  const dangersStrs: string[] = getEnumStrings(Danger);
  const actionStrs: string[] = getEnumStrings(Action);
  for (let foodDir = 0; foodDir < dirStrs.length; foodDir++) {
    for (let snakeDir = 0; snakeDir < dirStrs.length; snakeDir++) {
      for (let danger = 0; danger < dangersStrs.length; danger++) {
        for (let action = 0; action < actionStrs.length; action++) {
          const sa: StateActionPair = {
            Action: action,
            State: { Danger: danger, FoodDirection: foodDir, SnakeDirection: snakeDir }
          };
          //   const id = MapStateActionToId(sa);
          //   const s: StateActionPair = MapIdToState(id);
          //   console.log(
          //     `(${action}, ${danger}, ${snakeDir}, ${foodDir}) => ${id} => (${s.Action}, ${s.State.Danger}, ${s.State.SnakeDirection}, ${s.State.FoodDirection})`
          //   );
        }
      }
    }
  }
};

const getEnumStrings = (o: Object): string[] => {
  const strings: string[] = Object.keys(o).filter((value: string) => {
    return isNaN(Number(value));
  });
  return strings;
};

const getEnumValues = (o: Object): number[] => {
  const values: string[] = Object.keys(o).filter((value: string) => {
    return isNumber(Number(value));
  });
  return values.map((value: string) => {
    return Number(value);
  });
};
