import React from 'react';
import { ShieldCheck, MessageCircle, Phone, XCircle, Info, ChevronRight, Star } from 'lucide-react';

const TripStatus: React.FC = () => {
  return (
    <div className="container fade-in" style={{ padding: '32px 0 64px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Ongoing Trip</h2>
          <span
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--accent-transparent)',
              color: 'var(--accent)',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Arriving in 4 min
          </span>
        </div>

        {/* Driver and Car Details (Bolt/Uber Style) */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
             <img 
               src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150" 
               alt="Driver Profile" 
               style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover' }}
             />
             <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                <ShieldCheck size={14} color="var(--success)" fill="var(--success)" stroke="white" />
             </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>Michael</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <span>4.9 (127 trips)</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--secondary)' }}>ND 123-456</div>
                 <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Toyota Fortuner • White</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button className="btn btn-secondary" style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#000', padding: '12px', fontSize: '14px', borderRadius: '12px' }}>
            <MessageCircle size={18} />
            Message
          </button>
          <button className="btn btn-secondary" style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#000', padding: '12px', fontSize: '14px', borderRadius: '12px' }}>
            <Phone size={18} />
            Call
          </button>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '16px', marginBottom: '32px' }}>
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>Cape Town International Airport</div>
           </div>
           <div style={{ height: '20px', width: '1px', borderLeft: '1px dashed #ddd', marginLeft: '3px', margin: '4px 0 4px 3px' }}></div>
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }}></div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>Waterfront Luxury Suites</div>
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer' }}>
             <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
               <Info size={18} color="var(--text-muted)" />
               <span style={{ fontSize: '14px', fontWeight: 600 }}>Trip Details</span>
             </div>
             <ChevronRight size={18} color="var(--text-muted)" />
          </div>
          
          <button
            className="btn"
            style={{ color: 'var(--error)', backgroundColor: 'transparent', fontSize: '14px', fontWeight: 700, padding: '12px' }}
          >
            <XCircle size={18} />
            Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripStatus;
