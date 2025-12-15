import { WORLD_START, WORLD_WIDTH, WORLD_END } from './constants.js';

// Màu sắc cho dễ nhận biết loại địa hình
const Colors = {
    GROUND: "#654321", // Đất nâu
    JUMP: "#2E8B57",   // Xanh lá (Nhảy thường)
    DASH: "#1E90FF",   // Xanh dương (Cần Dash)
    TRICK: "#FF4500",  // Cam đỏ (Khó/Bục nhỏ)
    WALL: "#808080"    // Xám (Tường chắn)
};

export const platforms = [
    // --- PHASE 1: KHỞI ĐỘNG (WARM UP) ---
    // Sàn xuất phát an toàn
    { x: WORLD_START, y: 500, w: 400, h: 100, color: Colors.GROUND },
    
    // Nhảy đơn giản qua hố nhỏ (Gap: 150px)
    { x: WORLD_START + 550, y: 500, w: 300, h: 100, color: Colors.GROUND },


    // --- PHASE 2: LEO TRÈO (VERTICALITY) ---
    // Cầu thang lên cao (Test Jump Height)
    { x: 500, y: 450, w: 100, h: 20, color: Colors.JUMP },
    { x: 700, y: 380, w: 100, h: 20, color: Colors.JUMP },
    { x: 900, y: 320, w: 100, h: 20, color: Colors.JUMP },


    // --- PHASE 3: THỬ THÁCH DASH (THE DASH GAP) ---
    // Một khoảng trống lớn (Gap: 350px)
    // Nếu chỉ nhảy thường sẽ rớt. Phải Nhảy + Dash (Shift) mới qua được.
    { x: 1350, y: 300, w: 400, h: 20, color: Colors.DASH },


    // --- PHASE 4: SÀN TỬ THẦN (PRECISION) ---
    // Các bục rất nhỏ, đòi hỏi thả phím di chuyển đúng lúc để hãm đà (Friction)
    { x: 1900, y: 350, w: 60, h: 20, color: Colors.TRICK },
    { x: 2100, y: 420, w: 60, h: 20, color: Colors.TRICK },


    // --- PHASE 5: ĐÍCH ĐẾN & LOOP ---
    // Tường chắn cao buộc phải nhảy qua để về đích
    { x: 2300, y: 400, w: 20, h: 200, color: Colors.WALL },
    
    // Sàn đích (Nối liền mạch với Sàn xuất phát khi World Loop)
    { x: 2400, y: 500, w: WORLD_END - 2400, h: 100, color: Colors.GROUND }
];

export function drawWorld(ctx, camera) {
    // Vẽ lặp lại 3 lần để tạo ảo giác world loop vô tận
    for (let i = -1; i <= 1; i++) {
        for (const box of platforms) {
            // Tối ưu: Chỉ vẽ những khối nằm trong màn hình
            const drawX = box.x + i * WORLD_WIDTH - camera.x;
            if (drawX > -box.w && drawX < ctx.canvas.width) {
                ctx.fillStyle = box.color;
                ctx.fillRect(
                    drawX,
                    box.y - camera.y,
                    box.w,
                    box.h
                );
            }
        }
    }
}