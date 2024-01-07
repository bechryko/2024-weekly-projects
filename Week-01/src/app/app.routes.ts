import { Routes } from '@angular/router';
import { CompletionsPageComponent } from './completions-page/completions-page.component';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';
import { GymComponent } from './gym/gym.component';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { WorkoutsPageComponent } from './workouts-page/workouts-page.component';

export const routes: Routes = [
   {
      path: 'menu',
      component: MenuPageComponent
   },
   {
      path: 'exercises',
      component: ExercisesPageComponent
   },
   {
      path: 'workouts',
      component: WorkoutsPageComponent
   },
   {
      path: 'completed',
      component: CompletionsPageComponent
   },
   {
      path: 'gym/:id',
      component: GymComponent
   },
   {
      path: '',
      redirectTo: 'menu',
      pathMatch: 'full'
   },
   {
      path: '**',
      redirectTo: 'menu'
   }
];
