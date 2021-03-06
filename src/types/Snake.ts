import { Direction } from "./Direction";
import { Point } from "./Point";

export type Snake = {
    directions: Array<Direction>;
    coordinates: Array<Point>;
    eatPoints: Array<Point>;
    growthTimers: Array<number>;
}