import { Plant } from "../plants/plant";

export interface Field {
   isWeedPresent: boolean;
   waterLevel: number;
   miosnStrength: number;
   plant?: Plant;
}
