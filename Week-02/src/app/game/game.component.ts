import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map } from 'rxjs';
import { Direction } from './direction';

type SpawnType = 'normal' | 'ruin' | 'negative';

interface Tile {
   x: number;
   y: number;
}

@Component({
   selector: 'mili2048-game',
   standalone: true,
   imports: [
      CommonModule
   ],
   templateUrl: './game.component.html',
   styleUrl: './game.component.scss'
})
export class GameComponent {
   @Input() public allowedToMove: boolean = false;
   public readonly GAME_SIZE = 4;
   public readonly tiles: number[][];
   private movesMade = 0;
   private negatives = 0;
   private isGameOver = false;

   constructor() {
      this.tiles = [];
      for (let i = 0; i < this.GAME_SIZE; i++) {
         this.tiles[i] = [];
         for (let j = 0; j < this.GAME_SIZE; j++) {
            this.tiles[i][j] = 0;
         }
      }

      this.spawnNumber(0, 'normal');
      this.spawnNumber(0, 'normal');

      fromEvent<KeyboardEvent>(document, 'keydown').pipe(
         filter(_ => this.allowedToMove && !this.isGameOver),
         map(event => {
            switch (event.code) {
               case 'ArrowUp':
               case 'KeyW':
                  return Direction.Up;
               case 'ArrowRight':
               case 'KeyD':
                  return Direction.Right;
               case 'ArrowDown':
               case 'KeyS':
                  return Direction.Down;
               case 'ArrowLeft':
               case 'KeyA':
                  return Direction.Left;
               default:
                  return null;
            }
         }),
         filter(direction => direction !== null),
         map(direction => direction as Direction),
         takeUntilDestroyed()
      ).subscribe(direction => this.move(direction));
   }

   private spawnNumber(chanceForBigger: number, spawnType: SpawnType): void {
      let newNumber;
      if (Math.random() < chanceForBigger) {
         newNumber = 4;
      } else {
         newNumber = 2;
      }
      if (spawnType === 'ruin') {
         newNumber = Math.random() * 100;
      }
      if (spawnType == 'negative') {
         newNumber = -(2 ** (Math.floor(Math.random() * 2) + newNumber));
         this.negatives++;
      }

      let possibilities = 0;
      for (const row of this.tiles) {
         for (const tile of row) {
            if (!tile)
               possibilities++;
         }
      }
      if (!possibilities) {
         this.gameOver();
      }

      const chosenTile = Math.floor(Math.random() * possibilities);
      for (let i = 0; i < this.GAME_SIZE; i++) {
         for (let j = 0; j < this.GAME_SIZE; j++) {
            if (!this.tiles[i][j]) {
               possibilities--;

               if (possibilities == chosenTile) {
                  this.tiles[i][j] = newNumber;
                  return;
               }
            }
         }
      }
      console.warn('No tile was chosen!');
   }

   private move(direction: Direction): void {
      this.movesMade++;
      if (direction == Direction.Down) {
         for (let i = this.GAME_SIZE - 1; i >= 0; i--) {
            for (let j = 0; j < this.GAME_SIZE; j++) {
               for (let d = 0; this.moveTileTo({ y: i + d, x: j }, { y: i + (d + 1), x: j }); d++);
            }
         }
      } else if (direction == Direction.Left) {
         for (let i = 0; i < this.GAME_SIZE; i++) {
            for (let j = 0; j < this.GAME_SIZE; j++) {
               for (let d = 0; this.moveTileTo({ y: i, x: j - d }, { y: i, x: j - (d + 1) }); d++);
            }
         }
      } else if (direction == Direction.Up) {
         for (let i = 0; i < this.GAME_SIZE; i++) {
            for (let j = 0; j < this.GAME_SIZE; j++) {
               for (let d = 0; this.moveTileTo({ y: i - d, x: j }, { y: i - (d + 1), x: j }); d++);
            }
         }
      } else if (direction == Direction.Right) {
         for (let i = 0; i < this.GAME_SIZE; i++) {
            for (let j = this.GAME_SIZE - 1; j >= 0; j--) {
               for (let d = 0; this.moveTileTo({ y: i, x: j + d }, { y: i, x: j + (d + 1) }); d++);
            }
         }
      }

      this.spawnNumber(.5, 'normal');
   }

   private moveTileTo(from: Tile, to: Tile): boolean {
      if (!this.isValidTile(to) || !this.isValidTile(from)) {
         return false;
      }
      
      if (this.getTileValue(to) === 0) {
         this.setTileValue(to, from);
         this.setTileValue(from, 0);
         return true;
      }

      if (this.getTileValue(to) === this.getTileValue(from)) {
         if (this.getTileValue(to) < 0) {
            this.negatives--;
         }
         this.setTileValue(to, this.getTileValue(to) * 2);
         this.setTileValue(from, 0);
         return false;
      }

      if (this.getTileValue(to) === -this.getTileValue(from)) {
         this.setTileValue(to, 0);
         this.setTileValue(from, 0);
         this.negatives--;
         return false;
      }

      return false;
   }

   private gameOver(): void {
      this.isGameOver = true;
      window.alert("Játék vége! Nem tudsz tovább lépni.");
   }

   private getTileValue(tile: Tile): number {
      return this.tiles[tile.y][tile.x];
   }

   private setTileValue(tile: Tile, value: number | Tile): void {
      if (typeof value == 'object') {
         value = this.getTileValue(value);
      }
      this.tiles[tile.y][tile.x] = value;
   }

   private isValidTile(tile: Tile): boolean {
      return tile.x >= 0 && tile.x < this.GAME_SIZE && tile.y >= 0 && tile.y < this.GAME_SIZE;
   }

   public getCSSClass(value: number): Record<string, boolean> {
      return {
         ['tile-' + value]: true
      };
   }
}
