import React, { useState } from 'react';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    passengers: 1,
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking trip with data:', formData);
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '24px' }}>Confirm Your Ride</h2>
        <form onSubmit={handleBooking}>
          <div className="input-group">
            <label htmlFor="pickup">Pickup Location</label>
            <input
              id="pickup"
              type="text"
              placeholder="e.g. Cape Town International Airport"
              value={formData.pickup}
              onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="destination">Destination</label>
            <input
              id="destination"
              type="text"
              placeholder="e.g. Waterfront, Cape Town"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
            <div className="input-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="passengers">Number of Passengers</label>
            <select
              id="passengers"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '12px',
                fontSize: '16px',
                appearance: 'none',
                backgroundColor: 'white',
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
          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Book Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
