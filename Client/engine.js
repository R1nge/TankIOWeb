import {Constants} from "./constants.js";
import {sendToServer} from "./server.js";
import {PlayerEntity} from "./playerEntity.js";
import {ctx, render} from "./renderer.js";
import {getPosition} from "./server.js";

const playerEntities = new Map();

export function createCallback(data) {
    console.log("createCallback called");
    const playerEntity = new PlayerEntity(10, ctx.canvas.width / 2, ctx.canvas.height / 2, "red", 250);
    playerEntity.x = data.positionX;
    playerEntity.y = data.positionY;
    console.log(playerEntity);
    playerEntities.set(Number(data.id), playerEntity);
    console.log("Player spawned");
}

export function moveCallback(data) {
    console.log("moveCallback called");
    const playerEntity = playerEntities.get(Number(data.id));
    console.log("moveCallback: " + data.positionX + " " + data.positionY);
    playerEntity.moveTo(data.positionX, data.positionY)
}


window.addEventListener('keydown', function (event) {

    let data = {
        id: 0,
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

function gameLoop() {
    render(Constants.deltaTime);
    //ctx.translate(ctx.canvas.width / 2 - playerEntity.x, ctx.canvas.height / 2 - playerEntity.y);
    
    if (playerEntities.size === 0) {
        return;
    }
    
    for (let i = 0; i < playerEntities.size; i++) {
        const playerEntity = playerEntities.get(i);
        if (playerEntity === undefined) {
            continue;
        }
        playerEntity.draw(ctx);
        playerEntity.moveTo(getPosition().positionX, getPosition().positionY, Constants.deltaTime);
    }
}

setInterval(gameLoop, Constants.deltaTime);