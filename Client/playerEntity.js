export class PlayerEntity {
    constructor(radius, x, y, color, speed) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    moveTo(directionX, directionY, deltaTime) {
        this.x = this.speed * directionX * deltaTime;
        this.y = this.speed * directionY * deltaTime;
    }
}