import { Injectable } from '@angular/core';
import { Evidence } from '../models/evidence';
import { WeedType } from '../models/weed-type';
import { WeedDescriptions } from '../weed-descriptions';

type SelectionStatus = null | "selected" | "crossed" | "excluded";

@Injectable({
   providedIn: 'root'
})
export class WeedSelectionService {
   private readonly rawWeedSelectionStatus: Record<WeedType, SelectionStatus>;
   public readonly evidenceSelectionStatus: Record<Evidence, SelectionStatus>;
   private selectedWeed: WeedType | null = null;

   constructor() {
      this.rawWeedSelectionStatus = Object.values(WeedType).reduce((acc, weedType) => {
         acc[weedType] = null;
         return acc;
      }, {} as Record<WeedType, SelectionStatus>);
      this.evidenceSelectionStatus = Object.values(Evidence).reduce((acc, evidence) => {
         acc[evidence] = null;
         return acc;
      }, {} as Record<Evidence, SelectionStatus>);
   }

   public getWeedSelectionStatus(weedType: WeedType): SelectionStatus {
      if(WeedDescriptions[weedType].evidences.some(evidence => this.evidenceSelectionStatus[evidence] === "crossed")) {
         return "excluded";
      }
      let hasAllSelectedEvidence = true;
      for(const evidence in this.evidenceSelectionStatus) {
         if(this.evidenceSelectionStatus[evidence as Evidence] !== "selected") {
            continue;
         }
         if(!WeedDescriptions[weedType].evidences.includes(evidence as Evidence)) {
            hasAllSelectedEvidence = false;
            break;
         }
      }
      return !hasAllSelectedEvidence ? "excluded" : this.rawWeedSelectionStatus[weedType];
   }

   public setWeedSelectionStatus(weedType: WeedType, status: SelectionStatus): void {
      if(status === "selected") {
         this.selectedWeed = weedType;
         for(const weed in this.rawWeedSelectionStatus) {
            if(this.rawWeedSelectionStatus[weed as WeedType] === "selected") {
               this.rawWeedSelectionStatus[weed as WeedType] = null;
            }
         }
      } else if(weedType === this.selectedWeed) {
         this.selectedWeed = null;
      }
      this.rawWeedSelectionStatus[weedType] = status;
   }

   public getSelectedWeed(): WeedType | null {
      return this.selectedWeed;
   }
}
