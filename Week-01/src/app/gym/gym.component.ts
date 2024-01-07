import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { CompletedExercise } from '../completions-page/models/completed-exercise';
import { CompletedWorkout } from '../completions-page/models/completed-workout';
import { WorkoutCompletionsService } from '../completions-page/workout-completions.service';
import { DateUtils } from '../date.utils';
import { WorkoutDescription } from '../workouts-page/models/workout-description';
import { WorkoutsService } from '../workouts-page/workouts.service';
import { ExerciseCategory } from './../exercises-page/models/exercise-category';

const youtubeRegExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

@Component({
   selector: 'glb-gym',
   standalone: true,
   imports: [
      MatButtonModule,
      MatDividerModule
   ],
   templateUrl: './gym.component.html',
   styleUrl: './gym.component.scss'
})
export class GymComponent implements OnInit {
   public workout?: CompletedWorkout;
   public readonly exerciseDone: Record<ExerciseCategory, boolean[]> = {
      [ExerciseCategory.WARMUP]: [],
      [ExerciseCategory.MAIN]: [],
      [ExerciseCategory.STRETCH]: []
   };

   public readonly ExerciseCategory = ExerciseCategory;

   constructor(
      private readonly route: ActivatedRoute,
      private readonly router: Router,
      private readonly workoutsService: WorkoutsService,
      private readonly workoutCompletionsService: WorkoutCompletionsService,
      private readonly sanitizer: DomSanitizer
   ) { }

   public ngOnInit(): void {
      this.route.params.pipe(
         switchMap(params => this.workoutsService.workouts$.pipe(
            map(workouts => workouts.find(workout => workout.id === params['id']) as WorkoutDescription),
            filter(workout => !!workout),
            take(1)
         ))
      ).subscribe(workout => {
         this.workout = {
            ...workout,
            exercises: workout.exercises.map(exercise => ({
               ...exercise,
               setCompletionTimestamps: []
            })),
            user: 'testUser', // TODO,
            completionTimestamp: 0
         };
         for(const exercise of this.workout.exercises) {
            this.exerciseDone[exercise.category].push(false);
         }
      });
   }

   public getDoneTimes(exercise: CompletedExercise): string {
      return DateUtils.combineTimestamps(exercise.setCompletionTimestamps);
   }

   public youtubeUrl(url: string): SafeResourceUrl | undefined {
      const match = url.match(youtubeRegExp);
      return Boolean(match) ? this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${ match![1] }`) : undefined;
   }

   public otherUrl(url: string): SafeUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }

   public get warmups(): CompletedExercise[] {
      return this.workout?.exercises.filter(exercise => exercise.category === ExerciseCategory.WARMUP) ?? [];
   }

   public get mains(): CompletedExercise[] {
      return this.workout?.exercises.filter(exercise => exercise.category === ExerciseCategory.MAIN) ?? [];
   }

   public get stretches(): CompletedExercise[] {
      return this.workout?.exercises.filter(exercise => exercise.category === ExerciseCategory.STRETCH) ?? [];
   }

   public completeSet(exercise: CompletedExercise): void {
      exercise.setCompletionTimestamps.push(Date.now());
   }

   public completeExercise(exercise: CompletedExercise): void {
      this.completeSet(exercise);
      this.exerciseDone[exercise.category][exercise.index] = true;
   }

   public cancelWorkout(): void {
      this.router.navigateByUrl('/menu');
   }

   public completeWorkout(): void {
      this.workout!.completionTimestamp = Date.now();
      this.workoutCompletionsService.completeWorkout(this.workout!);
      this.router.navigateByUrl('/menu');
   }
}
