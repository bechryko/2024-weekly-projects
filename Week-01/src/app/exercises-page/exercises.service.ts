import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, share } from 'rxjs';
import { ExerciseDescription } from './models/exercise-description';

@Injectable({
   providedIn: 'root'
})
export class ExercisesService {
   public readonly exercises$: Observable<ExerciseDescription[]>;

   constructor() {
      this.exercises$ = of([
         {
            id: '1',
            name: 'Jumping Jacks',
            urls: [
               'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
               'https://www.google.com'
            ],
            tips: [
               'Keep your back straight',
               'Keep your knees slightly bent'
            ],
            comment: 'This is a comment',
            category: 'warmup'
         },
         {
            id: '2',
            name: 'Push Ups',
            urls: [
               'https://www.youtube.com/watch?v=IODxDxX7oi4',
               'https://www.youtube.com/watch?v=JZQA08SlJnM'
            ],
            tips: [
               'Keep your back straight',
               'Keep your knees slightly bent'
            ],
            comment: 'This is another comment',
            category: 'main'
         },
         {
            id: '3',
            name: 'Pull Ups',
            urls: [
               'https://www.youtube.com/watch?v=IODxDxX7oi4',
               'https://www.youtube.com/watch?v=JZQA08SlJnM'
            ],
            tips: [
               'Keep your back straight',
               'Keep your knees slightly bent'
            ],
            comment: 'This is yet another comment',
            category: 'main'
         }
      ] as ExerciseDescription[]).pipe(
         share({
            connector: () => new BehaviorSubject<ExerciseDescription[]>([])
         })
      );
   }

   public updateExercise(exercise: ExerciseDescription): void {
      console.log('updateExercise', exercise);
   }
}
