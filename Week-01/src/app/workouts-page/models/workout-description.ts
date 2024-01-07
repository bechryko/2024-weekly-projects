import { DetailedExerciseDescription } from "./detailed-exercise-description";

export interface WorkoutDescription {
   id: string;
   name: string;
   exercises: DetailedExerciseDescription[];
}
