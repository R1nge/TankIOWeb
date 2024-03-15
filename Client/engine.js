import {Constants} from "./constants.js";
import {sendToServer} from "./server.js";
import {PlayerEntity} from "./playerEntity.js";
import {ctx, render} from "./renderer.js";

const playerEntities = new Map();

export function createPlayer(id) {
    const playerEntity = new PlayerEntity(10, 10, ctx.canvas.width / 2, ctx.canvas.height / 2, "red");
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

    if (playerEntities.size === 0) {
        return;
    }

    for (let i = 0; i < playerEntities.size; i++) {
        const playerEntity = playerEntities.get(i);
        if (playerEntity === undefined) {
            continue;
        }
        console.log("playerEntity: " + playerEntity.x + " " + playerEntity.y);
        playerEntity.draw(ctx);
    }
}

setInterval(gameLoop, Constants.deltaTime);