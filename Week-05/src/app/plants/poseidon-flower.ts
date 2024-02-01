import { POSEIDON_FLOWER_FLOOD_SPEED } from "../constants";
import { Field } from "../models/field";
import { Plant } from "./plant";

export class PoseidonFlower extends Plant {
   constructor() {
      super("Poseidon Flower", "poseidon-flower", 15, 10);
   }

   protected override checkLifeFunctions(): void {
      super.checkLifeFunctions();

      if(this.waterLevel >= 125) {
         this.dead = false;
      }
   }

   public static floodArea(fields: Field[][]): void {
      for(let i = 0; i < fields.length; i++) {
         for(let j = 0; j < fields[i].length; j++) {
            if(fields[i][j].plant instanceof PoseidonFlower) {
               for(let x = i - 1; x <= i + 1; x++) {
                  for(let y = j - 1; y <= j + 1; y++) {
                     if(fields[x]?.[y]) {
                        fields[x][y].waterLevel += POSEIDON_FLOWER_FLOOD_SPEED;
                     }
                  }
               }
            }
         }
      }
   }
}