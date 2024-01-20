/**
 * Interface for characters in the game.
 */
export interface Character {
   /**
    * A method which determines where the character moves.
    * @param deltaTime the time elapsed since the last frame in seconds
    */
   move(deltaTime: number): void;

   /**
    * A method which draws the character.
    */
   draw(): void;
}
