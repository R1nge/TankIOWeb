import {sendToServer} from "./server.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const frameRate = 60;
const deltaTime = 1 / frameRate;

const playerSpeed = 250;
const playerEntity = new PlayerEntity(10, 100, 100, "white");

window.addEventListener('keydown', function (event) {

    let data = {
        horizontal: 0,
        vertical: 0,
        isShooting: false,
        mousePositionX: 0,
        mousePositionY: 0
    }

    const key = event.key;
    console.log("pressed: " + key);
    if (key === "w") {
        data.vertical = 1;
        playerEntity.move(playerSpeed, 0, 1, deltaTime);
    } else if (key === "a") {
        data.horizontal = -1;
        playerEntity.move(playerSpeed, -1, 0, deltaTime);
    } else if (key === "s") {
        data.vertical = -1;
        playerEntity.move(playerSpeed, 0, -1, deltaTime);
    } else if (key === "d") {
        data.horizontal = 1;
        playerEntity.move(playerSpeed, 1, 0, deltaTime);
    }

    sendToServer(data);
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerEntity.draw(ctx);
}

setInterval(render, deltaTime);