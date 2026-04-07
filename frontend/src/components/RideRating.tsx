import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { apiRateTrip } from '../api';

interface RideRatingProps {
  tripId: number;
  onDone: () => void;
}

const RideRating: React.FC<RideRatingProps> = ({ tripId, onDone }) => {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const riderId = Number(localStorage.getItem('userId'));

  const handleSubmit = async () => {
    if (stars === 0) return;
    setLoading(true);
    await apiRateTrip(tripId, riderId, stars, comment).catch(() => {});
    setSubmitted(true);
    setLoading(false);
    setTimeout(onDone, 1500);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 24px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
        <div style={{ fontWeight: 900, fontSize: '18px', marginBottom: '8px' }}>Thanks for your feedback!</div>
        <div style={{ fontSize: '14px', color: '#717171' }}>Your rating helps improve the MOVE experience.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '6px' }}>How was your ride?</div>
        <div style={{ fontSize: '14px', color: '#717171' }}>Rate your experience with Michael</div>
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setStars(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <Star size={36} fill={(hovered || stars) >= s ? '#FFD700' : 'none'} color={(hovered || stars) >= s ? '#FFD700' : '#ddd'} strokeWidth={1.5} />
          </button>
        ))}
      </div>

      {stars > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment (optional)…"
            rows={3}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e2e2', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', resize: 'none', outline: 'none' }}
          />
        </div>
      )}

      <button onClick={handleSubmit} className="btn btn-primary" disabled={stars === 0 || loading}
        style={{ opacity: stars === 0 ? 0.5 : 1 }}>
        {loading ? 'Submitting…' : 'Submit Rating'}
      </button>
      <button onClick={onDone} className="btn" style={{ marginTop: '10px', backgroundColor: '#f5f5f5', color: '#111', border: 'none' }}>
        Skip
      </button>
    </div>
  );
};

export default RideRating;
