import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MiliComponent } from './mili/mili.component';

@Component({
   selector: 'mili2048-root',
   standalone: true,
   imports: [
      CommonModule,
      RouterOutlet,
      MiliComponent
   ],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
