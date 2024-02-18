import { Component, ElementRef, Inject, Signal, ViewChild, WritableSignal, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import cloneDeep from 'lodash.clonedeep';
import { Group } from '../../models/group';
import { Student } from '../../models/student';
import { BonusPointFormatUtils } from './bonus-point-format.utils';
import { DataModification } from './data-modification';

@Component({
   selector: 'lsm-bonus-point',
   standalone: true,
   imports: [
      MatButtonModule
   ],
   templateUrl: './bonus-point.component.html',
   styleUrl: './bonus-point.component.scss'
})
export class BonusPointComponent {
   @ViewChild('rawInputArea') rawInputArea?: ElementRef<HTMLTextAreaElement>;
   public readonly dataModifications: WritableSignal<Record<string, DataModification[]> | null>;
   public readonly dataModificationsArray: Signal<DataModification[][]>;
   private readonly data: Group[];

   constructor(
      private readonly dialogRef: MatDialogRef<BonusPointComponent>,
      @Inject(MAT_DIALOG_DATA) data: Group[]
   ) {
      this.data = cloneDeep(data);
      this.dataModifications = signal(null);
      this.dataModificationsArray = computed(() => {
         const dataModifications = this.dataModifications();
         return dataModifications ? Object.values(dataModifications) : [];
      });
   }

   public processInput(): void {
      if(!this.rawInputArea) {
         return;
      }

      const rawInput = this.rawInputArea.nativeElement.value;
      const formattedInput = BonusPointFormatUtils.formatRawInput(rawInput);
      
      const dataModifications: Record<string, DataModification[]> = {};
      formattedInput.forEach(group => {
         dataModifications[group.name] = [];

         group.students.forEach(student => {
            const studentInData = this.students(group.name).find?.(s => s.name === student.name);
            if(!studentInData) {
               dataModifications[group.name].push({
                  type: 'addStudent',
                  studentName: student.name!,
                  bonusPoints: student.bonusPoints!
               });
               this.students(group.name).push(student as Student);
            } else {
               dataModifications[group.name].push({
                  type: 'addBonusPoints',
                  studentName: student.name!,
                  oldBonusPoints: studentInData.bonusPoints,
                  newBonusPoints: studentInData.bonusPoints + student.bonusPoints!,
                  addedBonusPoints: student.bonusPoints!
               });
               studentInData.bonusPoints += student.bonusPoints!;
            }
         });

         dataModifications[group.name] = dataModifications[group.name].sort((a, b) => a.studentName.localeCompare(b.studentName));
         this.data.find(g => g.name === group.name)!.students = this.students(group.name).sort((a, b) => a.name.localeCompare(b.name));
      });

      this.dataModifications.set(dataModifications);
   }

   public saveChanges(): void {
      this.dialogRef.close(this.data);
   }

   public getGroupNameFromIndex(index: number): string {
      return Object.keys(this.dataModifications()!)[index];
   }

   private students(groupName: string): Student[] {
      return this.data.find(g => g.name === groupName)!.students;
   }
}
