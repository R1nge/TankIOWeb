import {getPlayers} from "./engine.js";

const canvas = document.getElementById("myCanvas");
export const ctx = canvas.getContext("2d");

export function render(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(renderPlayers);
}

function renderPlayers() {
    if (getPlayers().size === 0) {
        return;
    }

    for (const playerEntity of getPlayers().values()) {
        playerEntity.draw(ctx);
        console.log(playerEntity.id)
    }
}