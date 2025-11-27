import { useState, useEffect, useRef } from "react";
import axios from "axios";

const AiHelpScreen = () => {
    const [userQuery, setUserQuery] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const chatEndRef = useRef(null);

    const scrollToBottom = () =>
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(scrollToBottom, [chat]);

    // Fetch your products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/products");
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    const askAI = async () => {
        if (!userQuery.trim()) return;

        setChat((prev) => [...prev, { sender: "user", text: userQuery }]);
        const queryToSend = userQuery;
        setUserQuery("");
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/ai-helper",  // 👈 FIXED HERE
                {
                    query: queryToSend,
                    inventory: products.map((p) => ({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: p.imageUrls?.[0],
                        stock: p.stock,
                    })),
                }
            );

            setChat((prev) => [
                ...prev,
                { sender: "ai", text: res.data.answer },
            ]);
        } catch (err) {
            setChat((prev) => [
                ...prev,
                { sender: "ai", text: "⚠️ Error contacting AI. Please try again." },
            ]);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center w-full bg-gray-100">
            <header className="w-full bg-white shadow p-4 text-center">
                <h1 className="text-2xl font-bold">🍖 AI Halal Meat Assistant</h1>
            </header>

            <div className="flex-1 w-full max-w-3xl bg-white shadow-lg border rounded-lg mt-4 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chat.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${
                                msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`px-4 py-3 rounded-xl max-w-[75%] text-white ${
                                    msg.sender === "user"
                                        ? "bg-red-600"
                                        : "bg-gray-800"
                                }`}
                                style={{ whiteSpace: "pre-line" }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 rounded-xl bg-gray-700 text-white">
                                AI is thinking…
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-gray-50 border-t flex items-center gap-3">
                    <textarea
                        className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-red-400 resize-none"
                        rows={2}
                        placeholder="Ask for a dish, recipe, or meat suggestion..."
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                    />

                    <button
                        onClick={askAI}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                    >
                        Send
                    </button>
                </div>
            </div>

            {chat.some(m => m.sender === "ai") && (
                <div className="w-full max-w-5xl mt-8 px-4">
                    <h2 className="text-2xl font-semibold mb-4">
                        🛒 Recommended Products From Our Store
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
                            >
                                <img
                                    src={p.imageUrls?.[0] || "/placeholder.jpg"}
                                    alt={p.title}
                                    className="w-full h-40 object-cover rounded-lg"
                                />

                                <h3 className="font-bold text-lg mt-3">{p.title}</h3>

                                <p className="text-gray-600 text-sm mt-1">
                                    {p.description || "Halal certified meat"}
                                </p>

                                <p className="mt-3 font-bold text-red-600 text-lg">
                                    €{p.price}
                                </p>

                                <button className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition">
                                    View Product
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default AiHelpScreen;
