import React, { useState } from 'react';
import { ShieldCheck, MessageCircle, Phone, XCircle, Info, ChevronRight, Star, X } from 'lucide-react';

const TripStatus: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCall = () => { window.location.href = 'tel:+27825550100'; };
  const handleMessage = () => { alert('In-app messaging coming soon.'); };
  const handleCancel = () => setShowCancelConfirm(true);

  if (cancelled) {
    return (
      <div className="container fade-in" style={{ padding: '32px 0 64px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px 24px' }}>
          <XCircle size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>Ride Cancelled</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your ride has been cancelled. No charge has been applied.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '32px 0 64px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Ongoing Trip</h2>
          <span style={{ padding: '6px 12px', backgroundColor: 'var(--accent-transparent)', color: 'var(--accent)', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Arriving in 4 min
          </span>
        </div>

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
          <button onClick={handleMessage} className="btn btn-secondary" style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#000', padding: '12px', fontSize: '14px', borderRadius: '12px' }}>
            <MessageCircle size={18} />
            Message
          </button>
          <button onClick={handleCall} className="btn btn-secondary" style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#000', padding: '12px', fontSize: '14px', borderRadius: '12px' }}>
            <Phone size={18} />
            Call
          </button>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Cape Town International Airport</div>
          </div>
          <div style={{ height: '20px', width: '1px', borderLeft: '1px dashed #ddd', marginLeft: '3px', margin: '4px 0 4px 3px' }} />
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }} />
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Waterfront Luxury Suites</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            onClick={() => setShowDetails(true)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Info size={18} color="var(--text-muted)" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Trip Details</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>

          <button onClick={handleCancel} className="btn" style={{ color: 'var(--error)', backgroundColor: 'transparent', fontSize: '14px', fontWeight: 700, padding: '12px' }}>
            <XCircle size={18} />
            Cancel Ride
          </button>
        </div>
      </div>

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px 24px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <XCircle size={28} color="var(--error)" />
            </div>
            <div style={{ fontWeight: 900, fontSize: '18px', marginBottom: '8px' }}>Cancel this ride?</div>
            <div style={{ fontSize: '14px', color: '#717171', marginBottom: '28px', lineHeight: 1.5 }}>
              Your driver is on the way. Cancelling now may incur a small fee.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => { setShowCancelConfirm(false); setCancelled(true); }}
                className="btn"
                style={{ backgroundColor: '#ea4335', color: '#fff', fontWeight: 800, border: 'none' }}
              >
                Yes, Cancel Ride
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="btn"
                style={{ backgroundColor: '#f5f5f5', color: '#111', fontWeight: 700, border: 'none' }}
              >
                Keep My Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Details Sheet */}
      {showDetails && (
        <div onClick={() => setShowDetails(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '32px 24px 48px', color: '#111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontWeight: 900, fontSize: '18px' }}>Trip Details</div>
              <button onClick={() => setShowDetails(false)} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            {[
              { label: 'Pickup', value: 'Cape Town International Airport' },
              { label: 'Destination', value: 'Waterfront Luxury Suites' },
              { label: 'Driver', value: 'Michael • ⭐ 4.9' },
              { label: 'Vehicle', value: 'Toyota Fortuner • White • ND 123-456' },
              { label: 'Service', value: 'MOVE Black' },
              { label: 'Estimated Fare', value: 'R210' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' }}>
                <span style={{ color: '#a1a1a1', fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripStatus;
