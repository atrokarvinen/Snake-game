import { Point } from "./Point";

export type TrainingProgress = {
    CumulativeRewards: Point[],
    Iteration: number,
    RandomChance: number,
}