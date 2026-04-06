import React from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

const ActivityPage: React.FC = () => {
  const activities = [
    { destination: 'Waterfront Luxury Suites', date: 'Mar 24, 2026', time: '14:30', price: 'R145', status: 'Completed' },
    { destination: 'Cape Town Int. Airport', date: 'Mar 22, 2026', time: '09:15', price: 'R210', status: 'Completed' },
    { destination: 'Green Point Stadium', date: 'Mar 20, 2026', time: '18:45', price: 'R65', status: 'Cancelled' },
  ];

  return (
    <div className="container fade-in" style={{ padding: '32px 0 64px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '24px' }}>Your Activity</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.map((activity, i) => (
          <div key={i} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: i === 2 ? '#fff0f0' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={24} color={i === 2 ? 'var(--error)' : 'var(--accent)'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>{activity.destination}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <Clock size={12} />
                <span>{activity.date} • {activity.time}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900, fontSize: '16px' }}>{activity.price}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: i === 2 ? 'var(--error)' : 'var(--success)', textTransform: 'uppercase' }}>{activity.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
