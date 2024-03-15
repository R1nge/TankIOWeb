export class PlayerEntity {
    constructor(id, x, y, rotationAngle) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.image = new Image(128, 128);
        this.image.src = "./Sprites/tankGreen.png";
        this.rotationAngle = rotationAngle;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
        ctx.restore();
    }

    rotate(angle) {
        this.rotationAngle = angle
    }
}