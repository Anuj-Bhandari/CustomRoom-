import { Routes, Route } from "react-router";
import JoinRoom from "./pages/JoinRoom";
import ChatRoom from "./pages/ChatRoom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<JoinRoom />} />
      <Route path="/chat/:roomId" element={<ChatRoom />} />
    </Routes>
  );
}