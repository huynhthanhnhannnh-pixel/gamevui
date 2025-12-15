export class InputHandler {
    constructor() {
        this.keys = {};
        
        window.addEventListener("keydown", e => {
            // Chặn cuộn trang khi bấm Space hoặc phím mũi tên
            if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.code] = false;
        });
    }

    isDown(code) {
        return this.keys[code] === true;
    }
}