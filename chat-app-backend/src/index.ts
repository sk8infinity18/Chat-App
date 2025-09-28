import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Room storage: room name → set of clients
const rooms: Map<string, Set<WebSocket>> = new Map();

function broadcastToRoom(room: string, data: any, sender?: WebSocket) {
  const clients = rooms.get(room);
  if (!clients) return;

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function sendToClient(socket: WebSocket, data: any) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

wss.on("connection", (socket: WebSocket) => {
  let currentRoom: string | null = null;
  let username: string | null = null;

  console.log("✅ New client connected");

  socket.on("message", (message: string | Buffer) => {
    try {
      const data = JSON.parse(message.toString());

      // Join room
      if (data.type === "join") {
        if (typeof data.room !== "string" || typeof data.username !== "string") {
          sendToClient(socket, { type: "error", text: "Room and username are required." });
          return;
        }

        currentRoom = data.room.trim();
        username = data.username.trim();

        if (!currentRoom || !username) {
          sendToClient(socket, { type: "error", text: "Room and username cannot be empty." });
          return;
        }

        if (!rooms.has(currentRoom)) {
          rooms.set(currentRoom, new Set());
        }
        rooms.get(currentRoom)!.add(socket);

        console.log(`👤 ${username} joined room: ${currentRoom}`);

        broadcastToRoom(currentRoom, {
          type: "system",
          text: `${username} joined the room`,
        }, socket);
      }

      // Leave room
      else if (data.type === "leave") {
        if (currentRoom && rooms.has(currentRoom)) {
          rooms.get(currentRoom)!.delete(socket);
          console.log(`👋 ${username ?? "Unknown"} left room: ${currentRoom}`);

          broadcastToRoom(currentRoom, {
            type: "system",
            text: `${username ?? "A user"} left the room`,
          }, socket);

          currentRoom = null;
          username = null;
        } else {
          sendToClient(socket, { type: "error", text: "You are not in a room." });
        }
      }

      // Chat message
      else if (data.type === "message") {
        if (!currentRoom || !username) {
          sendToClient(socket, { type: "error", text: "You must join a room before chatting." });
          return;
        }

        if (typeof data.text !== "string" || !data.text.trim()) {
          sendToClient(socket, { type: "error", text: "Message cannot be empty." });
          return;
        }

        console.log(`📩 [${currentRoom}] ${username}: ${data.text}`);

        broadcastToRoom(currentRoom, {
          type: "message",
          user: username,
          text: data.text,
        }, socket);
      }

      // Unknown type
      else {
        sendToClient(socket, { type: "error", text: `Unknown type: ${data.type}` });
      }
    } catch (err) {
      sendToClient(socket, { type: "error", text: "Invalid JSON format." });
    }
  });

  socket.on("close", () => {
    if (currentRoom && rooms.has(currentRoom)) {
      rooms.get(currentRoom)!.delete(socket);
      console.log(`❌ ${username ?? "Unknown"} disconnected from ${currentRoom}`);

      broadcastToRoom(currentRoom, {
        type: "system",
        text: `${username ?? "A user"} left the room`,
      });
    }
  });
});

console.log("WebSocket server up and running...");
