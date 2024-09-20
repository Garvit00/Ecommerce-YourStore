import crypto from 'crypto';
import asyncHandler from "../middleware/asyncHandler.js";


// @desc Verify Razorpay Payment Signature
// @route POST /api/payment/verify
// @access Private

// Payment verification controller
export const verifyPayment = asyncHandler(async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  // Create HMAC SHA256 digest
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${order_id}|${payment_id}`);
  const digest = shasum.digest('hex');

  // Verify the signature
  if (digest === signature) {
    res.status(200).json({ status: 'success', message: 'Payment verified' });
  } else {
    res.status(400).json({ status: 'failed', message: 'Invalid signature' });
  }
});

