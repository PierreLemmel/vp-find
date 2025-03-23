import { type ServerWebSocket, type WebSocketHandler, type WebSocketServeOptions } from "bun";
import { handleMessage, type ClientCommand } from "./logic";


const sockets: Set<ServerWebSocket> = new Set();
const websocket: WebSocketHandler = {
    message(ws, raw) {

        const cmd: ClientCommand = JSON.parse(raw as string);
        handleMessage(cmd, (event) => {
            const payload = JSON.stringify(event)
            sockets.forEach(socket => socket.send(payload));
        });
    },
    open(ws) {
        console.log("WebSocket connection opened");
        sockets.add(ws);
    },
    close(ws) {
        console.log("WebSocket connection closed");
        sockets.delete(ws);
    },
};

const serverOptions: WebSocketServeOptions = {
    port: 3000,
    fetch: (req, server) => {
        const url = new URL(req.url);

        if (url.pathname === "/") {

            const file = Bun.file("./public/index.html");

            return new Response(file, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        if (url.pathname === "/ws") {

            if (server.upgrade(req)) {
                return;
            }
            return new Response("Upgrade failed", { status: 500 });

        }
        if (url.pathname === "/style.css") {
            return new Response(Bun.file("./public/style.css"));
        }
        if (url.pathname === "/client.js") {
            return new Response(Bun.file("./public/client.js"));
        }
        return new Response("Not found", { status: 404 });
    },
    websocket,
};

console.log("WebSocket server starting on port 3000");

Bun.serve(serverOptions);