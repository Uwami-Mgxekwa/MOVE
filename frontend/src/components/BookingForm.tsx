import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, Clock, Users, Shield, Car, Bus, Star } from 'lucide-react';
import { apiCreateTrip } from '../api';

const SERVICES = [
  { name: 'MOVE Go', icon: <Car size={22} />, price: 85, label: 'R85', desc: 'Affordable, everyday rides' },
  { name: 'MOVE XL', icon: <Bus size={22} />, price: 145, label: 'R145', desc: 'Larger vehicles for groups' },
  { name: 'MOVE Black', icon: <Star size={22} />, price: 210, label: 'R210', desc: 'Premium luxury experience' },
];

interface BookingFormProps {
  onConfirm: (tripId: number) => void;
  pickup?: string;
  destination?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ onConfirm, pickup = '', destination = '' }) => {
  const [formData, setFormData] = useState({
    pickup: pickup || 'Cape Town International Airport',
    destination: destination || 'Waterfront, Cape Town',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    passengers: 1,
  });
  const [selectedService, setSelectedService] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const riderId = Number(localStorage.getItem('userId'));
      const trip = await apiCreateTrip({
        originCity: formData.pickup,
        destinationCity: formData.destination,
        riderId,
      });
      if (trip.id) {
        onConfirm(trip.id);
      } else {
        setError('Failed to book ride. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '32px 0 64px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Ride Selection</h2>
        
        <div style={{ padding: '16px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '14px', marginBottom: '32px' }}>
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <MapPin size={16} color="var(--accent)" />
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.pickup}</div>
           </div>
           <div style={{ height: '16px', width: '1px', borderLeft: '1px solid #ddd', marginLeft: '7px', margin: '4px 0 4px 7px' }}></div>
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Navigation size={16} color="#000" />
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.destination}</div>
           </div>
        </div>

        <form onSubmit={handleBooking}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>DATE</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ paddingLeft: '36px', fontSize: '14px' }}
                  required
                />
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>TIME</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  style={{ paddingLeft: '36px', fontSize: '14px' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>PASSENGERS</label>
            <div style={{ position: 'relative' }}>
              <Users size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <select
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  border: '1px solid #e2e2e2',
                  borderRadius: '10px',
                  fontSize: '15px',
                  appearance: 'none',
                  backgroundColor: 'white',
                  fontFamily: 'inherit',
                  fontWeight: 600
                }}
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Selector */}
          <div style={{ margin: '32px 0 24px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>CHOOSE SERVICE</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SERVICES.map((service, index) => (
                <div
                  key={service.name}
                  onClick={() => setSelectedService(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    border: selectedService === index ? '2px solid var(--accent)' : '2px solid transparent',
                    backgroundColor: selectedService === index ? 'var(--accent-transparent)' : '#f9f9f9',
                    borderRadius: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: selectedService === index ? 'var(--accent)' : '#ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedService === index ? '#fff' : 'var(--text-secondary)', flexShrink: 0 }}>
                    {service.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '15px', fontWeight: 800 }}>{service.name}</div>
                     <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{service.desc}</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>{service.label}</div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Payment Method */}
          <PaymentSelector />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px', backgroundColor: '#e6f4ea', borderRadius: '10px', color: '#1e7e34' }}>
             <Shield size={16} />
             <span style={{ fontSize: '12px', fontWeight: 700 }}>Your trip is protected with MOVE Safety.</span>
          </div>

          {error && <div style={{ fontSize: '13px', color: 'var(--error)', textAlign: 'center', fontWeight: 600, marginBottom: '12px' }}>{error}</div>}

          <button type="submit" className="btn btn-accent" style={{ height: '60px', borderRadius: '16px' }} disabled={loading}>
            {loading ? 'Booking…' : `Confirm Move — R${SERVICES[selectedService].price}`}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ── Payment Method Sub-component ── */
const PaymentSelector: React.FC = () => {
  const [selected, setSelected] = useState<'apple_pay' | 'card' | 'cash'>('apple_pay');

  const methods = [
    {
      id: 'apple_pay' as const,
      label: 'Apple Pay',
      sublabel: 'Pay instantly with Face ID / Touch ID',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-label="Apple Pay">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
    },
    {
      id: 'card' as const,
      label: 'Credit / Debit Card',
      sublabel: 'Visa, Mastercard, Amex',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Card">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
    },
    {
      id: 'cash' as const,
      label: 'Cash',
      sublabel: 'Pay your driver directly',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Cash">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M6 12h.01M18 12h.01"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>
        PAYMENT METHOD
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {methods.map((method) => {
          const isSelected = selected === method.id;
          return (
            <div
              key={method.id}
              id={`payment-${method.id}`}
              onClick={() => setSelected(method.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                border: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                backgroundColor: isSelected ? 'var(--accent-transparent)' : '#f9f9f9',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              {/* icon badge */}
              <div style={{
                width: '42px', height: '42px', borderRadius: '11px',
                backgroundColor: isSelected ? 'var(--accent)' : '#ebebeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                flexShrink: 0,
                transition: 'all 0.18s ease',
              }}>
                {method.icon}
              </div>

              {/* labels */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {method.label}
                  {method.id === 'apple_pay' && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                      backgroundColor: '#000', color: '#fff', borderRadius: '20px',
                      letterSpacing: '0.03em'
                    }}>
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{method.sublabel}</div>
              </div>

              {/* radio dot */}
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: isSelected ? '2px solid var(--accent)' : '2px solid #ccc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isSelected && (
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingForm;
