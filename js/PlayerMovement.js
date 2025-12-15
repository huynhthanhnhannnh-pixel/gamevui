import * as C from './constants.js';

export class PlayerMovement {
    constructor() {
        // Timers cho việc di chuyển
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.canDash = true;
        this.dashDirection = 0;
        
        this.jumpBufferTimer = 0;
        this.coyoteTimer = 0;
    }

    update(dt, player, input) {
        this.handleTimers(dt, player);
        this.handleInput(dt, player, input);
        this.applyForces(dt, player, input);
    }

    handleTimers(dt, player) {
        // Coyote Time (Thời gian nhân nhượng khi rời mép đất)
        if (player.isGrounded) this.coyoteTimer = C.COYOTE_TIME;
        else this.coyoteTimer -= dt;

        // Jump Buffer (Bộ nhớ đệm phím nhảy)
        if (this.jumpBufferTimer > 0) this.jumpBufferTimer -= dt;

        // Dash Cooldown
        if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= dt;
        
        // Reset khả năng Dash
        if (this.dashCooldownTimer <= 0 || player.isGrounded) {
            this.canDash = true;
        }
    }

    handleInput(dt, player, input) {
        // 1. Nạp Jump Buffer
        if (input.isDown("Space")) {
            this.jumpBufferTimer = C.JUMP_BUFFER;
        }

        // 2. Kích hoạt Dash
        if (input.isDown("ShiftLeft") && !player.isDashing && this.dashCooldownTimer <= 0 && this.canDash) {
            let dir = 0;
            if (input.isDown("KeyA")) dir = -1;
            else if (input.isDown("KeyD")) dir = 1;

            if (dir !== 0) {
                this.startDash(player, dir);
            }
        }
    }

    startDash(player, dir) {
        player.isDashing = true;
        this.dashTimer = C.DASH_DURATION;
        this.dashDirection = dir;
        this.canDash = false;
        player.velocityY = 0; // Tạm dừng trọng lực
    }

    applyForces(dt, player, input) {
        // --- XỬ LÝ DASH ---
        if (player.isDashing) {
            this.dashTimer -= dt;
            if (this.dashTimer <= 0) {
                player.isDashing = false;
                this.dashCooldownTimer = C.DASH_COOLDOWN;
            }
            player.velocityX = this.dashDirection * C.DASH_SPEED;
            return; // Nếu đang Dash thì bỏ qua logic di chuyển thường
        }

        // --- XỬ LÝ DI CHUYỂN THƯỜNG ---
        let dir = 0;
        if (input.isDown("KeyA")) dir -= 1;
        if (input.isDown("KeyD")) dir += 1;

        const accel = player.isGrounded ? C.ACCEL_GROUND : C.ACCEL_AIR;

        if (dir !== 0) {
            player.velocityX += dir * accel * dt;
        } else {
            // Ma sát
            if (player.velocityX > 0) {
                player.velocityX = Math.max(0, player.velocityX - C.FRICTION * dt);
            } else if (player.velocityX < 0) {
                player.velocityX = Math.min(0, player.velocityX + C.FRICTION * dt);
            }
        }
        
        // Kẹp tốc độ tối đa
        player.velocityX = Math.max(-C.MAX_SPEED, Math.min(C.MAX_SPEED, player.velocityX));

        // --- XỬ LÝ NHẢY (JUMP) ---
        if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
            player.velocityY = -C.JUMP_FORCE;
            player.isGrounded = false;
            this.coyoteTimer = 0;
            this.jumpBufferTimer = 0;
        }
    }
}