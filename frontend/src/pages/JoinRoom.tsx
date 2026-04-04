import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/chat/${roomId}`);
    }
  };

  return (
    <div >
      <input 
        placeholder="Enter Room ID" 
        value={roomId} 
        onChange={(e) => setRoomId(e.target.value)} 
      />
      <div> 
           <button onClick={handleJoin}>Join Room</button>
      </div>
   
    </div>
  );
}


