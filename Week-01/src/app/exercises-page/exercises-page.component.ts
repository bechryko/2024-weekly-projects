import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';
import { ExercisesService } from './exercises.service';
import { ExerciseCategory } from './models/exercise-category';
import { ExerciseDescription } from './models/exercise-description';

type ExerciseForm = FormGroup<{
   name: FormControl<string | null>,
   urls: FormArray<FormControl<unknown>>,
   tips: FormArray<FormControl<unknown>>,
   comment: FormControl<string | null>,
   category: FormControl<ExerciseCategory | null>
}>;

@Component({
   selector: 'glb-exercises-page',
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      TextFieldModule,
      MatRadioModule,
      MatSnackBarModule
   ],
   templateUrl: './exercises-page.component.html',
   styleUrl: './exercises-page.component.scss'
})
export class ExercisesPageComponent {
   public readonly exercises: Signal<ExerciseDescription[]>;
   public readonly selectedExerciseId: WritableSignal<string | undefined>;
   public readonly exerciseForm: ExerciseForm;

   public readonly ExerciseCategories = Object.values(ExerciseCategory);
   public readonly categoryLabels: Record<ExerciseCategory, string> = {
      [ExerciseCategory.WARMUP]: "Bemelegítés",
      [ExerciseCategory.MAIN]: "Fő gyakorlat",
      [ExerciseCategory.STRETCH]: "Nyújtás"
   };

   constructor(
      private readonly exercisesService: ExercisesService,
      private readonly formBuilder: FormBuilder,
      private readonly snackbar: MatSnackBar
   ) {
      this.exercises = toSignal(this.exercisesService.exercises$, { initialValue: [] as ExerciseDescription[] });
      this.selectedExerciseId = signal(undefined);
      this.exerciseForm = this.formBuilder.group({
         name: ['', Validators.required],
         urls: this.formBuilder.array([]),
         tips: this.formBuilder.array([]),
         comment: [''],
         category: ['', Validators.required]
      }) as any;
   }

   public selectExercise(id?: string): void {
      this.selectedExerciseId.set(id);
      if (id && this.getExerciseById(id)) {
         const newExercise = this.getExerciseById(this.selectedExerciseId())!;
         this.createExerciseForm(newExercise);
         const newValue = newExercise as any;
         delete newValue.id;
         this.exerciseForm.setValue(newValue);
      }
   }

   public getExerciseById(id?: string): ExerciseDescription | undefined {
      return cloneDeep(this.exercises().find(exercise => exercise.id === id));
   }

   public createExerciseForm(exercise: ExerciseDescription): void {
      this.exerciseForm.controls.urls.clear();
      exercise.urls.forEach(_ => {
         this.exerciseForm.controls.urls.push(this.formBuilder.control(''));
      });

      this.exerciseForm.controls.tips.clear();
      exercise.tips.forEach(_ => {
         this.exerciseForm.controls.tips.push(this.formBuilder.control(''));
      });
   }

   public addFormArrayElement(formArrayName: 'urls' | 'tips'): void {
      this.exerciseForm.controls[formArrayName].push(this.formBuilder.control(''));
   }

   public checkFormArrayElement(formArrayName: 'urls' | 'tips', index: number): void {
      if (!this.exerciseForm.controls[formArrayName].value[index]) {
         const value = this.exerciseForm.controls[formArrayName].value;
         this.exerciseForm.controls[formArrayName].setValue(
            value.slice(0, index).concat(
               value.slice(index + 1),
            ).concat(value[index]),
         );
         this.exerciseForm.controls[formArrayName].removeAt(value.length - 1);
      }
   }

   public saveExercise(): void {
      if (this.validateExerciseProperties()) {
         this.exercisesService.updateExercise(this.exerciseForm.value as ExerciseDescription);
         this.selectExercise();
      }
   }

   public validateExerciseProperties(): boolean {
      const formControls = this.exerciseForm.controls;
      const exercise = this.exerciseForm.value as ExerciseDescription;
      if (!this.ExerciseCategories.includes(exercise.category)) {
         formControls.category.setErrors({ invalid: true });
         this.snackbar.open('Kategória értéke nem megfelelő!', undefined, { duration: 3000 });
         return false;
      }
      if (exercise.tips.some(tip => !tip)) {
         formControls.tips.setErrors({ invalid: true });
         this.snackbar.open('A tippek értéke nem lehet üres!', undefined, { duration: 3000 });
         return false;
      }
      if (exercise.urls.some(url => !url)) {
         formControls.urls.setErrors({ invalid: true });
         this.snackbar.open('A linkek értéke nem lehet üres!', undefined, { duration: 3000 });
         return false;
      }
      return true;
   }
}
