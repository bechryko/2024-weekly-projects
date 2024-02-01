import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WeedType } from '../models/weed-type';

interface Data {
  selectedWeed: WeedType;
  weedToGuess: WeedType;
}

@Component({
  selector: 'weed-results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: Data
  ) { }
}
