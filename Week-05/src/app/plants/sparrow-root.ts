import { Plant } from "./plant";

export class SparrowRoot extends Plant {
   private readonly miosnLevelBaseDifference: number;

   constructor() {
      super("Sparrow Root", "sparrow-root", 2, 4);

      this.miosnLevelBaseDifference = Math.floor(Math.random() * 5);
   }

   public override getMiosnStatus(): string {
      const baseNumber = this.miosnLevel - this.miosnLevelBaseDifference;
      return `${ baseNumber } - ${ baseNumber + 4 }`;
   }
}
