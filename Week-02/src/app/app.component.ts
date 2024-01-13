import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { MiliComponent } from './mili/mili.component';

@Component({
   selector: 'mili2048-root',
   standalone: true,
   imports: [
      CommonModule,
      RouterOutlet,
      GameComponent,
      MiliComponent
   ],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
