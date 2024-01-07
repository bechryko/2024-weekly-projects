import { ExerciseDescription } from "../../exercises-page/models/exercise-description";

export interface DetailedExerciseDescription extends ExerciseDescription {
   repeatTimes: string;
   amount: string;
   weight: string;
   index: number;
}
