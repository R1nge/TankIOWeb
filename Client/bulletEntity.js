﻿class BulletEntity {
    constructor(radius, x, y, color) {
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

    move(speed, directionX, directionY, deltaTime) {
        this.x += speed * directionX * deltaTime;
        this.y -= speed * directionY * deltaTime;
    }
}