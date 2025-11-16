import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:5000/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, age, message }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("Email sent successfully!");
        setName("");
        setEmail("");
        setAge("");
        setMessage("");
      } else {
        setStatus("Failed to send email.");
      }
    } catch (err) {
      console.log(err);
      setStatus("Error sending email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          User Message Form
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="border px-3 py-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
        {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
      </div>
    </div>
  );
}

export default App;
