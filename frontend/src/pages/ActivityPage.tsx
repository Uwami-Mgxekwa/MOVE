import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ChevronRight, X, RotateCcw } from 'lucide-react';
import { apiGetRiderTrips } from '../api';

interface Activity {
  destination: string;
  date: string;
  time: string;
  price: string;
  status: string;
  from: string;
}

interface ActivityPageProps {
  onBookRide?: () => void;
  userId?: number | null;
}

const MOCK_ACTIVITIES: Activity[] = [
  { from: 'Cape Town Int. Airport', destination: 'Waterfront Luxury Suites', date: 'Mar 24, 2026', time: '14:30', price: 'R145', status: 'Completed' },
  { from: 'Gardens, Cape Town', destination: 'Cape Town Int. Airport', date: 'Mar 22, 2026', time: '09:15', price: 'R210', status: 'Completed' },
  { from: 'Sea Point', destination: 'Green Point Stadium', date: 'Mar 20, 2026', time: '18:45', price: 'R65', status: 'Cancelled' },
];

const ActivityPage: React.FC<ActivityPageProps> = ({ onBookRide, userId }) => {
  const [selected, setSelected] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  useEffect(() => {
    if (!userId) return;
    apiGetRiderTrips(userId).then((trips) => {
      if (Array.isArray(trips) && trips.length > 0) {
        setActivities(trips.map((t: any) => ({
          from: t.originCity,
          destination: t.destinationCity,
          date: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: '--:--',
          price: 'R--',
          status: t.status.charAt(0) + t.status.slice(1).toLowerCase(),
        })));
      }
    }).catch(() => {/* keep mock data */});
  }, [userId]);

  return (
    <div className="container fade-in" style={{ padding: '32px 0 64px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '24px' }}>Your Activity</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.map((activity, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setSelected(activity)}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: activity.status === 'Cancelled' ? '#fff0f0' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={24} color={activity.status === 'Cancelled' ? 'var(--error)' : 'var(--accent)'} />
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
              <div style={{ fontSize: '11px', fontWeight: 700, color: activity.status === 'Cancelled' ? 'var(--error)' : 'var(--success)', textTransform: 'uppercase' }}>{activity.status}</div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        ))}
      </div>

      {/* Trip Detail Sheet */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '32px 24px 48px', color: '#111' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: '18px' }}>Trip Details</div>
                <div style={{ fontSize: '13px', color: '#a1a1a1', marginTop: '2px' }}>{selected.date} • {selected.time}</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f8f8f8', borderRadius: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6a0dad', flexShrink: 0 }} />
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{selected.from}</div>
              </div>
              <div style={{ height: '16px', width: '1px', borderLeft: '1px dashed #ddd', marginLeft: '3px', marginBottom: '8px' }} />
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000', flexShrink: 0 }} />
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{selected.destination}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#717171' }}>Total fare</span>
              <span style={{ fontWeight: 900 }}>{selected.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px' }}>
              <span style={{ color: '#717171' }}>Status</span>
              <span style={{ fontWeight: 700, color: selected.status === 'Cancelled' ? '#ea4335' : '#34a853' }}>{selected.status}</span>
            </div>

            {onBookRide && (
              <button
                onClick={() => { setSelected(null); onBookRide(); }}
                className="btn btn-primary"
                style={{ gap: '10px' }}
              >
                <RotateCcw size={18} />
                Book This Ride Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
