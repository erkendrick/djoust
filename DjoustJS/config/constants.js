const RATE = 1000 / 64;
const GRAVITY = 0.5;
const canvas = {
    width: 1280,
    height: 720
};

const platforms = [
    { x: -50, y: 0, width: canvas.width + 100, height: 5 }, //TOP
    { x: -50, y: canvas.height - 5, width: (canvas.width / 3) + 50, height: 5 }, //BOTTOM LEFT
    { x: canvas.width * 2 / 3, y: canvas.height - 5, width: (canvas.width / 3) + 50, height: 5 }, //BOTTOM RIGHT
    { x: -50, y: canvas.height / 2, width: canvas.width / 3 + 50, height: 25 }, //MIDDLE LEFT
    { x: canvas.width * 2 / 3, y: canvas.height / 2, width: (canvas.width / 3) + 50, height: 25 } //MIDDLE RIGHT
];

export {
    RATE,
    GRAVITY,
    canvas,
    platforms
}