import Razorpay from "razorpay";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { amount, uid, email } = req.body;

    if (!amount || !uid)
      return res.status(400).json({ error: "Missing required fields" });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const receiptId = `don_${Date.now().toString().slice(-8)}`;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: receiptId,
      notes: { uid, email, type: "donation" },
    });

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
