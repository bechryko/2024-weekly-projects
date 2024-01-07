import { Injectable } from '@angular/core';
import { Observable, map, of, withLatestFrom } from 'rxjs';
import { WorkoutsService } from '../workouts-page/workouts.service';
import { CompletedWorkout } from './models/completed-workout';

interface WorkoutCompletionData {
   id: string;
   exerciseCompletionTimestamps: Record<string, number[]>;
   user: string;
   completionTimestamp: number;
}

@Injectable({
   providedIn: 'root'
})
export class WorkoutCompletionsService {
   public readonly completedWorkouts$: Observable<CompletedWorkout[]>;
   private readonly rawCompletions$: Observable<WorkoutCompletionData[]>;

   constructor(
      private readonly workoutsService: WorkoutsService
   ) {
      this.rawCompletions$ = of([
         {
            id: '1',
            exerciseCompletionTimestamps: {
               '1': [1, 2, 3],
               '2': [1, 2, 3]
            },
            user: 'testUser',
            completionTimestamp: 5
         }
      ] as WorkoutCompletionData[]);

      this.completedWorkouts$ = this.rawCompletions$.pipe(
         withLatestFrom(this.workoutsService.workouts$),
         map(([workoutCompletions, workouts]) =>
            workoutCompletions.map(completion => {
               const workout = workouts.find(workout => workout.id === completion.id)!;
               return {
                  ...workout,
                  exercises: workout.exercises.map((exercise, index) => ({
                     ...exercise,
                     setCompletionTimestamps: completion.exerciseCompletionTimestamps[index] || []
                  })),
                  user: completion.user,
                  completionTimestamp: completion.completionTimestamp
               };
            })
         )
      );
   }

   public completeWorkout(workout: CompletedWorkout): void {
      console.log('Workout completed:', workout);
   }
}
