import { R } from './constants.js';

export function resolveCollision(player, platforms, dt) {
    player.isGrounded = false;
    player.y += player.velocityY * dt;

    const playerBox = {
        left: player.x - R,
        right: player.x + R,
        top: player.y - R,
        bottom: player.y + R
    };

    for (const box of platforms) {
        const boxHit = {
            left: box.x,
            right: box.x + box.w,
            top: box.y,
            bottom: box.y + box.h
        };

        if (
            playerBox.right > boxHit.left &&
            playerBox.left < boxHit.right &&
            playerBox.bottom > boxHit.top &&
            playerBox.top < boxHit.bottom
        ) {
            // Logic va chạm
            const prevY = player.y - player.velocityY * dt;
            const prevX = player.x; // Trong khung hình này logic tách X và Y nên X coi như giữ nguyên ở bước Y collision

            // 1. Rơi từ trên xuống
            if (prevY + R <= boxHit.top) {
                player.y = boxHit.top - R;
                player.velocityY = 0;
                player.isGrounded = true;
            }
            // 2. Đụng đầu
            else if (prevY - R >= boxHit.bottom) {
                player.y = boxHit.bottom + R;
                player.velocityY = 0;
            }
            // (Va chạm ngang được xử lý riêng nếu cần, hoặc tích hợp ở đây nếu code cũ của bạn chạy ổn)
        }
    }
}

// Hàm kiểm tra va chạm ngang riêng biệt (được gọi sau khi player di chuyển X)
export function resolveHorizontalCollision(player, platforms) {
    const playerBox = {
        left: player.x - R,
        right: player.x + R,
        top: player.y - R,
        bottom: player.y + R
    };

    for (const box of platforms) {
        const boxHit = {
            left: box.x,
            right: box.x + box.w,
            top: box.y,
            bottom: box.y + box.h
        };

        if (
            playerBox.right > boxHit.left &&
            playerBox.left < boxHit.right &&
            playerBox.bottom > boxHit.top &&
            playerBox.top < boxHit.bottom
        ) {
             // Logic đẩy ra khi va chạm ngang
             // Ta cần biết player đến từ bên trái hay phải
             // Đơn giản hóa: Nếu tâm player bên trái tâm box -> đẩy trái
             if (player.x < box.x + box.w / 2) {
                 player.x = boxHit.left - R;
                 player.velocityX = 0;
             } else {
                 player.x = boxHit.right + R;
                 player.velocityX = 0;
             }
        }
    }
}