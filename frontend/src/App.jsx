import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callHelloApi = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/hello`);
      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.text();
      setMessage(data);
    } catch {
      setMessage("");
      setError("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <button onClick={callHelloApi} disabled={loading}>
        {loading ? "Loading..." : "Hello"}
      </button>
      <p>{error || message}</p>
    </main>
  );
}
