import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Group } from '../../models/group';
import { StorageUtils } from '../../utils/storage.utils';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
   selector: 'lsm-export',
   standalone: true,
   imports: [
      MatButtonModule,
      MatDialogModule
   ],
   templateUrl: './export.component.html',
   styleUrl: './export.component.scss'
})
export class ExportComponent {
   public readonly initialDataAsJSON: string;
   @ViewChild('fullDataArea') private readonly fullDataArea?: ElementRef<HTMLTextAreaElement>;

   constructor(
      private readonly dialog: MatDialog,
      private readonly dialogRef: MatDialogRef<ExportComponent>,
      @Inject(MAT_DIALOG_DATA) data: Group[],
      private readonly clipboard: Clipboard,
      private readonly snackbar: MatSnackBar
   ) {
      this.initialDataAsJSON = JSON.stringify(data);
   }

   public copyData(): boolean {
      if(!this.fullDataArea) {
         return false;
      }

      this.clipboard.copy(this.initialDataAsJSON);
      this.snackbar.open('Vágólapra másolva!', undefined, {
         duration: 2000
      });
      return true;
   }

   public eraseData(): void {
      this.dialog.open(ConfirmationComponent, {
         data: 'Biztosan törölni szeretnéd az adatokat?'
      }).afterClosed().subscribe((confirmed: boolean) => {
         if(confirmed && this.copyData()) {
            StorageUtils.saveToLocalStorage([]);
            this.dialogRef.close();
         } else {
            this.snackbar.open('Az adatok törlése sikertelen!', undefined, {
               duration: 2000
            });
         }
      })
   }

   public saveChanges(): void {
      if(!this.fullDataArea) {
         return;
      }

      StorageUtils.saveToLocalStorage(JSON.parse(this.fullDataArea.nativeElement.value));
      this.snackbar.open('Változtatások mentve!', undefined, {
         duration: 2000
      });
   }
}
