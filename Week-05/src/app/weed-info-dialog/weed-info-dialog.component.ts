import { Component, Signal, WritableSignal, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Evidence } from '../models/evidence';
import { WeedType } from '../models/weed-type';
import { WeedDescription, WeedDescriptions } from './../weed-descriptions';
import { WeedSelectionService } from './weed-selection.service';

@Component({
   selector: 'weed-weed-info-dialog',
   standalone: true,
   imports: [
      MatButtonModule
   ],
   templateUrl: './weed-info-dialog.component.html',
   styleUrl: './weed-info-dialog.component.scss'
})
export class WeedInfoDialogComponent {
   public readonly weedList = Object.values(WeedType);
   public readonly evidenceList = Object.values(Evidence);
   public readonly selectedWeed: WritableSignal<WeedType | null>;
   public readonly selectedWeedDescription: Signal<WeedDescription | null>;
   public readonly selectedWeedEvidenceText: Signal<string>;
   public readonly evidenceSelection;
   
   constructor(
      private readonly weedSelectionService: WeedSelectionService
   ) {
      this.selectedWeed = signal(null)
      this.selectedWeedDescription = computed(() => this.selectedWeed() ? WeedDescriptions[this.selectedWeed()!] : null);
      this.selectedWeedEvidenceText = computed(() => this.selectedWeedDescription() ? this.selectedWeedDescription()!.evidences.map(evidence => evidence.toString()).join(", ") : "");
      this.evidenceSelection = weedSelectionService.evidenceSelectionStatus;
   }

   public selectWeed(weed: WeedType): void {
      if(this.selectedWeed() !== weed) {
         this.selectedWeed.set(weed);
      }
   }

   public clickOnWeed(weed: WeedType): void {
      const status = this.weedSelectionService.getWeedSelectionStatus(weed);
      if(status === "excluded") {
         return;
      }
      this.weedSelectionService.setWeedSelectionStatus(weed, status === "selected" ? "crossed" : status === "crossed" ? null : "selected");
   }

   public clickOnEvidence(evidence: Evidence): void {
      const status = this.weedSelectionService.evidenceSelectionStatus[evidence];
      this.weedSelectionService.evidenceSelectionStatus[evidence] = status === "selected" ? "crossed" : status === "crossed" ? null : "selected";
   }

   public getWeedSelectionStatus(weed: WeedType) {
      return this.weedSelectionService.getWeedSelectionStatus(weed);
   }
}
