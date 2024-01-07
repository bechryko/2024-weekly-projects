import { Component, Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateUtils } from '../date.utils';
import { CompletedExercise } from './models/completed-exercise';
import { CompletedWorkout } from './models/completed-workout';
import { WorkoutCompletionsService } from './workout-completions.service';

@Component({
   selector: 'glb-completions-page',
   standalone: true,
   imports: [
      MatCardModule,
      MatButtonModule
   ],
   templateUrl: './completions-page.component.html',
   styleUrl: './completions-page.component.scss'
})
export class CompletionsPageComponent {
   public readonly completedWorkouts: Signal<CompletedWorkout[]>;
   public readonly selectedWorkout: WritableSignal<CompletedWorkout | undefined>;

   constructor(
      private readonly workoutCompletionsService: WorkoutCompletionsService
   ) {
      this.completedWorkouts = toSignal(this.workoutCompletionsService.completedWorkouts$, { initialValue: [] });
      this.selectedWorkout = signal(undefined);
   }

   public getCompletionDate(workout: CompletedWorkout): string {
      return DateUtils.displayable(workout.completionTimestamp, true);
   }

   public getCompletionTimestamps(exercise: CompletedExercise): string {
      return DateUtils.combineTimestamps(exercise.setCompletionTimestamps);
   }

   public selectWorkout(workout?: CompletedWorkout): void {
      this.selectedWorkout.set(workout);
   }
}
