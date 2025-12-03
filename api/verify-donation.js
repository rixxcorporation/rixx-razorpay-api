import crypto from "crypto";

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expected === razorpay_signature) {
    return res.status(200).json({ status: "success" });
  }

  return res.status(400).json({ status: "failure" });
}
