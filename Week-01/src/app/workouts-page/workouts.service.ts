import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, share, withLatestFrom } from 'rxjs';
import { ExercisesService } from '../exercises-page/exercises.service';
import { WorkoutDescription } from './models/workout-description';

interface AdditionalExerciseInformationForWorkout {
   id: string;
   repeatTimes: string;
   amount: string;
   weight: string;
   index: number;
}

interface RawWorkoutDescription {
   id: string;
   name: string;
   exerciseInformations: AdditionalExerciseInformationForWorkout[];
}

@Injectable({
   providedIn: 'root'
})
export class WorkoutsService {
   private readonly rawWorkouts$: Observable<RawWorkoutDescription[]>;
   public readonly workouts$: Observable<WorkoutDescription[]>;


   constructor(
      private readonly exercisesService: ExercisesService
   ) {
      this.rawWorkouts$ = of([
         {
            id: '1',
            name: 'Edzés-01',
            exerciseInformations: [
               {
                  id: '1',
                  repeatTimes: '4',
                  amount: '4*12',
                  weight: '',
                  index: 0
               },
               {
                  id: '2',
                  repeatTimes: '4',
                  amount: '8-12-12-8',
                  weight: '25 kg',
                  index: 0
               }
            ]
         },
         {
            id: '2',
            name: 'Edzés-02',
            exerciseInformations: [
               {
                  id: '2',
                  repeatTimes: '10',
                  amount: '4*12',
                  weight: '10 kg',
                  index: 0
               },
               {
                  id: '3',
                  repeatTimes: '4',
                  amount: '8-12-12-8',
                  weight: '25 kg',
                  index: 1
               }
            ]
         }
      ]);
      
      this.workouts$ = this.rawWorkouts$.pipe(
         withLatestFrom(this.exercisesService.exercises$),
         map(([rawWorkouts, exercises]) => {
            return rawWorkouts.map(rawWorkout => {
               return {
                  id: rawWorkout.id,
                  name: rawWorkout.name,
                  exercises: rawWorkout.exerciseInformations.map(exerciseInformation => {
                     const exercise = exercises.find(exercise => exercise.id === exerciseInformation.id)!;
                     return {
                        ...exercise,
                        ...exerciseInformation
                     };
                  })
               };
            });
         }),
         share({
            connector: () => new BehaviorSubject<WorkoutDescription[]>([])
         })
      );
   }

   public updateWorkout(workout: WorkoutDescription): void {
      console.log('updateWorkout', workout);
   }
}
