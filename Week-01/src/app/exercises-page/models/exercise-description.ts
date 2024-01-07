import { ExerciseCategory } from "./exercise-category";

export interface ExerciseDescription {
   id: string;
   name: string;
   urls: string[];
   tips: string[];
   comment: string;
   category: ExerciseCategory;
}
