import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface StripePaymentProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });
    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed');
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PaymentElement />
      {error && <div style={{ fontSize: '13px', color: '#ea4335', fontWeight: 600 }}>{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={!stripe || loading}>
        {loading ? 'Processing…' : 'Pay Now'}
      </button>
      <button type="button" className="btn" onClick={onCancel}
        style={{ backgroundColor: '#f5f5f5', color: '#111', border: 'none' }}>
        Cancel
      </button>
    </form>
  );
};

const StripePayment: React.FC<StripePaymentProps> = ({ clientSecret, onSuccess, onCancel }) => (
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
  </Elements>
);

export default StripePayment;
