import {getPlayers} from "./engine.js";

const canvas = document.getElementById("myCanvas");
export const ctx = canvas.getContext("2d");

export function render(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderPlayers();
}

function renderPlayers(){
    if (getPlayers().size === 0) {
        return;
    }

    for (let i = 0; i < getPlayers().size; i++) {
        const playerEntity = getPlayers().get(i);
        if (playerEntity === undefined) {
            continue;
        }
        console.log("playerEntity: " + playerEntity.x + " " + playerEntity.y);
        playerEntity.draw(ctx);
    }
}