import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Signal, WritableSignal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { cloneDeep } from 'lodash';
import { ExerciseCategory } from './../exercises-page/models/exercise-category';
import { DetailedExerciseDescription } from './models/detailed-exercise-description';
import { WorkoutDescription } from './models/workout-description';
import { WorkoutsService } from './workouts.service';

type EditableExerciseDescription = Pick<DetailedExerciseDescription, 'repeatTimes' | 'amount' | 'weight'>;

type EditableExerciseDescriptionControls = Record<keyof EditableExerciseDescription, FormControl<string | null>>;

type WorkoutForm = FormGroup<Record<ExerciseCategory, FormArray<FormGroup<EditableExerciseDescriptionControls>>>>;

type OrderedWorkoutDescription = Record<ExerciseCategory, EditableExerciseDescription[]>;

@Component({
   selector: 'glb-workouts-page',
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      CdkDropList,
      CdkDrag,
      CdkDragHandle
   ],
   templateUrl: './workouts-page.component.html',
   styleUrl: './workouts-page.component.scss'
})
export class WorkoutsPageComponent {
   public readonly workouts: Signal<WorkoutDescription[]>;
   public readonly selectedWorkout: WritableSignal<WorkoutDescription | undefined>;
   public readonly workoutForm: WorkoutForm;

   public readonly selectedWarmups: Signal<DetailedExerciseDescription[] | undefined>;
   public readonly selectedMains: Signal<DetailedExerciseDescription[] | undefined>;
   public readonly selectedStretches: Signal<DetailedExerciseDescription[] | undefined>;

   public readonly ExerciseCategory = ExerciseCategory;

   constructor(
      private readonly workoutsService: WorkoutsService,
      private readonly formBuilder: FormBuilder
   ) {
      this.workouts = toSignal(this.workoutsService.workouts$, { initialValue: [] as WorkoutDescription[] });
      this.selectedWorkout = signal(undefined);
      this.workoutForm = this.formBuilder.group({
         warmup: this.formBuilder.array([]),
         main: this.formBuilder.array([]),
         stretch: this.formBuilder.array([])
      }) as any;

      this.selectedWarmups = computed(() => this.selectedWorkout()?.exercises.filter(exercise => exercise.category === ExerciseCategory.WARMUP));
      this.selectedMains = computed(() => this.selectedWorkout()?.exercises.filter(exercise => exercise.category === ExerciseCategory.MAIN));
      this.selectedStretches = computed(() => this.selectedWorkout()?.exercises.filter(exercise => exercise.category === ExerciseCategory.STRETCH));
   }
   
   public selectWorkout(id?: string): void {
      const unorderedWorkout = this.getWorkoutById(id)!;
      this.selectedWorkout.set(unorderedWorkout);
      if (id && this.getWorkoutById(id)) {
         const workout: OrderedWorkoutDescription = {
            warmup: [],
            main: [],
            stretch: []
         };
         for(const category of Object.values(ExerciseCategory)) {
            workout[category] = cloneDeep(unorderedWorkout.exercises
               .filter(exercise => exercise.category === category)
               .map(this.stripUneditablePropertiesFromDetailedExerciseDescription)
            );
         }
         this.createWorkoutForm(workout);
         this.workoutForm.setValue(workout);
      }
   }

   public getWorkoutById(id?: string): WorkoutDescription | undefined {
      return cloneDeep(this.workouts().find(workout => workout.id === id));
   }

   public createWorkoutForm(workout: OrderedWorkoutDescription): void {
      for(const category of Object.values(ExerciseCategory)) {
         this.workoutForm.controls[category].clear();
         workout[category].forEach(_ => {
            this.workoutForm.controls[category].push(this.formBuilder.group({
               repeatTimes: [''],
               amount: [''],
               weight: ['']
            }));
         });
      }
   }

   public drag(event: CdkDragDrop<EditableExerciseDescription>, listName: ExerciseCategory): void {
      const list = this.selectedWorkout()!.exercises
         .filter(exercise => exercise.category === listName)
         .map((exercise, index) => ({
            ...exercise,
            ...this.workoutForm.controls[listName].at(index).value
         } as DetailedExerciseDescription));
      const movedExercise = list.splice(event.previousIndex, 1)[0];
      list.splice(event.currentIndex, 0, movedExercise);
      list.forEach((exercise, index) => exercise.index = index);
      this.selectedWorkout.update(workout => {
         workout = workout as any as WorkoutDescription;
         return {
            ...workout,
            exercises: [
               ...workout.exercises.filter(exercise => exercise.category !== listName),
               ...cloneDeep(list)
            ]
         };
      });

      this.workoutForm.controls[listName].setValue(list.map(this.stripUneditablePropertiesFromDetailedExerciseDescription));
   }

   public saveWorkout(): void {
      this.workoutsService.updateWorkout(this.createFullWorkoutDescription(this.workoutForm.value as OrderedWorkoutDescription));
      this.selectWorkout();
   }

   private createFullWorkoutDescription(workout: OrderedWorkoutDescription): WorkoutDescription {
      console.log(this.selectedMains())
      return cloneDeep({
         id: this.selectedWorkout()!.id,
         name: this.selectedWorkout()!.name,
         exercises: [
            ...workout.warmup.map((exercise, index) => ({
               ...this.selectedWarmups()![index],
               ...exercise
            })),
            ...workout.main.map((exercise, index) => ({
               ...this.selectedMains()![index],
               ...exercise
            })),
            ...workout.stretch.map((exercise, index) => ({
               ...this.selectedStretches()![index],
               ...exercise
            }))
         ]
      });
   }

   private stripUneditablePropertiesFromDetailedExerciseDescription(exercise: DetailedExerciseDescription): EditableExerciseDescription {
      return {
         repeatTimes: exercise.repeatTimes,
         amount: exercise.amount,
         weight: exercise.weight
      };
   }
}
