import Razorpay from "razorpay";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { amount, plan, uid, email } = req.body;

    if (!amount || !plan || !uid) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // FIX: generate short 15-character receipt ID
    const receiptId = `rcp_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: amount * 100,         // Convert rupees → paise
      currency: "INR",
      receipt: receiptId,           // <= FIXED HERE
      notes: {
        plan,
        uid,
        email,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.log("Create order error:", error);
    return res.status(500).json({ error });
  }
}
