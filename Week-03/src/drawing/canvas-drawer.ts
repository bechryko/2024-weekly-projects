import { CanvasOptions } from "./canvas-options";
import { RectangleDescription } from "./rectangle-description";

const canvasDefaults = {
   width: 500,
   height: 500
} as const;

/**
 * A class to handle a HTML canvas object and draw basic shapes on it.
 */
export class CanvasDrawer {
   private readonly ctx: CanvasRenderingContext2D;

   constructor(
      private readonly canvas: HTMLCanvasElement,
      options?: CanvasOptions
   ) {
      this.setCanvasOptions(options);

      this.ctx = this.canvas.getContext("2d")!;
      this.setDefaultCtxOptions();
   }

   /**
    * Method to draw a line based on a displacement vector.
    * 
    * @param x the starting X coordinate of the line
    * @param y the starting Y coordinate of the line
    * @param dx the X coordinate of the displacement vector of the line
    * @param dy the Y coordinate of the displacement vector of the line
    * @param thickness the thickness of the line
    */
   public line(x: number, y: number, dx: number, dy: number, thickness?: number): void {
      if(thickness) {
         this.lineWidth = thickness;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + dx, y + dy);
      this.ctx.stroke();
   }

   /**
    * Method to draw a rectangle on the canvas.
    * 
    * @param description the description of the rectangle
    * @param fill whether the rectangle should be filled (or stroked)
    * @param color the color of the rectangle
    */
   public rect(description: RectangleDescription, fill = true, color?: string): void {
      if (fill && color) {
         this.fillStyle = color;
      } 
      if(!fill && color) {
         this.strokeStyle = color;
      }

      this.ctx.beginPath();
      this.ctx.rect(description.x, description.y, description.width, description.height);
      this.ctx[fill ? "fill" : "stroke"]();
   }

   /**
    * Method to draw a circle on the canvas.
    * 
    * @param x the X coordinate of the center of the circle
    * @param y the Y coordinate of the center of the circle
    * @param radius the radius of the circle
    * @param fill whether the circle should be filled (or stroked)
    * @param color the color of the circle
    */
   public circle(x: number, y: number, radius: number, fill = true, color?: string) {
      if (fill && color) {
         this.fillStyle = color;
      }
      if(!fill && color) {
         this.strokeStyle = color;
      }

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx[fill ? "fill" : "stroke"]();
   }

   /**
    * Method to draw a filled text on the canvas.
    * 
    * @param text the text to be drawn
    * @param x the X coordinate of the center point of the text
    * @param y the Y coordinate of the center point of the text
    * @param color the color of the text
    */
   public text(text: string, x: number, y: number, color?: string) {
      if (color) {
         this.fillStyle = color;
      }

      this.ctx.fillText(text, x, y);
   }
   
   /**
    * Method to draw an image on the canvas.
    * 
    * @param img the image to be drawn
    * @param description the description of the rectangle-shaped image
    */
   public image(img: CanvasImageSource, description: RectangleDescription): void {
      this.ctx.drawImage(img, description.x - description.width / 2, description.y - description.height / 2, description.width, description.height);
   }
   
   /**
    * Method to draw a part of an image on the canvas.
    * 
    * @param img the source image
    * @param sourceDescription the description of the rectangle-shaped part of the source image to be drawn on the canvas
    * @param destinationDescription the description of the rectangle-shaped part of the canvas to be drawn on
    */
   public imagePart(img: CanvasImageSource, sourceDescription: RectangleDescription, destinationDescription: RectangleDescription): void {
      this.ctx.drawImage(img, 
         sourceDescription.x, sourceDescription.y, sourceDescription.width, sourceDescription.height,
         destinationDescription.x - destinationDescription.width / 2, destinationDescription.y - destinationDescription.height / 2, destinationDescription.width, destinationDescription.height
      );
   }
   
   /**
    * Method to clear the canvas.
    * 
    * @param color the color to fill the canvas with
    */
   public clear(color?: string) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if(color) {
         this.ctx.fillStyle = color;
         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
   }

   private setCanvasOptions(options?: CanvasOptions): void {
      this.canvas.width = options?.width ?? canvasDefaults.width;
      this.canvas.height = options?.height ?? canvasDefaults.height;
   }

   private setDefaultCtxOptions(): void {
      this.lineWidth = 1;
      this.strokeStyle = "black";
      this.fillStyle = "black";
      this.lineCap = "round";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
   }

   public set strokeStyle(color: string) {
      if (this.ctx.strokeStyle != color) {
         this.ctx.strokeStyle = color;
      }
   }
   public set fillStyle(color: string) {
      if (this.ctx.fillStyle != color) {
         this.ctx.fillStyle = color;
      }
   }
   public set lineWidth(width: number) {
      if (this.ctx.lineWidth != width) {
         this.ctx.lineWidth = width;
      }
   }
   public set lineCap(cap: CanvasLineCap) {
      if (this.ctx.lineCap != cap) {
         this.ctx.lineCap = cap;
      }
   }
}
