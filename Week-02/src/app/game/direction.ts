export enum Direction {
   Up = "up",
   Down = "down",
   Left = "left",
   Right = "right"
}

export function randomDirection(): Direction {
   return Object.values(Direction)[Math.floor(Math.random() * 4)] as Direction;
}
