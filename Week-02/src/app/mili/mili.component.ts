import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
   selector: 'mili2048-mili',
   standalone: true,
   imports: [],
   templateUrl: './mili.component.html',
   styleUrl: './mili.component.scss'
})
export class MiliComponent implements AfterViewInit {
   @ViewChild('canvas') canvasRef?: ElementRef<HTMLCanvasElement>;
   public ctx?: CanvasRenderingContext2D;

   public ngAfterViewInit(): void {
      this.ctx = this.canvas.getContext('2d')!;
      this.drawMili(200);
   }

   private drawMili(size: number): void {
      this.ctx!.fillStyle = "yellow";
      this.ctx!.strokeStyle = "black";

      // head
      this.circle(size / 2, size / 2, size * 0.45, "yellow");
      this.circle(size / 2, size / 2, size * 0.45, "yellow", false);

      // mouth
      this.circle(size / 2, size / 2, size * 0.35, "black", true, true);

      // eyes
      const eyeDistanceXConstant = 0.23;
      this.circle(size * eyeDistanceXConstant, size * 0.37, size * 0.1, "white");
      this.circle(size * eyeDistanceXConstant, size * 0.37, size * 0.1, "black", false);
      this.circle(size * eyeDistanceXConstant, size * 0.37, size * 0.08, "black");
      this.circle(size * (eyeDistanceXConstant + 0.01), size * 0.36, size * 0.02, "white");
      
      this.circle(size * (1 - eyeDistanceXConstant), size * 0.37, size * 0.1, "white");
      this.circle(size * (1 - eyeDistanceXConstant), size * 0.37, size * 0.1, "black", false);
      this.circle(size * (1 - eyeDistanceXConstant), size * 0.37, size * 0.08, "black");
      this.circle(size * (1 - (eyeDistanceXConstant + 0.01)), size * 0.36, size * 0.02, "white");
   }

   private circle(x: number, y: number, r: number, color: string, isFill = true, isHalf = false) {
      this.ctx!.fillStyle = color;
      this.ctx!.beginPath();
      this.ctx!.arc(x, y, r, 0, Math.PI * (1 + Number(!isHalf)));
      this.ctx![isFill ? "fill" : "stroke"]();
   }

   get canvas(): HTMLCanvasElement {
      return this.canvasRef!.nativeElement;
   }
}
