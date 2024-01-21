import { CanvasDrawer } from "./canvas-drawer";

/**
 * A function to bind a CanvasDrawer object to a canvas which wraps some drawing functionalities.
 * 
 * @throws if the HTML element is not found or the selected element is not a canvas
 * @param canvasId the id of the HTML canvas element
 * @returns a CanvasDrawer
 */
export function importCanvas(canvasId: string): CanvasDrawer {
   const canvas = document.getElementById(canvasId);
   if (!canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
   }
   if(canvas.tagName !== "CANVAS") {
      throw new Error(`Element with id ${canvasId} is not a canvas`);
   }
   return new CanvasDrawer(canvas as HTMLCanvasElement);
}
