import { CommonModule } from '@angular/common';
import { Component, Signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameData } from './game/game-data';
import { GameStage } from './game/game-stage';
import { GameComponent } from './game/game.component';
import { Dialog, DialogChoice } from './mili/dialogs/dialog-list';
import { MiliDialogsUtils } from './mili/dialogs/mili-dialogs.utils';
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
   public readonly isMiliVisible: Signal<boolean>;
   public readonly currentMiliDialog: Signal<Dialog | undefined>;
   public gameStage: GameStage = { turn: 0 };
   public currentGameData!: GameData;

   constructor() {
      this.currentMiliDialog = computed(() => MiliDialogsUtils.currentDialog());
      this.isMiliVisible = computed(() => Boolean(this.currentMiliDialog()));
   }

   public onMoveMade(gameData: GameData): void {
      this.currentGameData = gameData;
      this.gameStage = {
         ...this.gameStage,
         turn: this.gameStage.turn + 1
      };

      if(!this.currentMiliDialog()) {
         MiliDialogsUtils.startDialog(gameData);
      }
   }

   public onChoiceMade(choice?: DialogChoice): void {
      if(this.currentGameData.isEnded) return;

      MiliDialogsUtils.nextDialog(choice?.nextDialogKey);

      if(this.gameStage.key === 'MILIS_PLAY') {
         this.refreshGameComponent();
      }

      switch(choice?.nextDialogKey) {
         case 'PLAY1':
            this.gameStage = { key: 'MILIS_PLAY', turn: 0 };
            break;
         case 'PLAY_END':
            const interval = setInterval(() => {
               this.refreshGameComponent();
               if(this.currentGameData.isEnded) {
                  clearInterval(interval);
               }
            }, 25);
            break;
         case 'THREATEN_CHEER':
            this.gameStage = { key: 'MILIS_RAGE', turn: 0 };
            break;
      }
   }

   private refreshGameComponent(): void {
      this.gameStage = {
         ...this.gameStage,
         turn: this.gameStage.turn + 1
      };
   }
}
