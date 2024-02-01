import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { WeedType } from '../models/weed-type';

@Component({
   selector: 'weed-init-dialog',
   standalone: true,
   imports: [
      MatFormFieldModule,
      MatSelectModule,
      FormsModule,
      MatButtonModule
   ],
   templateUrl: './init-dialog.component.html',
   styleUrl: './init-dialog.component.scss'
})
export class InitDialogComponent {
   public readonly weedTypes = Object.values(WeedType);
   public selectedWeed: string = "random";

   constructor(
      private readonly dialogRef: MatDialogRef<InitDialogComponent>
   ) { }

   public closeDialog(): void {
      this.dialogRef.close(this.selectedWeed);
   }
}
