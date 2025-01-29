import { observable, action } from "mobx";
import { Utils } from "../Utils";
import { MOUSE_TRAIL_MAX_POINTS } from "../Constants";

/** A single point in our mouse trail */
export interface TrailPoint {
  id: string;      // unique ID, so it can be referred to later on
  x: number;
  y: number;
  createdAt: number; // timestamp we added the point
}

/**Represents the store for a MouseTrail,
 * which is composed of an array of TrailPoints
 */
export class MouseTrailStore {
  @observable
  public points: TrailPoint[] = [];

    /** 
    * Takes in an x and y coordinate for the mouse trail point to be added.
    * Instantiates a new mouse trail point and removes the oldest point in
    * the points array if the size of the array exceeds the limit.
    *  
   * Limiting the points array to a constant max number of points is important to prevent memory blow-up.
   * 
   * (While they will fade out and be graphically removed through SCSS styling, 
   * it is still necessary to logically remove them as well)
   */
  @action
  public addPoint(x: number, y: number) {

    const newPoint: TrailPoint = {
      id: Utils.GenerateGuid(),
      x,
      y,
      createdAt: Date.now(),
    };
    this.points.push(newPoint); //Adds the new point created above

    // If we exceed the max, drop the oldest point
    if (this.points.length > MOUSE_TRAIL_MAX_POINTS) {
      this.points.shift();
    }
  }
}
