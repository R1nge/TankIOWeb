import {Constants} from "./constants.js";
import {getLocalId, sendToServer} from "./server.js";
import {PlayerEntity} from "./playerEntity.js";
import {ctx, render} from "./renderer.js";

const playerEntities = new Map();

export function getPlayers() {
    return playerEntities;
}

export function createPlayer(id) {
    const playerEntity = new PlayerEntity(id, ctx.canvas.width / 2, ctx.canvas.height / 2, 0);
    console.log("create player " + id);
    playerEntities.set(id, playerEntity);
    return playerEntity;
}

export function joinCallback(data) {
    
}

export function moveCallback(data) {
    const playerEntity = playerEntities.get(data.id);

    //Move right
    if (playerEntity.x < data.x) {
        playerEntity.rotate(0);
    }

    //Move left
    if (playerEntity.x > data.x) {
        playerEntity.rotate(Math.PI);
    }

    //Move Down
    if (playerEntity.y < data.y) {
        playerEntity.rotate(Math.PI / 2);
    }

    //Move Up
    if (playerEntity.y > data.y) {
        playerEntity.rotate(-Math.PI / 2);
    }
}

window.addEventListener('keydown', function (event) {

    let data = {
        id: getLocalId(),
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
        sendToServer(data, Constants.commands.move);
    } else if (key === "a") {
        data.horizontal = -1;
        sendToServer(data, Constants.commands.move);
    } else if (key === "s") {
        data.vertical = -1;
        sendToServer(data, Constants.commands.move);
    } else if (key === "d") {
        data.horizontal = 1;
        sendToServer(data, Constants.commands.move);
    }
});

function gameLoop() {
    render(Constants.deltaTime);
}

setInterval(gameLoop, Constants.deltaTime);