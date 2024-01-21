import { Character } from "./character";
import { Position } from "./position";

/**
 * A class for characters that can be controlled using directional commands.
 */
export abstract class ControllableCharacter implements Character {
    public readonly position: Position;
    public readonly speed: number = 0;
    protected readonly controls: Record<string, boolean> = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    
    constructor(startingPosition: Position, speed: number) {
        this.position = startingPosition;
        this.speed = speed;
    }
    
    public move(deltaTime: number): void {
        this.position.x += this.speed * deltaTime * (Number(this.controls.right) - Number(this.controls.left));
        this.position.y += this.speed * deltaTime * (Number(this.controls.down) - Number(this.controls.up));
    }

    public abstract draw(): void;
}
