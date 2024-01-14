import { WritableSignal, signal } from "@angular/core";
import { GameData } from "../../game/game-data";
import { Dialog, DialogKey, dialogList } from "./dialog-list";

export class MiliDialogsUtils {
   public static currentDialog: WritableSignal<Dialog | undefined> = signal(undefined);
   private static readonly entryDialogKeys = Object.entries(dialogList).filter(([, dialog]) => dialog.entry).map(([key, ]) => key) as DialogKey[];

   public static startDialog(gameData: GameData): void {
      if(this.entryDialogKeys.length === 0) return;
      
      const dialog = dialogList[this.entryDialogKeys[0]];
      if (dialog.entry!(gameData)) {
         this.currentDialog.set(dialog);
         this.entryDialogKeys.splice(0, 1);
      }
   }

   public static nextDialog(nextDialogKey?: DialogKey) {
      if (nextDialogKey) {
         this.currentDialog.set(dialogList[nextDialogKey]);
      } else {
         this.currentDialog.set(undefined);
      }
   }
}
