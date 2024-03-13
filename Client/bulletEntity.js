function createBullet(radius, x, y) {
    this.radius = radius
    this.x = x
    this.y = y
    return this
}

function draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}