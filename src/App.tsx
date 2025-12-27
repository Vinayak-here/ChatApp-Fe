import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState(["hi"]);
  const wsRef = useRef<WebSocket>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "room1",
          },
        })
      );
    }
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-950">
      <div className="h-full max-h-[calc(100vh-3rem)] flex flex-col w-2xl bg-black text-white border-2 border-white rounded-2xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="max-w-md bg-gray-800 px-4 py-2 rounded-lg"
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="p-4 flex justify-center">
          <div className="w-full max-w-xl flex gap-2">
            <input
              type="text"
              id="message"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={() => {
                const message = (document.getElementById("message") as HTMLInputElement)?.value;
                wsRef.current?.send(
                  JSON.stringify({
                    type: "chat",
                    payload: {
                      message: message,
                    },
                  })
                );
              }}
              className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
