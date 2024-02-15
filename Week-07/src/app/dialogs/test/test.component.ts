import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import cloneDeep from 'lodash.clonedeep';
import { Group } from '../../models/group';
import { Student } from '../../models/student';
import { DataModification } from './data-modification';
import { TestFormatUtils } from './test-format.utils';

interface TestDescription {
   name: string;
   value: string;
}

@Component({
   selector: 'lsm-test',
   standalone: true,
   imports: [
      CommonModule,
      MatButtonModule,
      MatFormFieldModule,
      MatSelectModule
   ],
   templateUrl: './test.component.html',
   styleUrl: './test.component.scss'
})
export class TestComponent {
   @ViewChild('rawInputArea') rawInputArea?: ElementRef<HTMLTextAreaElement>;
   public readonly dataModifications: WritableSignal<DataModification[]>;
   public readonly data: Group;
   private readonly maximumMiniTestNumber: number;
   public selectedTestType: string;

   constructor(
      private readonly dialogRef: MatDialogRef<TestComponent>,
      @Inject(MAT_DIALOG_DATA) data: Group[]
   ) {
      this.data = cloneDeep(data[0]);
      this.maximumMiniTestNumber = Math.max(...this.data.students.map(s => s.miniTestScores?.length ?? 0), 0);
      this.dataModifications = signal([]);
      this.selectedTestType = String(this.maximumMiniTestNumber);
   }

   public processInput(): void {
      if (!this.rawInputArea) {
         return;
      }

      const rawInput = this.rawInputArea.nativeElement.value;
      const formattedInput = TestFormatUtils.formatRawInput(rawInput);

      const dataModifications: DataModification[] = [];
      formattedInput.forEach(student => {
         const studentInGroup = this.data.students.find(s => s.neptun === student.neptun);
         if (!studentInGroup) {
            dataModifications.push({
               ...student,
               type: 'newStudent'
            });
            const newStudent: Student = {
               name: student.name,
               neptun: student.neptun,
               bonusPoints: 0,
               miniTestScores: [],
               endOfSemesterTestScore: this.selectedTestType === 'endOfSemesterTest' ? student.result : undefined
            };
            if(this.selectedTestType !== 'endOfSemesterTest') {
               newStudent.miniTestScores[Number(this.selectedTestType)] = student.result;
            }
            this.data.students.push(newStudent);
            return;
         }
         const studentInGroupsResult = this.selectedTestType === 'endOfSemesterTest'
            ? studentInGroup.endOfSemesterTestScore
            : studentInGroup.miniTestScores[Number(this.selectedTestType)];
         if (student.result === studentInGroupsResult) {
            return;
         }
         if (!studentInGroupsResult) {
            dataModifications.push({
               name: student.name,
               neptun: student.neptun,
               oldNeptun: studentInGroup.neptun === student.neptun ? undefined : studentInGroup.neptun,
               result: student.result,
               type: 'newTestResult'
            });
         } else {
            dataModifications.push({
               name: student.name,
               neptun: student.neptun,
               oldNeptun: studentInGroup.neptun === student.neptun ? undefined : studentInGroup.neptun,
               oldResult: studentInGroupsResult,
               newResult: student.result,
               type: 'modifiedTestResult'
            });
         }
         if(this.selectedTestType === 'endOfSemesterTest') {
            studentInGroup.endOfSemesterTestScore = student.result;
         } else {
            studentInGroup.miniTestScores[Number(this.selectedTestType)] = student.result;
         }
         studentInGroup.neptun = student.neptun;
      });

      this.dataModifications.set(dataModifications);
   }

   public saveChanges(): void {
      this.dialogRef.close([ this.data ]);
   }

   public getGroupNameFromIndex(index: number): string {
      return Object.keys(this.dataModifications()!)[index];
   }

   public get displayTests(): TestDescription[] {
      return [...Array.from({ length: this.maximumMiniTestNumber + 1 }, (_, i) => ({
         name: `${i + 1}. minizh`,
         value: String(i)
      })), {
         name: 'Nagyzh',
         value: 'endOfSemesterTest'
      }];
   }

   public get selectedTestName(): string {
      return this.displayTests.find(test => test.value === this.selectedTestType)!.name;
   }
}
