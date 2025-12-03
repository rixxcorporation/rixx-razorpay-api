// api/create-order.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, plan, uid, email } = req.body || {};

    if (!amount || !plan) {
      return res.status(400).json({ error: "Missing amount or plan" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // amount from app is in rupees → convert to paise
    const orderOptions = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${plan}_${uid || "nouid"}`,
      payment_capture: 1,
      notes: {
        plan,
        uid: uid || "",
        email: email || ""
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    return res.status(200).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
}
