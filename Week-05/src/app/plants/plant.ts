import { PLANT_FORCED_WATER_CONSUMPTION_SPEED, PLANT_TIME_WITHOUT_MIOSN, PLANT_WATER_CONSUMPTION_SPEED, PLANT_YOUNGNESS_UPPER_BOUND } from "../constants";
import { Field } from "../models/field";

export abstract class Plant {
   protected waterLevel = 50;
   protected miosnLevel = 0;
   private turnsWithoutMiosn = 0;
   protected dead = false;
   private age = 0;

   constructor(
      public readonly name: string,
      public readonly cssClass: string,
      private readonly waterUsage: number,
      private readonly miosnNeed: number
   ) { }

   public tick(field: Field): void {
      if(this.dead) {
         return;
      }

      this.consumeWater(field);
      this.waterLevel -= this.waterUsage;

      this.setMiosnLevel(field);

      this.checkLifeFunctions();
      this.age++;
   }

   public getWaterStatus(): string {
      if(this.waterLevel < 20) {
         return "thirsty";
      }

      if(this.waterLevel > 100) {
         return "drowning";
      }

      return "normal";
   }

   public getMiosnStatus(): string {
      if(this.miosnLevel < this.miosnNeed) {
         return "weak";
      }

      if(this.miosnLevel >= 19) {
         return "very strong";
      }

      return "strong";
   }

   public isAlive(): boolean {
      return !this.dead;
   }

   public kill(): void {
      this.dead = true;
   }

   public isYoung(): boolean {
      return this.age <= PLANT_YOUNGNESS_UPPER_BOUND;
   }

   private consumeWater(field: Field): void {
      if(this.dead) {
         return;
      }

      if(field.waterLevel > this.waterLevel * 2) {
         this.waterLevel += PLANT_FORCED_WATER_CONSUMPTION_SPEED;
         field.waterLevel -= PLANT_FORCED_WATER_CONSUMPTION_SPEED;
      } else if(field.waterLevel > this.waterLevel) {
         this.waterLevel += PLANT_WATER_CONSUMPTION_SPEED;
         field.waterLevel -= PLANT_WATER_CONSUMPTION_SPEED;
      } else {
         this.waterLevel++;
         field.waterLevel--;
      }
   }

   private setMiosnLevel(field: Field): void {
      this.miosnLevel = field.miosnStrength;
   }

   protected checkLifeFunctions(): void {
      if(this.waterLevel <= 0 || this.waterLevel >= 125) {
         this.dead = true;
      }

      if(this.miosnLevel < this.miosnNeed) {
         this.turnsWithoutMiosn++;
      } else {
         this.turnsWithoutMiosn = 0;
      }
      if(this.turnsWithoutMiosn > PLANT_TIME_WITHOUT_MIOSN) {
         this.dead = true;
      }
   }
}
