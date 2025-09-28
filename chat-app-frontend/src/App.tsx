import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import './App.css'
import { Logo } from "./assets/Logo";

type Message =
  | { type: "system"; text: string }
  | { type: "error"; text: string }
  | { type: "message"; user: string; text: string };

const App: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectToServer = () => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", room, username }));
      setConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);

        if (data.type === "error") {
          toast.error(data.text);
        } else {
          setMessages((prev) => [...prev, data]);
        }
      } catch {
        toast.error("Invalid response from server.");
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setSocket(null);
    };
  };

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(JSON.stringify({ type: "message", text: input }));
      setInput("");
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "leave" }));
      socket.close();
    }
    setConnected(false);
    setMessages([]);
    setRoom(""); // reset room input
    // keep username if you want auto-fill, else reset it too
    toast.success("You left the room");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <Toaster position="top-right" />
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg">
        {!connected ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Logo /> Join Chat Room 
            </h1>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 outline-none"
            />
            <input
              type="text"
              placeholder="Enter room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 outline-none"
            />
            <button
              onClick={connectToServer}
              disabled={!username.trim() || !room.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-50"
            >
              Join Room
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Room: <span className="text-blue-400">{room}</span>
              </h2>
              <button
                onClick={leaveRoom}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Leave
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-700 rounded-lg">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.type === "system" && (
                    <p className="text-sm text-gray-300 italic">{msg.text}</p>
                  )}
                  {msg.type === "message" && (
                    <p>
                      <span className="font-bold text-blue-400">{msg.user}: </span>
                      {msg.text}
                    </p>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 p-2 rounded-l bg-gray-600 outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 hover:bg-green-700 p-2 rounded-r"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
