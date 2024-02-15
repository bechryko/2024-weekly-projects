import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
   selector: 'lsm-confirmation',
   standalone: true,
   imports: [
      MatButtonModule
   ],
   templateUrl: './confirmation.component.html',
   styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
   constructor(
      private readonly dialogRef: MatDialogRef<ConfirmationComponent>,
      @Inject(MAT_DIALOG_DATA) public readonly message: string
   ) {}

   public confirm(): void {
      this.dialogRef.close(true);
   }

   public cancel(): void {
      this.dialogRef.close(false);
   }
}
