// api/verify-payment.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      uid,
      plan,
    } = req.body || {};

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ status: "failed", error: "Missing fields" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const data = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(data)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({
        status: "success",
        uid: uid || null,
        plan: plan || null,
      });
    } else {
      return res.status(200).json({
        status: "failed",
        error: "Signature mismatch",
      });
    }
  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ status: "failed", error: "Server error" });
  }
}
