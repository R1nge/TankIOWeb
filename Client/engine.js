import {Constants} from "./constants.js";
import {sendToServer} from "./server.js";
import {PlayerEntity} from "./playerEntity.js";
import {ctx, render} from "./renderer.js";
import {getPosition} from "./server.js"; 

const playerEntity = new PlayerEntity(10, ctx.canvas.width / 2, ctx.canvas.height / 2, "red", 250);

export function createCallback(data){
    console.log("createCallback called");
    
    if (data.id === "0"){
        console.log("Player spawned");
        playerEntity.x = data.positionX;
        playerEntity.y = data.positionY;
        //playerEntity.color = data.color;
        //playerEntity.radius = data.radius;
        //playerEntity.mass = data.mass;
    }
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
const playerEntity2 = new PlayerEntity(10, ctx.canvas.width / 2 + 1, ctx.canvas.height / 2 + 1, "blue", 250);

function gameLoop() {
    render(Constants.deltaTime);
    //ctx.translate(ctx.canvas.width / 2 - playerEntity.x, ctx.canvas.height / 2 - playerEntity.y);
    playerEntity.draw(ctx);
    playerEntity2.draw(ctx);

    if (getPosition() === undefined || getPosition() === null || getPosition().positionX === 0 && getPosition().positionY === 0 || getPosition().positionX === undefined || getPosition().positionY === undefined) {
        return;
    }

    playerEntity.moveTo(getPosition().positionX, getPosition().positionY, Constants.deltaTime);
}

setInterval(gameLoop, Constants.deltaTime);