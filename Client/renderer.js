import { sendToServer } from "./server.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const frameRate = 60;


const deltaTime = 1 / frameRate;
const bulletSpeed = 5;

const bulletEntity = new BulletEntity(
    5,
    canvas.width / 2,
    canvas.height / 2,
    "red"
);

window.addEventListener('keydown', function (event) {
    
    let data = {
        horizontal: 69,
        vertical: 1337
    }
    
    
    const key = event.key;
    console.log("pressed: " + key);
    if (key === "w") {
        sendToServer(data);
        bulletEntity.move(bulletSpeed, 0, 10, deltaTime);
    } else if (key === "a") {
        bulletEntity.move(bulletSpeed, -10, 0, deltaTime);
    } else if (key === "s") {
        bulletEntity.move(bulletSpeed, 0, -10, deltaTime);
    } else if (key === "d") {
        bulletEntity.move(bulletSpeed, 10, 0, deltaTime);
    }
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bulletEntity.draw(ctx);
}

setInterval(render, deltaTime);