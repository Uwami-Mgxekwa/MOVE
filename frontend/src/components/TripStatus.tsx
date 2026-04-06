import React from 'react';

const TripStatus: React.FC = () => {
  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Current Trip</h2>
          <span
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--accent-transparent)',
              color: 'var(--accent)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            In Progress
          </span>
        </div>
        <div style={{ padding: '24px', backgroundColor: '#f0f0f0', borderRadius: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Destination</div>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>Joburg CBD</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '20px', alignItems: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            🚗
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Driver Details</div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>Michael - Toyota Fortuner</div>
            <div style={{ fontSize: '14px', fontWeight: 400 }}>⭐ 4.9 (127 trips)</div>
          </div>
        </div>
        <div style={{ marginTop: '32px' }}>
          <button className="btn btn-secondary" style={{ marginBottom: '12px' }}>
            Message Driver
          </button>
          <button
            className="btn"
            style={{ backgroundColor: 'transparent', color: 'red', fontSize: '14px', fontWeight: 600, border: 'none' }}
          >
            Cancel Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripStatus;
