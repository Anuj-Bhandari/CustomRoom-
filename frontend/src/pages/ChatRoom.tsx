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
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId }
      }));
    };

    ws.onmessage = (event) => {
      // The backend sends raw message strings in 'chat' type
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!wsRef.current || input.trim() === "") return;

    // Matches your backend 'chat' logic
    wsRef.current.send(JSON.stringify({
      type: "chat",
      payload: { message: input }
    }));

    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Room: {roomId}</h2>
      <div style={{ height: "300px", border: "1px solid #ccc", overflowY: "scroll", marginBottom: "1rem" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ padding: "5px" }}>{m}</div>
        ))}
      </div>
      
      <input 
        ref={inputRef}
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}