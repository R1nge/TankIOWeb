const canvas = document.getElementById("myCanvas");
export const ctx = canvas.getContext("2d");

export function render(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}