import { KILL_FLOOR } from './constants.js';

export class PlayerState {
    constructor() {
        this.currentState = "idle";
    }

    update(player) {
        // 1. Kiểm tra chết (Reset game)
        if (player.y > KILL_FLOOR) {
            player.reset();
        }

        // 2. Máy trạng thái (State Machine)
        // Ưu tiên cao nhất: DASH
        if (player.isDashing) {
            this.currentState = "dash";
            return; // Thoát luôn, không xét các state khác
        }

        // Ưu tiên nhì: TRÊN KHÔNG
        if (!player.isGrounded) {
            if (player.velocityY < 0) {
                this.currentState = "jump";
            } else {
                this.currentState = "fall";
            }
            return;
        }

        // Ưu tiên ba: MẶT ĐẤT
        if (Math.abs(player.velocityX) > 10) { // Lớn hơn 10 mới coi là chạy
            this.currentState = "run";
        } else {
            this.currentState = "idle";
        }
    }

    // Sau này bạn sẽ thêm hàm renderAnimation(ctx, player) vào đây
    get() {
        return this.currentState;
    }
}