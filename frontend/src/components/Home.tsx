import React, { useState } from 'react';

const Home: React.FC = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching trips from ${fromCity} to ${toCity}`);
    // Future trip search logic will go here
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="card" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '24px', textAlign: 'left', color: 'var(--secondary)' }}>
          Where can we <span>MOVE</span> you today?
        </h1>
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <label htmlFor="fromCity">Pickup Location</label>
            <input
              id="fromCity"
              type="text"
              placeholder="e.g. Cape Town"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="toCity">Destination</label>
            <input
              id="toCity"
              type="text"
              placeholder="e.g. Johannesburg"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Search Trips
          </button>
        </form>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Popular Routes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {['Cape Town - Joburg', 'Durban - Pretoria', 'Joburg - Nelspruit', 'PE - East London'].map((route) => (
            <div
              key={route}
              className="card"
              style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 0,
              }}
            >
              {route}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
