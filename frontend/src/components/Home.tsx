import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Clock, Star, Loader } from 'lucide-react';

interface HomeProps {
  onBookRide: () => void;
}

const Home: React.FC<HomeProps> = ({ onBookRide }) => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const road = data.address?.road ?? '';
          const suburb = data.address?.suburb ?? data.address?.neighbourhood ?? '';
          const city = data.address?.city ?? data.address?.town ?? data.address?.village ?? '';
          const addr = [road, suburb, city].filter(Boolean).join(', ') || data.display_name?.split(',').slice(0, 3).join(',') || 'Current location';
          setFromCity(addr);
        } catch {
          setFromCity('Current location');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocError('Location access denied — enter manually');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
                {locating
                  ? <Loader size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#6a0dad', animation: 'spin 1s linear infinite' }} />
                  : <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#6a0dad' }} />
                }
                <input
                  type="text"
                  placeholder={locating ? 'Getting your location…' : 'Enter pickup location'}
                  value={fromCity}
                  onChange={(e) => { setFromCity(e.target.value); setLocError(''); }}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 52px',
                    border: `1px solid ${locError ? '#f87171' : '#eee'}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: '#f9f9f9',
                    fontFamily: 'inherit'
                  }}
                  required
                />
                {locError && (
                  <div style={{ fontSize: '12px', color: '#f87171', marginTop: '6px', paddingLeft: '4px' }}>{locError}</div>
                )}
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
            <button onClick={onBookRide} style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 700 }}>See all</button>
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
