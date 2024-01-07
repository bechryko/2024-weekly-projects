import { CompletedExercise } from "./completed-exercise";

export interface CompletedWorkout {
   id: string;
   name: string;
   exercises: CompletedExercise[];
   user: string;
   completionTimestamp: number;
}
