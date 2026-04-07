import React, { useState } from 'react';
import { MapPin, Navigation, Shield, Car, Bus, Star, Tag, CheckCircle } from 'lucide-react';
import { apiCreateTrip, apiGeneratePayFastPayment, apiValidatePromo } from '../api';
import PayFastPayment from './PayFastPayment';

const SERVICES = [
  { name: 'MOVE Go', icon: <Car size={22} />, price: 85, label: 'R85', desc: 'Affordable, everyday rides', seats: 4 },
  { name: 'MOVE XL', icon: <Bus size={22} />, price: 145, label: 'R145', desc: 'Larger vehicles for groups', seats: 6 },
  { name: 'MOVE Black', icon: <Star size={22} />, price: 210, label: 'R210', desc: 'Premium luxury experience', seats: 4 },
];

interface BookingFormProps {
  onConfirm: (tripId: number) => void;
  pickup?: string;
  destination?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ onConfirm, pickup = '', destination = '' }) => {
  const [selectedService, setSelectedService] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'cash'>('payfast');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payFastData, setPayFastData] = useState<{ paymentUrl: string; params: Record<string, string> } | null>(null);

  const getFinalPrice = () => {
    const base = SERVICES[selectedService].price;
    return promoDiscount > 0 ? Math.round(base * (1 - promoDiscount / 100)) : base;
  };

  const applyPromo = async () => {
    setPromoError('');
    const result = await apiValidatePromo(promoCode).catch(() => ({ valid: false }));
    if (result.valid) {
      setPromoDiscount(result.discountPercent);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid or expired promo code');
      setPromoDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const riderId = Number(localStorage.getItem('userId'));
      const trip = await apiCreateTrip({ originCity: pickup, destinationCity: destination, riderId });
      if (!trip.id) { setError('Failed to book ride. Please try again.'); setLoading(false); return; }

      if (paymentMethod === 'payfast') {
        const pf = await apiGeneratePayFastPayment(getFinalPrice(), `MOVE Ride - ${SERVICES[selectedService].name}`);
        if (pf.paymentUrl) { setPayFastData(pf); onConfirm(trip.id); return; }
        setError('Payment setup failed. Please try again.');
      } else {
        onConfirm(trip.id);
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '24px 0 80px' }}>

      {/* Route summary — read only */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
          <MapPin size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{pickup || 'Pickup location'}</span>
        </div>
        <div style={{ height: '1px', backgroundColor: '#eee', marginLeft: '28px' }} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
          <Navigation size={16} color="#000" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{destination || 'Destination'}</span>
        </div>
      </div>

      <form onSubmit={handleBooking}>

        {/* Service type */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em', display: 'block', marginBottom: '12px' }}>CHOOSE SERVICE</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SERVICES.map((service, index) => (
              <div key={service.name} onClick={() => setSelectedService(index)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', border: selectedService === index ? '2px solid var(--accent)' : '2px solid transparent', backgroundColor: selectedService === index ? 'var(--accent-transparent)' : '#f9f9f9', borderRadius: '14px', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: selectedService === index ? 'var(--accent)' : '#ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedService === index ? '#fff' : 'var(--text-secondary)', flexShrink: 0 }}>
                  {service.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{service.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{service.desc} • up to {service.seats} seats</div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900 }}>{service.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em', display: 'block', marginBottom: '12px' }}>PAYMENT METHOD</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'payfast' as const, label: 'PayFast', sub: 'Card, EFT, SnapScan & more', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
              { id: 'cash' as const, label: 'Cash', sub: 'Pay your driver directly', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg> },
            ].map((m) => (
              <div key={m.id} onClick={() => setPaymentMethod(m.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', border: paymentMethod === m.id ? '2px solid var(--accent)' : '2px solid transparent', backgroundColor: paymentMethod === m.id ? 'var(--accent-transparent)' : '#f9f9f9', borderRadius: '14px', cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: paymentMethod === m.id ? 'var(--accent)' : '#ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paymentMethod === m.id ? '#fff' : 'var(--text-secondary)', flexShrink: 0 }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>{m.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.sub}</div>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === m.id ? '2px solid var(--accent)' : '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {paymentMethod === m.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo + coming soon */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          {/* Share ride — coming soon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', opacity: 0.45 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px' }}>Share this ride</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Split the fare with other riders</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#f0f0f0', color: '#888', padding: '4px 10px', borderRadius: '20px' }}>COMING SOON</span>
          </div>

          {/* Promo code */}
          <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em', display: 'block', marginBottom: '10px' }}>PROMO CODE</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Tag size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoApplied(false); setPromoDiscount(0); }}
                placeholder="Enter code" disabled={promoApplied}
                style={{ width: '100%', padding: '11px 12px 11px 36px', border: `1px solid ${promoApplied ? '#34a853' : '#e2e2e2'}`, borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', backgroundColor: promoApplied ? '#f0faf4' : '#fff' }} />
            </div>
            <button type="button" onClick={applyPromo} disabled={!promoCode.trim() || promoApplied}
              style={{ padding: '0 18px', backgroundColor: promoApplied ? '#34a853' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', flexShrink: 0, opacity: (!promoCode.trim() || promoApplied) ? 0.6 : 1 }}>
              {promoApplied ? <CheckCircle size={18} /> : 'Apply'}
            </button>
          </div>
          {promoError && <div style={{ fontSize: '12px', color: 'var(--error)', marginTop: '6px' }}>{promoError}</div>}
          {promoApplied && <div style={{ fontSize: '12px', color: '#34a853', marginTop: '6px', fontWeight: 600 }}>✓ {promoDiscount}% discount applied!</div>}
        </div>

        {/* Safety */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '12px 16px', backgroundColor: '#e6f4ea', borderRadius: '12px', color: '#1e7e34' }}>
          <Shield size={16} />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Your trip is protected with MOVE Safety.</span>
        </div>

        {error && <div style={{ fontSize: '13px', color: 'var(--error)', textAlign: 'center', fontWeight: 600, marginBottom: '12px' }}>{error}</div>}

        {payFastData ? (
          <PayFastPayment paymentUrl={payFastData.paymentUrl} params={payFastData.params} />
        ) : (
          <button type="submit" className="btn btn-primary" style={{ height: '60px', borderRadius: '16px', fontSize: '16px' }} disabled={loading}>
            {loading ? 'Booking…' : `Request MOVE — R${getFinalPrice()}${promoApplied ? ` (was R${SERVICES[selectedService].price})` : ''}`}
          </button>
        )}
      </form>
    </div>
  );
};

export default BookingForm;
