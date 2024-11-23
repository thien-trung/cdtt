import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Api } from "../api/Api";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentProcessing(true);
    
    const cardElement = elements.getElement(CardElement);

    try {
      // Yêu cầu backend tạo Payment Inte

      // Tiến hành thanh toán với Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setPaymentComplete(true);
        alert("Thanh toán thành công!");
        // Xử lý logic thanh toán thành công, như lưu hóa đơn vào database
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi trong quá trình thanh toán.");
    }

    setPaymentProcessing(false);
  };

  return (
    <div>
      {paymentComplete ? (
        <div className="payment-success">Thanh toán đã hoàn tất!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardElement />
          {error && <div className="payment-error">{error}</div>}
          <button type="submit" disabled={!stripe || paymentProcessing}>
            {paymentProcessing ? "Đang xử lý..." : `Thanh toán $${total}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
  