const Cancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">
                    ❌
                </div>

                <h1 className="text-3xl font-bold mb-4">
                    Payment Cancelled
                </h1>

                <p className="text-gray-600">
                    Your payment was not completed.
                </p>
            </div>
        </div>
    );
}
export default Cancel;