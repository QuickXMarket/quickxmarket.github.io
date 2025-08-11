import axios from "axios";

export const getBalance = async () => {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const { data } = await axios.get("https://api.paystack.co/balance", {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });
    if (data.status) {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
};
