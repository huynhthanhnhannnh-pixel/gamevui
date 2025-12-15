import * as C from './constants.js';
import { resolveCollision, resolveHorizontalCollision } from './utils.js';
import { PlayerMovement } from './PlayerMovement.js';
import { PlayerState } from './PlayerState.js';

export class Player {
    constructor() {
        // Dữ liệu thô (Data)
        this.x = 100;
        this.y = 300;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
        this.isDashing = false;

        // Các bộ phận (Components)
        this.movement = new PlayerMovement();
        this.stateMachine = new PlayerState();
    }

    update(dt, input, platforms,camera) {
        // 1. Tính toán ý định di chuyển (Vận tốc, Dash, Jump)
        this.movement.update(dt, this, input);

        // 2. Áp dụng di chuyển ngang & va chạm ngang
        this.x += this.velocityX * dt;
        resolveHorizontalCollision(this, platforms);
        this.checkWorldLoop(camera);

        // 3. Áp dụng trọng lực & va chạm dọc
        this.applyGravity(dt);
        resolveCollision(this, platforms, dt);

        // 4. Cập nhật trạng thái cuối cùng (Idle/Run/Jump...)
        this.stateMachine.update(this);
    }

    applyGravity(dt) {
        // Nếu đang Dash thì không chịu trọng lực
        if (!this.isDashing) {
            this.velocityY += C.GRAVITY * dt;
        }
    }

    checkWorldLoop(camera) {
        if (this.x < C.WORLD_START){
            this.x += C.WORLD_WIDTH;
            camera.x += C.WORLD_WIDTH;  
        } 
        

        else if (this.x > C.WORLD_END) {
            this.x -= C.WORLD_WIDTH;
            camera.x -= C.WORLD_WIDTH;
        }
    }

    draw(ctx, camera) {
        // Lấy trạng thái hiện tại để vẽ (sau này dùng cho animation)
        const state = this.stateMachine.get();
        
        ctx.beginPath();
        ctx.arc(this.x - camera.x, this.y - camera.y, C.R, 0, Math.PI * 2);
        
        // Đổi màu dựa theo State để test
        if (state === 'dash') ctx.fillStyle = "yellow";
        else if (state === 'run') ctx.fillStyle = "blue";
        else if (state === 'jump') ctx.fillStyle = "orange";
        else ctx.fillStyle = "red";

        ctx.fill();
        ctx.stroke();
    }
    
    // Getter để bên main.js lấy state in ra màn hình
    get state() {
        return this.stateMachine.get();
    }

    reset() {
        this.x = 100;
        this.y = 300;
        this.velocityX = 0;
        this.velocityY = 0;
    }
}