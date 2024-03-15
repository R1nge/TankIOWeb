import {Utils} from "./utils.js";
import {Constants} from "./constants.js";

export class PlayerEntity {
    constructor(id, radius, x, y, color) {
        this.id = id;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    moveTo(positionX, positionY) {
        this.x = Utils.lerp(this.x, positionX, Constants.deltaTime);
        this.y = Utils.lerp(this.y, positionY, Constants.deltaTime);
    }
}