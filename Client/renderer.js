const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const frameRate = 60;
const deltaTime = 1 / frameRate;


const bulletSpeed = 5;
const bulletEntity = createBullet(
    5, 
    canvas.width / 2 , 
    canvas.height / 2,
    "red"
);

bulletEntity.draw();


function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bulletEntity.draw();
    bulletEntity.move(bulletSpeed, 1, 1, deltaTime);
}

setInterval(render, deltaTime);