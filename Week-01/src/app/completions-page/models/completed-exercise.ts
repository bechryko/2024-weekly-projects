import { DetailedExerciseDescription } from "../../workouts-page/models/detailed-exercise-description";

export interface CompletedExercise extends DetailedExerciseDescription {
   setCompletionTimestamps: number[];
}
