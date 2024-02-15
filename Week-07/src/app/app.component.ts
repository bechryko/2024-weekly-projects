import { CommonModule } from '@angular/common';
import { Component, Signal, WritableSignal, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { BonusPointComponent } from './dialogs/bonus-point/bonus-point.component';
import { ExportComponent } from './dialogs/export/export.component';
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
   private readonly _selectedGroupIndex: WritableSignal<number>;

   constructor(
      private readonly dialog: MatDialog,
      private readonly snackbar: MatSnackBar
   ) {
      this.groups = signal(this.loadSavedData());
      this._selectedGroupIndex = signal(0);
      this.selectedGroup = computed(() => this.groups()[this.selectedGroupIndex]);
      this.numberOfMiniTests = computed(() => Math.max(...this.selectedGroup().students.map(s => s.miniTestScores?.length ?? 0), 0));
   }

   public sortData(sort: Sort): void {}

   public openDialog(dialog: 'bonusPoints' | 'test' | 'export'): void {
      const dialogComponent = (dialog === 'bonusPoints') ? BonusPointComponent : ((dialog === 'export') ? ExportComponent : TestComponent);
      this.dialog.open(dialogComponent as any, {
         data: dialogComponent === TestComponent ? [ this.selectedGroup() ] : this.groups()
      }).afterClosed().subscribe(
         (modifiedData: Group[]) => {
            if (modifiedData) {
               if(dialogComponent === TestComponent) {
                  this.groups.update(groups => {
                     groups[this.selectedGroupIndex] = modifiedData[0];
                     return groups;
                  });
               } else {
                  this.groups.set(modifiedData);
               }
               this.saveChanges();
            }
            this.groups.set(StorageUtils.loadFromLocalStorage());
         }
      );
   }

   public saveChanges(): void {
      StorageUtils.saveToLocalStorage(this.groups());
      this.snackbar.open('Változtatások elmentve!', undefined, {
         duration: 2000
      });
   }

   public set selectedGroupIndex(index: number) {
      this._selectedGroupIndex.set(index);
   }

   public get selectedGroupIndex(): number {
      return this._selectedGroupIndex();
   }

   public get miniTests(): string[] {
      return Array.from({ length: this.numberOfMiniTests() }, (_, i) => (i + 1) + ". minizh");
   }

   private loadSavedData(): Group[] {
      return StorageUtils.loadFromLocalStorage();
   }
}
