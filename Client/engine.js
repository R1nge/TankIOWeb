import {Constants} from "./constants.js";
import {getLocalId, sendToServer} from "./server.js";
import {PlayerEntity} from "./playerEntity.js";
import {ctx, render} from "./renderer.js";

const playerEntities = new Map();

export function getPlayers() {
    return playerEntities;
}

export function createPlayer(id) {
    const playerEntity = new PlayerEntity(id, 10, ctx.canvas.width / 2, ctx.canvas.height / 2, "red");
    console.log("create player " + id);
    playerEntities.set(id, playerEntity);
    return playerEntity;
}

export function moveCallback(data) {
    console.log("moveCallback called");
    console.log(data.id)
    const playerEntity = playerEntities.get(data.id);
    console.log("moveCallback: " + data.x + " " + data.y);
    playerEntity.moveTo(data.x, data.y);
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