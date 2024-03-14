import {getPlayerId, getPosition, sendToServer} from "./server.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const frameRate = 60;
const deltaTime = 1 / frameRate;

const playerSpeed = 250;
const playerEntity = new PlayerEntity(10, 200, 200, "white");

window.addEventListener('keydown', function (event) {

    let data = {
        id: getPlayerId(),
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
        sendToServer(data, "Move");
    } else if (key === "a") {
        data.horizontal = -1;
        sendToServer(data, "Move");
    } else if (key === "s") {
        data.vertical = -1;
        sendToServer(data, "Move");
    } else if (key === "d") {
        data.horizontal = 1;
        sendToServer(data, "Move");
    }
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerEntity.draw(ctx);
    
    if (getPosition() === undefined || getPosition() === null || getPosition().positionX === 0 && getPosition().positionY === 0 || getPosition().positionX === undefined || getPosition().positionY === undefined) {
        return;
    }
    
    playerEntity.moveTo(playerSpeed, getPosition().positionX, getPosition().positionY, deltaTime);
}

setInterval(render, deltaTime);