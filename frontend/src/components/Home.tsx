import React, { useState, useEffect } from 'react';
import { Search, Plus, X, MapPin } from 'lucide-react';
import { apiGetSavedPlaces, apiSavePlace, apiDeletePlace } from '../api';
import AddressInput from './AddressInput';

interface HomeProps {
  onBookRide: (pickup: string, destination: string) => void;
  userId?: number | null;
}

interface SavedPlace { id: number; label: string; address: string; }

const Home: React.FC<HomeProps> = ({ onBookRide, userId }) => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    if (userId) {
      apiGetSavedPlaces(userId).then((data) => {
        if (Array.isArray(data)) setSavedPlaces(data);
      }).catch(() => {});
    }
  }, [userId]);

  const addPlace = () => {
    if (!newLabel.trim() || !newAddress.trim() || !userId) return;
    apiSavePlace({ userId, label: newLabel.trim(), address: newAddress.trim() }).then((p) => {
      setSavedPlaces((prev) => [...prev, p]);
      setNewLabel(''); setNewAddress(''); setShowAddPlace(false);
    }).catch(() => {});
  };

  const deletePlace = (id: number) => {
    apiDeletePlace(id).then(() => setSavedPlaces((prev) => prev.filter((p) => p.id !== id))).catch(() => {});
  };

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
    onBookRide(fromCity, toCity);
  };

  return (
    <div className="container" style={{ padding: '32px 0 64px' }}>
      <div className="fade-in">
        <h1 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 32px', color: 'var(--secondary)' }}>
          Where can we<br />
          <span style={{ color: 'var(--accent)' }}>MOVE</span> you today?
        </h1>

        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'visible' }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AddressInput value={fromCity} onChange={(v) => { setFromCity(v); setLocError(''); }}
                placeholder={locating ? 'Getting your location…' : 'Enter pickup location'} icon="pickup" />
              {locError && <div style={{ fontSize: '12px', color: '#f87171', paddingLeft: '4px' }}>{locError}</div>}
              <div style={{ height: '1px', backgroundColor: '#eee' }} />
              <AddressInput value={toCity} onChange={setToCity} placeholder="Where to?" icon="destination" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
              <Search size={20} />
              Find Rides
            </button>
          </form>
        </div>

        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Saved Places</h2>
            <button onClick={() => setShowAddPlace(true)} style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={16} /> Add
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savedPlaces.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                No saved places yet. Add your home or work for quick access.
              </div>
            )}
            {savedPlaces.map((place) => (
              <div key={place.id} className="card"
                style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer', marginBottom: 0 }}>
                <div onClick={() => onBookRide(fromCity, place.address)}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--accent-transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <MapPin size={16} />
                </div>
                <div style={{ flex: 1 }} onClick={() => onBookRide(fromCity, place.address)}>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{place.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{place.address}</div>
                </div>
                <button onClick={() => deletePlace(place.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Place Sheet */}
        {showAddPlace && (
          <div onClick={() => setShowAddPlace(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '32px 24px 48px' }}>
              <div style={{ fontWeight: 900, fontSize: '18px', marginBottom: '24px' }}>Add Saved Place</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#a1a1a1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Label</label>
                  <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Home, Work, Gym"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e2e2', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', marginTop: '6px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#a1a1a1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Address</label>
                  <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Full address"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e2e2', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', marginTop: '6px' }} />
                </div>
                <button onClick={addPlace} className="btn btn-primary" style={{ marginTop: '8px' }}>Save Place</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
