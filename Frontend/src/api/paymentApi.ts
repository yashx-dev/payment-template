import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createCheckoutSession = async (email: string, name: string) => {
  const response = await axios.post(`${API_URL}/create-checkout-session`, {
    email,
    name,
  });
  return response.data;
};

export const getPaymentStatus = async (sessionId: string) => {
  const response = await axios.get(
    `${API_URL}/payment-status/${sessionId}`,
  );
  return response.data;
};
