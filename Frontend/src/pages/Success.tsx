import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../api/paymentApi";

interface PaymentStatus {
    status: string;
    amount: number;
    currency: string;
}
const Success = () => {
    const [searchParams] =
        useSearchParams();

    const sessionId =
        searchParams.get("session_id");

    const [payment, setPayment] =
        useState<PaymentStatus | null>(
            null,
        );

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            if (!sessionId) return;

            try {
                const response =
                    await getPaymentStatus(
                        sessionId,
                    );

                setPayment(response.data);
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">
                    ✅
                </div>

                <h1 className="text-3xl font-bold mb-4">
                    Payment Successful
                </h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <p className="mb-2">
                            Status:
                            {" "}
                            {payment?.status}
                        </p>

                        <p className="mb-2">
                            Amount:
                            {" "}
                            {payment?.amount}
                        </p>

                        <p>
                            Currency:
                            {" "}
                            {payment?.currency}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
export default Success;