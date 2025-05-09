"use client";
import { useState, useRef, useEffect } from "react";
import ViewportHeightSetter from "./ViewportHeightSetter";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const [pendingClear, setPendingClear] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answer, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (pendingClear) {
      setLastQuestion("");
      setAnswer("");
      setPendingClear(false);
    }
    setLastQuestion(question);
    setQuestion("");
    setLoading(true);
    setPendingClear(true);
    try {
      const res = await fetch("/api/insult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "Idiot, Ari. Something went wrong.");
    } catch {
      setAnswer("Idiot, Ari. Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  return (
    <>
      <ViewportHeightSetter />
      <div className="flex flex-col min-h-[100dvh] min-h-screen w-full bg-cover bg-center relative" style={{ backgroundImage: "url('/chatgpt-bg.svg')" }}>
        <div className="bg-dark-overlay" />
        <div className="flex-1 w-full flex flex-col items-center px-2 pt-8 pb-4 max-w-md mx-auto z-10 overflow-y-auto">
          {lastQuestion && (
            <div className="w-full flex justify-end mb-2">
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] text-base shadow-md">
                {lastQuestion}
              </div>
            </div>
          )}
          {loading && (
            <div className="w-full flex justify-start mb-2">
              <div className="bg-white/90 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%] text-base shadow-md flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
                <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          {answer && (
            <div className="w-full flex justify-start mb-2">
              <div className="bg-white/90 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%] text-base shadow-md">
                {answer}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="w-full flex justify-center items-center px-2 py-4 bg-white/90 backdrop-blur shadow-lg border-t border-gray-200 z-20">
          <div className="w-full max-w-md flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
              placeholder="Ask your question..."
              value={question}
              onChange={handleInputChange}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-700 text-white rounded-full px-6 py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-60 text-lg"
              disabled={!question.trim() || loading}
            >
              {loading ? <span className="opacity-60">Send</span> : "Send"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
