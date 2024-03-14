import {ctx, render} from "./renderer.js";
import {PlayerEntity} from "./playerEntity.js";
import {Constants} from "./constants.js"; 

let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

socket.onopen = function (e) {

    const id = Math.floor(Math.random() * 1000)

    console.log(`Connected to server. Data sent: ${player}`);
    sendToServer(player, message_type.join);
};

socket.onmessage = function (event) {

    if (event.data.startsWith("Move")) {
        //trim everything before the {
        const data = event.data.substring(event.data.indexOf("{"));
        const parsedData = JSON.parse(data);
        console.log(data)
        position.positionX = parsedData.positionX;
        position.positionY = parsedData.positionY;
        console.log(`Move message received: ${position.positionX} ${position.positionY}`);
    }

    console.log(`received a message: ${event.data}`);
}

const player = {
    id: "0", //id.toString(), 
    name: "test",
    positionX: 0,
    positionY: 0
}


function getPlayerId() {
    return 0
}

let position = {
    positionX: 0,
    positionY: 0
};

function getPosition() {
    return position;
}

export function sendToServer(dataStruct, messageType) {
    const json = JSON.stringify(dataStruct)
    console.log(`Send to server json sent: ${json}`);
    socket.send(messageType + json);
}

const message_type = {
    join: "Join",
    move: "Move",
    leave: "Leave"
}

const playerEntity = new PlayerEntity(10, ctx.canvas.width / 2, ctx.canvas.height / 2, "red", 250);

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

function gameLoop() {
    render(Constants.deltaTime);
    playerEntity.draw(ctx);
    
    if (getPosition() === undefined || getPosition() === null || getPosition().positionX === 0 && getPosition().positionY === 0 || getPosition().positionX === undefined || getPosition().positionY === undefined) {
        return;
    }

    playerEntity.moveTo(getPosition().positionX, getPosition().positionY, Constants.deltaTime);
}

setInterval(gameLoop, Constants.deltaTime);