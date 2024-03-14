import {getPosition, sendToServer} from "./server.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const frameRate = 60;
const deltaTime = 1 / frameRate;

const playerSpeed = 250;
const playerEntity = new PlayerEntity(10, 0, 0, "white");

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
    //    playerEntity.move(playerSpeed, 0, 1, deltaTime);
    } else if (key === "a") {
        data.horizontal = -1;
    //    playerEntity.move(playerSpeed, -1, 0, deltaTime);
    } else if (key === "s") {
        data.vertical = -1;
    //    playerEntity.move(playerSpeed, 0, -1, deltaTime);
    } else if (key === "d") {
        data.horizontal = 1;
    //    playerEntity.move(playerSpeed, 1, 0, deltaTime);
    }

    sendToServer(data, "Move");
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerEntity.draw(ctx);
    if(getPosition() === undefined || getPosition() === null || getPosition().positionX === 0 && getPosition().positionY === 0 || getPosition().positionX === undefined || getPosition().positionY === undefined) {
        return;
    }
    console.log("Move: " + getPosition().positionX + " " + getPosition().positionY);
    playerEntity.move(playerSpeed, getPosition().positionX, getPosition().positionY, deltaTime);
}

setInterval(render, deltaTime);