import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, Clock, Users, Shield } from 'lucide-react';

interface BookingFormProps {
  onConfirm: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onConfirm }) => {
  const [formData, setFormData] = useState({
    pickup: 'Cape Town International Airport',
    destination: 'Waterfront, Cape Town',
    date: '2026-04-24',
    time: '14:30',
    passengers: 1,
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking trip with data:', formData);
    onConfirm();
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

          {/* Payment Method Selector (Minimalist) */}
          <div style={{ margin: '32px 0' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>CHOOSE SERVICE</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'MOVE Go', icon: '🚙', price: 'R85', desc: 'Affordable, everyday rides' },
                { name: 'MOVE XL', icon: '🚌', price: 'R145', desc: 'Larger vehicles for groups' },
                { name: 'MOVE Black', icon: '🚘', price: 'R210', desc: 'Premium luxury experience' }
              ].map((service, index) => (
                <div 
                  key={service.name} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '16px', 
                    border: index === 0 ? '2px solid var(--accent)' : '2px solid transparent',
                    backgroundColor: index === 0 ? 'var(--accent-transparent)' : '#f9f9f9',
                    borderRadius: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{service.icon}</div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '15px', fontWeight: 800 }}>{service.name}</div>
                     <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{service.desc}</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>{service.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px', backgroundColor: '#e6f4ea', borderRadius: '10px', color: '#1e7e34' }}>
             <Shield size={16} />
             <span style={{ fontSize: '12px', fontWeight: 700 }}>Your trip is protected with MOVE Safety.</span>
          </div>

          <button type="submit" className="btn btn-accent" style={{ height: '60px', borderRadius: '16px' }}>
            Confirm Move
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
