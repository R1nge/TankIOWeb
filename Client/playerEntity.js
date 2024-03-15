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

    moveTo(directionX, directionY) {
        this.x = directionX;
        this.y = directionY;
    }
}