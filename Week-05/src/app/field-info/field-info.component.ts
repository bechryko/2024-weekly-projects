import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Field } from '../models/field';
import { Dawner } from '../plants/dawner';
import { PoseidonFlower } from '../plants/poseidon-flower';
import { SparrowRoot } from '../plants/sparrow-root';

@Component({
   selector: 'weed-field-info',
   standalone: true,
   imports: [
      MatFormFieldModule,
      MatSelectModule,
      MatButtonModule
   ],
   templateUrl: './field-info.component.html',
   styleUrl: './field-info.component.scss'
})
export class FieldInfoComponent {
   public readonly plantList = [
      "Sparrow Root",
      "Poseidon Flower",
      "Dawner"
   ];
   @Input() public field?: Field;
   @Input() public endOfGame?: boolean;
   public selectedPlant?: string;

   public plant(): void {
      if(this.field && this.selectedPlant) {
         switch(this.selectedPlant) {
            case "Sparrow Root":
               this.field.plant = new SparrowRoot();
               break;
            case "Poseidon Flower":
               this.field.plant = new PoseidonFlower();
               break;
            case "Dawner":
               this.field.plant = new Dawner();
               break;
         }
      }
   }

   public removePlant(): void {
      if(this.field) {
         this.field.plant = undefined;
      }
   }
}
