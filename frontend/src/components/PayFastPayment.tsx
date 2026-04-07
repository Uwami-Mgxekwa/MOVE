import React, { useRef } from 'react';

interface PayFastPaymentProps {
  paymentUrl: string;
  params: Record<string, string>;
}

// PayFast works by submitting a form POST to their payment page
const PayFastPayment: React.FC<PayFastPaymentProps> = ({ paymentUrl, params }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handlePay = () => {
    formRef.current?.submit();
  };

  return (
    <div>
      <form ref={formRef} action={paymentUrl} method="POST" style={{ display: 'none' }}>
        {Object.entries(params).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
      </form>
      <button onClick={handlePay} className="btn btn-primary" style={{ height: '56px', borderRadius: '14px' }}>
        Pay with PayFast
      </button>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
        Secured by PayFast — Card, EFT, SnapScan & more
      </div>
    </div>
  );
};

export default PayFastPayment;
