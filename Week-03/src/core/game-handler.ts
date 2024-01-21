import { Character } from "./characters";

type DrawingFunction = () => void;
type TimedFunction = (deltaTime: number) => void;
type GameLifeCheckFunction = () => boolean;

/**
 * A class for handling the game loop.
 */
export class GameHandler {
   public readonly timers: Record<string, number> = {};
   private readonly movementFunctions: Array<TimedFunction> = [];
   private readonly drawingFunctions: Array<DrawingFunction> = [];

   constructor() {}

   /**
    * Method that starts the game loop.
    * 
    * @param gameFunc the function to be called after the movements and before the drawings are handled
    * @param gameLifeCheckFunc a function that checks if the game should continue (by default it always returns true)
    * @param updateType the preferred method of updating the game
    */
   public startGameUpdate(
      gameFunc: TimedFunction | null = null,
      gameLifeCheckFunc: GameLifeCheckFunction = () => true,
      updateType:
         | "requestAnimationFrame"
         | "setInterval" = "requestAnimationFrame"
   ): void {
      if (updateType === "requestAnimationFrame") {
         this.startGameUpdateRequestAnimationFrame(gameFunc, gameLifeCheckFunc);
      } else {
         this.startGameUpdateSetInterval(gameFunc, gameLifeCheckFunc);
      }
   }

   /**
    * Method that registers a timer which is ticked in every frame of the game.
    * 
    * @param timerName the key to be used to access the timer
    * @param startingTime the starting value of the timer
    */
   public registerTimer(timerName: string, startingTime?: number): void {
      this.timers[timerName] = startingTime ?? 0;
   }

   /**
    * Method that registers a function which is called at the start of every frame of the game with the elapsed time from the last frame (in seconds) as parameter.
    * 
    * @param movementFunction the function to be called in every frame of the game
    */
   public registerMovementFunction(movementFunction: TimedFunction): void {
      this.movementFunctions.push(movementFunction);
   }

   /**
    * Method that registers a drawing function which is called at the end of every frame of the game.
    * The order of the registrations determines the order of the drawing.
    * 
    * @param drawingFunction the function to be called in every frame of the game
    */
   public registerDrawingFunction(drawingFunction: DrawingFunction): void {
      this.drawingFunctions.push(drawingFunction);
   }

   /**
    * Method that registers a character which is moved and drawn in every frame of the game.
    * 
    * @param character the character to be registered
    */
   public registerCharacter(character: Character): void {
      this.registerMovementFunction(character.move.bind(character));
      this.registerDrawingFunction(character.draw.bind(character));
   }

   private startGameUpdateRequestAnimationFrame(
      gameFunc: TimedFunction | null,
      gameLifeCheckFunc: GameLifeCheckFunction
   ): void {
      let lastTime = Date.now();
      const callback = this.craftGameCallback(gameFunc, gameLifeCheckFunc);
      const update = (time: number) => {
         const deltaTime = (time - lastTime) / 1000;
         lastTime = time;

         if (callback(deltaTime)) {
            requestAnimationFrame(update);
         }
      };

      requestAnimationFrame(update);
   }

   private startGameUpdateSetInterval(
      gameFunc: TimedFunction | null,
      gameLifeCheckFunc: GameLifeCheckFunction
   ): void {
      let lastTime = Date.now();
      const callback = this.craftGameCallback(gameFunc, gameLifeCheckFunc);
      const interval = setInterval(() => {
         if (!callback((Date.now() - lastTime) / 1000)) {
            clearInterval(interval);
         } else {
            lastTime = Date.now();
         }
      });
   }

   private craftGameCallback(
      gameFunc: TimedFunction | null,
      gameLifeCheckFunc: GameLifeCheckFunction
   ): (deltaTime: number) => boolean {
      return (deltaTime: number) => {
         for (const movementFunction of this.movementFunctions) {
            movementFunction(deltaTime);
         }

         for (const timerName in this.timers) {
            this.timers[timerName] += deltaTime;
         }

         if (gameFunc) {
            gameFunc(deltaTime);
         }

         for (const drawingFunction of this.drawingFunctions) {
            drawingFunction();
         }

         return gameLifeCheckFunc();
      };
   }
}
