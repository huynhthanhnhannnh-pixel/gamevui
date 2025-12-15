export class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update(targetX, targetY, canvasWidth, canvasHeight) {
        // Lerp camera
        this.x += (targetX - this.x - canvasWidth / 2) * 0.1;
        this.y += (targetY - this.y - canvasHeight / 2) * 0.1;
    }
}