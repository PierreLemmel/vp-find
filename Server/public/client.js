function getWebSocketURL() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
}
  
const ws = new WebSocket(getWebSocketURL());


ws.addEventListener("open", () => {
    console.log("Connected to WebSocket server");
});

ws.addEventListener("message", (event) => {
    const { type, data } = JSON.parse(event.data);
    dispatchMessage(type, data);
});

ws.addEventListener("close", () => {
    console.log("Disconnected from WebSocket server");
});

function sendMessage(type, data) {
    ws.send(JSON.stringify({ type, data }));
}

function dispatchMessage(type, data) {
}

const startButton = document.getElementById("startButton");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let started = false;


startButton.addEventListener("click", () => {

    sendMessage("GameStarted");
    startButton.remove();
    started = true;

    canvas.style.display = "block";
});


function resetCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resetCanvas();

function draw(relX, relY) {

    const radius = 25;

    const x = relX * canvas.width;
    const y = relY * canvas.height;

    resetCanvas();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

canvas.style.display = "none";

let isMouseDown = false;

canvas.addEventListener("mousedown", (event) => {
    isMouseDown = true;
});

canvas.addEventListener("mousemove", (event) => {
    if (!started || !isMouseDown) return;

    const relX = clamp01(event.offsetX / canvas.clientWidth);
    const relY = clamp01(event.offsetY / canvas.clientHeight);

    sendMessage("UpdatePosition", { x: relX, y: 1 - relY });
    draw(relX, relY);
});

canvas.addEventListener("mouseup", (event) => {
    isMouseDown = false;
})

canvas.addEventListener("touchmove", (event) => {
    if (!started) return;

    const relX = clamp01((event.touches[0].clientX - canvas.offsetLeft) / canvas.clientWidth);
    const relY = clamp01((event.touches[0].clientY - canvas.offsetTop) / canvas.clientHeight);

    sendMessage("UpdatePosition", { x: relX, y: 1 - relY });
    draw(relX, relY);
});

function clamp01(value) {
    return Math.min(Math.max(value, 0), 1);
}

