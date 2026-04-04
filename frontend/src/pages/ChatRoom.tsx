import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", payload: { roomId } }));
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => ws.close();
  }, [roomId]);

  const sendMessage = () => {
    if (!wsRef.current || input.trim() === "") return;
    wsRef.current.send(JSON.stringify({ type: "chat", payload: { message: input } }));
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-10 px-4">
      
      {/* Header */}
      <div className="w-full max-w-2xl mb-4">
        <h2 className="text-white text-lg font-semibold">
          Room: <span className="text-blue-400">{roomId}</span>
        </h2>
      </div>

      {/* Messages */}
      <div className="w-full max-w-2xl flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-4 h-[500px] overflow-y-auto space-y-2 mb-4">
        {messages.length === 0 ? (
          <p className="text-slate-500 text-sm text-center mt-4">No messages yet. Say something!</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="bg-slate-700 text-slate-100 text-sm px-4 py-2 rounded-xl w-fit max-w-[80%]">
              {m}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl text-sm transition-all active:scale-95"
        >
          Send
        </button>
      </div>

    </div>
  );
}