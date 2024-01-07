import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { WorkoutsService } from '../workouts-page/workouts.service';

interface BasicWorkoutInformation {
   name: string;
   id: string;
}

@Component({
   selector: 'glb-menu-page',
   standalone: true,
   imports: [
      CommonModule,
      MatFormFieldModule,
      MatSelectModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule
   ],
   templateUrl: './menu-page.component.html',
   styleUrl: './menu-page.component.scss'
})
export class MenuPageComponent {
   public readonly workouts$: Observable<BasicWorkoutInformation[]>;
   public readonly workoutSelectionForm: FormGroup<{
      workout: FormControl<string | null>
   }>;
   public isWorkoutSelected = false;

   constructor(
      private readonly workoutsService: WorkoutsService,
      private readonly router: Router
   ) {
      this.workouts$ = this.workoutsService.workouts$.pipe(
         map(workouts => workouts.map(({ name, id }) => ({ name, id })))
      );

      this.workoutSelectionForm = new FormGroup({
         workout: new FormControl('')
      });
   }

   public startWorkout(): void {
      this.router.navigateByUrl('/gym/' + this.workoutSelectionForm.value.workout);
   }
}
