import {Constants} from "./constants.js";
import {localId, sendToServer} from "./server.js";
import {PlayerEntity} from "./playerEntity.js";
import {ctx, render} from "./renderer.js";
import {Utils} from "./utils.js";

export const playerEntities = new Map();

export function getPlayerEntities() {
    return playerEntities;
}

export function createPlayer(id) {
    if (playerEntities.has(id)) {
        console.log("Player already exists: " + id);
        return playerEntities.get(id);
    }
    const playerEntity = new PlayerEntity(id, ctx.canvas.width / 2, ctx.canvas.height / 2, 0);
    console.log("create player " + id);
    playerEntities.set(id, playerEntity);
    return playerEntity;
}

export function removePlayer(id) {
    if (playerEntities.has(id)) {
        console.log("Player removed: " + id);
        playerEntities.delete(id);
    }
}

export function moveCallback(data) {
    const playerEntity = playerEntities.get(data.id);
}

window.addEventListener('keydown', function (event) {

    let data = {
        id: localId,
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

    if (key === "Escape") {

        const player = {
            id: localId,
            name: "R1nge" + Utils.randomInt(0, 1000),
            mousePositionX: Utils.randomInt(0, ctx.canvas.width),
            mousePositionY: Utils.randomInt(0, ctx.canvas.height)
        }

        sendToServer(player, Constants.commands.leave);
    }

    if (key === "Enter") {

        if (playerEntities.has(localId)) {
            console.log("Already joined");
            return;
        }

        const player = {
            id: localId,
            name: "R1nge" + Utils.randomInt(0, 1000),
            mousePositionX: Utils.randomInt(0, ctx.canvas.width),
            mousePositionY: Utils.randomInt(0, ctx.canvas.height)
        }

        sendToServer(player, Constants.commands.join);
    }
});

window.addEventListener('click', function (event) {

    const player = {
        id: localId,
        mousePositionX: event.clientX,
        mousePositionY: event.clientY
    }
    sendToServer(player, Constants.commands.shoot);
});

function gameLoop() {
    render(Constants.deltaTime);
}

setInterval(gameLoop, Constants.deltaTime);