import { useState } from "react";
import { createCheckoutSession } from "../api/paymentApi";

const Home = () => {
    const [name, setName] = useState("");
    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data =
                await createCheckoutSession(
                    email,
                    name,
                );

            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            alert("Failed to create checkout session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Stripe Payment Template
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Secure checkout using Stripe
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full rounded-lg border p-3 outline-none focus:ring-2"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full rounded-lg border p-3 outline-none focus:ring-2"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black text-white py-3 font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {loading
                            ? "Redirecting..."
                            : "Pay Now"}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Home;