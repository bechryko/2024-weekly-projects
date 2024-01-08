import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
   selector: 'mili2048-root',
   standalone: true,
   imports: [
      CommonModule,
      RouterOutlet
   ],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
