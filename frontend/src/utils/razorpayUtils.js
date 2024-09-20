// src/utils/razorpayUtils.js

export const createRazorpayOrder = async (orderTotal) => {
    const response = await fetch('/api/payment/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: orderTotal }),
    });
    console.log(response.status);
    if (!response.ok) {
        console.error('Response Error:', await response.text());
        throw new Error('Failed to create Razorpay order');
    }

    const data = await response.json();
    return data;
};
