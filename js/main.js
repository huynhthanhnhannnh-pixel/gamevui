import { InputHandler } from './InputHandler.js';
import { Player } from './Player.js';
import { Camera } from './Camera.js';
import { platforms, drawWorld } from './World.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Khởi tạo các đối tượng
const input = new InputHandler();
const player = new Player();
const camera = new Camera(0, 0);

let lastTime = 0;

function update(dt) {
    player.update(dt, input, platforms,camera);
    camera.update(player.x, player.y, canvas.width, canvas.height);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWorld(ctx, camera);
    player.draw(ctx, camera);

    // UI
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Controls: A, D, Space, ShiftLeft for Dash", 20, 30);
    ctx.fillText("State: " + player.state, 20, 60);
}

function gameLoop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}

// Bắt đầu game
requestAnimationFrame(gameLoop);