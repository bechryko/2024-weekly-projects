import { CommonModule } from '@angular/common';
import { Component, Signal, WritableSignal, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { BonusPointComponent } from './dialogs/bonus-point/bonus-point.component';
import { TestComponent } from './dialogs/test/test.component';
import { Group } from './models/group';
import { StorageUtils } from './utils/storage.utils';

@Component({
   selector: 'lsm-root',
   standalone: true,
   imports: [
      CommonModule,
      MatFormFieldModule,
      MatSelectModule,
      MatSortModule,
      MatButtonModule
   ],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {
   public readonly groups: WritableSignal<Group[]>;
   public readonly selectedGroup: Signal<Group>;
   public readonly numberOfMiniTests: Signal<number>;
   public selectedGroupIndex: number = 0;

   constructor(
      private readonly dialog: MatDialog
   ) {
      this.groups = signal(this.loadSavedData());
      console.log(this.groups());
      this.selectedGroup = computed(() => this.groups()[this.selectedGroupIndex]);
      this.numberOfMiniTests = computed(() => Math.max(...this.selectedGroup().students.map(s => s.miniTestScores.length)));
   }

   public sortData(sort: Sort): void {}

   public saveChanges(): void {
      StorageUtils.saveToLocalStorage(this.groups());
   }

   private loadSavedData(): Group[] {
      return StorageUtils.loadFromLocalStorage();
   }
}
