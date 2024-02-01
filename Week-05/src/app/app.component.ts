import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, filter, interval, map, takeUntil } from 'rxjs';
import { BASE_GROUND_WATER_LEVEL, FLOODVINE_FLOOD_CHANCE, GROUND_WATER_LEVEL_INCREASE, GROUND_WATER_LEVEL_INCREASE_CHANCE, MAX_WEED_SPREAD_PERCENTAGE, MIOSN_EATER_MAX_MIOSN_EATEN, VORACIOUS_THORNS_KILL_CHANCE, WEED_WATER_DRAIN_SPEED, WEED_WATER_DRAIN_SPEED_WITH_ABSORPTION } from './constants';
import { FieldInfoComponent } from './field-info/field-info.component';
import { InitDialogComponent } from './init-dialog/init-dialog.component';
import { Evidence } from './models/evidence';
import { Field } from './models/field';
import { WeedType } from './models/weed-type';
import { Dawner } from './plants/dawner';
import { Plant } from './plants/plant';
import { PoseidonFlower } from './plants/poseidon-flower';
import { SparrowRoot } from './plants/sparrow-root';
import { ResultsComponent } from './results/results.component';
import { WeedDescriptions } from './weed-descriptions';
import { WeedInfoDialogComponent } from './weed-info-dialog/weed-info-dialog.component';
import { WeedSelectionService } from './weed-info-dialog/weed-selection.service';

interface InitialData {
   weedType: WeedType;
}

interface WeedStats {
   spreadCooldown: number;
   size: number;
}

@Component({
   selector: 'weed-root',
   standalone: true,
   imports: [
      CommonModule,
      MatButtonModule,
      FieldInfoComponent
   ],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
   private initialData = {} as InitialData;
   public readonly fields: Field[][];
   public readonly endOfGame$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   private readonly weedStats: WeedStats;
   public selectedField?: Field;
   private readonly miosnSources: { x: number; y: number }[];

   constructor(
      private readonly dialog: MatDialog,
      private readonly weedSelectionService: WeedSelectionService
   ) {
      this.weedStats = this.initWeedStats();
      this.fields = this.initFields(10);
      this.miosnSources = this.chooseStartingMiosnSources();
   }

   public ngOnInit(): void {
      this.dialog.open(InitDialogComponent).afterClosed().pipe(
         map((weedType: string) => {
            if (!weedType || weedType === "random") {
               const keys = Object.keys(WeedType);
               const randomIndex = Math.floor(Math.random() * keys.length);
               return { weedType: Object.values(WeedType)[randomIndex] } as InitialData;
            }
            return { weedType } as InitialData;
         })
      ).subscribe((data: InitialData) => {
         this.initialData = data;
         this.recalculateMiosnLevels();
         this.startTicking();
      });
   }

   public onFieldSelected(field: Field): void {
      if(this.selectedField === field) {
         this.selectedField = undefined;
         return;
      }
      this.selectedField = field;
   }

   public openWeedDialog(): void {
      this.dialog.open(WeedInfoDialogComponent);
   }

   public getPlantNgClass(plant?: Plant): Record<string, boolean> {
      if(!plant) {
         return {};
      }
      return { [plant.cssClass]: true };
   }

   public isWeedSelected(): boolean {
      return this.weedSelectionService.getSelectedWeed() !== null;
   }

   public extermination(): void {
      const selectedWeedType = this.weedSelectionService.getSelectedWeed()!;
      this.dialog.open(ResultsComponent, {
         data: {
            selectedWeed: selectedWeedType,
            weedToGuess: this.initialData.weedType
         }
      });
      this.endOfGame$.next(true);
      this.endOfGame$.complete();
      this.weedSelectionService.setWeedSelectionStatus(selectedWeedType, null);
   }

   private tick(): void {
      const weedDescription = WeedDescriptions[this.initialData.weedType];

      if (this.weedStats.spreadCooldown > 0) {
         this.weedStats.spreadCooldown--;
      } else if (Math.random() < weedDescription.spreadChancePerSec) {
         this.weedStats.spreadCooldown = weedDescription.spreadCooldownInSecs;
         this.spreadWeed();
      }

      PoseidonFlower.floodArea(this.fields);
      
      this.recalculateMiosnLevels();

      const doFlood = this.initialData.weedType === WeedType.FLOODVINE && Math.random() < FLOODVINE_FLOOD_CHANCE;
      let floodedFieldIndex = doFlood ? this.fields.length ** 2 : -1;

      for(let i = 0; i < this.fields.length; i++) {
         for(let j = 0; j < this.fields[i].length; j++) {
            const field = this.fields[i][j];

            if(this.initialData.weedType === WeedType.MIOSN_EATER && field.isWeedPresent) {
               const miosnEaten = Math.floor(Math.random() * (MIOSN_EATER_MAX_MIOSN_EATEN + 1));
               field.miosnStrength = Math.max(0, field.miosnStrength - miosnEaten);
            }

            if(floodedFieldIndex === 0) {
               field.waterLevel += 100;
            }
            floodedFieldIndex--;

            if(field.plant) {
               field.plant.tick(field);

               if(this.initialData.weedType === WeedType.VORACIOUS_THORNS && field.isWeedPresent && field.plant.isYoung() && Math.random() < VORACIOUS_THORNS_KILL_CHANCE) {
                  field.plant.kill();
               }
            }

            if(field.waterLevel < BASE_GROUND_WATER_LEVEL && Math.random() < GROUND_WATER_LEVEL_INCREASE_CHANCE) {
               field.waterLevel += GROUND_WATER_LEVEL_INCREASE;
            }
         }
      }

      this.drainWater();
   }

   private spreadWeed(): void {
      const maxSize = this.fields.length ** 2 * (this.hasEvidence(Evidence.GROWTH) ? 1 : MAX_WEED_SPREAD_PERCENTAGE);
      if (this.weedStats.size >= maxSize) {
         return;
      }

      const possibleFields: Field[] = [];
      for (let i = 0; i < this.fields.length; i++) {
         for (let j = 0; j < this.fields[i].length; j++) {
            if ((this.fields[i + 1]?.[j]?.isWeedPresent || this.fields[i - 1]?.[j]?.isWeedPresent || this.fields[i][j + 1]?.isWeedPresent || this.fields[i][j - 1]?.isWeedPresent)
               && !this.fields[i][j].isWeedPresent) {
               possibleFields.push(this.fields[i][j]);
            }
         }
      }

      if (possibleFields.length > 0) {
         const randomIndex = Math.floor(Math.random() * possibleFields.length);
         possibleFields[randomIndex].isWeedPresent = true;
         this.weedStats.size++;
      }
   }

   private drainWater(): void {
      const drainSpeed = this.hasEvidence(Evidence.ABSORPTION) ? WEED_WATER_DRAIN_SPEED_WITH_ABSORPTION : WEED_WATER_DRAIN_SPEED;
      for (let i = 0; i < this.fields.length; i++) {
         for (let j = 0; j < this.fields[i].length; j++) {
            if(!this.fields[i][j].isWeedPresent) {
               continue;
            }
            if (this.fields[i][j].waterLevel > 0) {
               this.fields[i][j].waterLevel = Math.max(0, this.fields[i][j].waterLevel - drainSpeed);
            }
         }
      }
   }

   private startTicking(): void {
      interval(1000).pipe(
         takeUntil(this.endOfGame$.pipe(
            filter((endOfGame) => endOfGame)
         ))
      ).subscribe(() => {
         this.tick();
      });
   }

   private initFields(size: number): Field[][] {
      const fields: Field[][] = [];
      for (let i = 0; i < size; i++) {
         fields[i] = [];
         for (let j = 0; j < size; j++) {
            fields[i][j] = {
               isWeedPresent: false,
               waterLevel: BASE_GROUND_WATER_LEVEL,
               miosnStrength: 0,
               plant: Math.random() < 0.1 ? this.getStartingPlant() : undefined
            };
         }
      }

      const startingWeedLocationIndex = Math.floor(Math.random() * size ** 2);
      fields[Math.floor(startingWeedLocationIndex / size)][startingWeedLocationIndex % size].isWeedPresent = true;
      this.weedStats.size++;

      return fields;
   }

   private getStartingPlant(): Plant {
      return Math.random() < 0.1 ? new SparrowRoot() : new Dawner();
   }

   private initWeedStats(): WeedStats {
      return {
         spreadCooldown: 0,
         size: 0
      };
   }

   private chooseStartingMiosnSources(): { x: number; y: number }[] {
      const possibleFields: { x: number; y: number }[] = [];
      for (let i = 0; i < this.fields.length; i++) {
         possibleFields.push({ x: i, y: 0 });
         possibleFields.push({ x: i, y: this.fields.length - 1 });
         if(i === 0 || i === this.fields.length - 1) {
            continue;
         }
         possibleFields.push({ x: 0, y: i });
         possibleFields.push({ x: this.fields.length - 1, y: i });
      }

      const sourceNumber = Math.floor(Math.random() * 3) + 1;
      const sources: { x: number; y: number }[] = [];
      for (let i = 0; i < sourceNumber; i++) {
         const randomIndex = Math.floor(Math.random() * possibleFields.length);
         sources.push(possibleFields.splice(randomIndex, 1)[0]);
      }
      return sources;
   }

   private hasEvidence(evidence: Evidence): boolean {
      const weedDescription = WeedDescriptions[this.initialData.weedType];
      return weedDescription.evidences.includes(evidence);
   }

   private recalculateMiosnLevels(): void {
      for (let i = 0; i < this.fields.length; i++) {
         for (let j = 0; j < this.fields[i].length; j++) {
            this.fields[i][j].miosnStrength = 0;
         }
      }

      for (const source of this.miosnSources) {
         this.spreadMiosn(source, 20);
      }
   }

   private spreadMiosn(source: { x: number; y: number }, strength: number): void {
      if (strength < 1 || this.fields[source.x][source.y].miosnStrength >= strength) {
         return;
      }

      const sourceField = this.fields[source.x][source.y];
      sourceField.miosnStrength = strength;

      if(this.fields[source.x][source.y].isWeedPresent && this.hasEvidence(Evidence.DISENCHANTMENT)) {
         return;
      }

      if (source.x > 0) {
         this.spreadMiosn({ x: source.x - 1, y: source.y }, strength - 1);
      }
      if (source.x < this.fields.length - 1) {
         this.spreadMiosn({ x: source.x + 1, y: source.y }, strength - 1);
      }
      if (source.y > 0) {
         this.spreadMiosn({ x: source.x, y: source.y - 1 }, strength - 1);
      }
      if (source.y < this.fields.length - 1) {
         this.spreadMiosn({ x: source.x, y: source.y + 1 }, strength - 1);
      }
   }
}
