import { CommonModule } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';
import { AuthService } from './auth.service';

type Pages = 'exercises' | 'workouts' | 'completed' | 'menu';

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [
      CommonModule,
      RouterOutlet,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSnackBarModule,
      MatButtonModule
   ],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {
   public readonly user$: Observable<any>;
   public readonly loginForm: FormGroup;
   public readonly registerForm: FormGroup;
   public readonly selectedPage: WritableSignal<Pages>;
   public readonly gymModeOff$: Observable<boolean>;

   constructor(
      private readonly builder: FormBuilder,
      private readonly auth: AuthService,
      private readonly snackbar: MatSnackBar,
      private readonly router: Router,
      private readonly route: ActivatedRoute
   ) {
      this.user$ = this.auth.user$;
      this.loginForm = this.builder.group({
         email: ['', Validators.required],
         password: ['', Validators.required]
      });
      this.registerForm = this.builder.group({
         email: ['', Validators.required],
         password: ['', Validators.required],
         confirmPassword: ['', Validators.required],
         code: ''
      });
      this.selectedPage = signal('menu');

      this.gymModeOff$ = this.router.events.pipe(
         filter(event => event instanceof NavigationEnd),
         map((event: any) => event.url),
         map((url: string) => !url.startsWith('/gym')),
         startWith(true)
      );
   }

   public selectPage(page: Pages): void {
      if(page !== this.selectedPage()) {
         this.selectedPage.set(page);
      } else {
         this.selectedPage.set('menu');
      }
      this.router.navigateByUrl(this.selectedPage());
   }

   public onLoginSubmit(): void {
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
   }

   public onRegisterSubmit(): void {
      this.auth.register(
         this.registerForm.value.email,
         this.registerForm.value.password,
         this.registerForm.value.code
      ).catch((error: any) => {
         this.snackbar.open('Érvénytelen regisztrációs kód!', undefined, {
            duration: 5000
         });
      });
   }

   public getButtonColor(page: Pages): string {
      return page === this.selectedPage() ? 'accent' : 'primary';
   }
}
