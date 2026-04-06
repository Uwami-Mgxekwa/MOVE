import React, { useState } from 'react';
import { Search, MapPin, Navigation, Clock, Star } from 'lucide-react';

interface HomeProps {
  onBookRide: () => void;
}

const Home: React.FC<HomeProps> = ({ onBookRide }) => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching trips from ${fromCity} to ${toCity}`);
    onBookRide();
  };

  return (
    <div className="container" style={{ padding: '32px 0 64px' }}>
      <div className="fade-in">
        <h1 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 32px', color: 'var(--secondary)' }}>
          Where can we<br />
          <span style={{ color: 'var(--accent)' }}>MOVE</span> you today?
        </h1>

        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <form onSubmit={handleSearch}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#6a0dad' }} />
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 52px',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: '#f9f9f9',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>
              
              <div style={{ position: 'absolute', height: '24px', width: '2px', backgroundColor: '#e2e2e2', left: '24px', top: '48px', zIndex: 1 }}></div>

              <div style={{ position: 'relative' }}>
                <Navigation size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#000' }} />
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 52px',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
              <Search size={20} />
              Find Rides
            </button>
          </form>
        </div>

        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Recent Locations</h2>
            <button style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 700 }}>See all</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Work', address: '123 Business Way, Cape Town', icon: <Clock size={16} /> },
              { label: 'Home', address: '42 Residential Ave, Gardens', icon: <Star size={16} /> }
            ].map((loc, index) => (
              <div 
                key={index} 
                className="card" 
                style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer', marginBottom: 0 }}
                onClick={() => onBookRide()}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: index === 0 ? 'var(--accent-transparent)' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index === 0 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  {loc.icon}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{loc.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{loc.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
