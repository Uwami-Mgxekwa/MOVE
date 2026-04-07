import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, MessageCircle, Phone, XCircle, Info, ChevronRight, Star, X, Send } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ChatMessage { sender: 'rider' | 'driver'; text: string; time: string; }

interface TripStatusProps {
  tripId?: number | null;
  onTripComplete?: () => void;
}

const TripStatus: React.FC<TripStatusProps> = ({ tripId, onTripComplete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [eta, setEta] = useState(4);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'driver', text: "I'm on my way! See you soon 🚗", time: '14:28' },
  ]);

  // Map refs
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const driverMarker = useRef<L.Marker | null>(null);

  // Default Cape Town coords
  const [driverPos, setDriverPos] = useState({ lat: -33.918861, lng: 18.423300 });
  const riderPos = { lat: -33.9249, lng: 18.4241 };

  const stompRef = useRef<Client | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Init map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false })
      .setView([driverPos.lat, driverPos.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Rider marker (purple)
    const riderIcon = L.divIcon({
      html: `<div style="width:14px;height:14px;background:#6a0dad;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      className: '', iconAnchor: [7, 7],
    });
    L.marker([riderPos.lat, riderPos.lng], { icon: riderIcon }).addTo(map).bindPopup('Your location');

    // Driver marker (black car)
    const driverIcon = L.divIcon({
      html: `<div style="width:36px;height:36px;background:#000;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:18px">🚗</div>`,
      className: '', iconAnchor: [18, 18],
    });
    driverMarker.current = L.marker([driverPos.lat, driverPos.lng], { icon: driverIcon }).addTo(map).bindPopup('Your driver');

    leafletMap.current = map;
  }, []);

  // Update driver marker when position changes
  useEffect(() => {
    if (driverMarker.current) {
      driverMarker.current.setLatLng([driverPos.lat, driverPos.lng]);
      leafletMap.current?.panTo([driverPos.lat, driverPos.lng]);
    }
  }, [driverPos]);

  // WebSocket
  useEffect(() => {
    if (!tripId) return;
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe(`/topic/trip/${tripId}`, (msg) => {
          const data = JSON.parse(msg.body);
          if (data.eta !== undefined) setEta(data.eta);
          if (data.lat && data.lng) setDriverPos({ lat: data.lat, lng: data.lng });
          if (data.status === 'COMPLETED') onTripComplete?.();
        });
        client.subscribe(`/topic/chat/${tripId}`, (msg) => {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [...prev, { sender: data.sender, text: data.text, time: data.time }]);
        });
      },
    });
    client.activate();
    stompRef.current = client;
    return () => { client.deactivate(); };
  }, [tripId]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChat]);

  // ETA countdown
  useEffect(() => {
    if (eta <= 0) return;
    const t = setInterval(() => setEta((e) => Math.max(0, e - 1)), 60000);
    return () => clearInterval(t);
  }, [eta]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = { sender: 'rider', text: chatInput.trim(), time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, msg]);
    stompRef.current?.publish({
      destination: `/app/chat/${tripId ?? 0}`,
      body: JSON.stringify({ sender: 'rider', text: msg.text }),
    });
    setChatInput('');
  };

  const handleCall = () => { window.location.href = 'tel:+27825550100'; };
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
    <div className="fade-in" style={{ paddingBottom: '32px' }}>

      {/* MAP — full width at top */}
      <div ref={mapRef} style={{ width: '100%', height: '260px', position: 'relative', zIndex: 0 }} />

      {/* ETA pill over map */}
      <div style={{ position: 'relative', marginTop: '-20px', display: 'flex', justifyContent: 'center', zIndex: 1 }}>
        <span style={{ padding: '8px 20px', backgroundColor: 'var(--accent)', color: '#fff', borderRadius: '20px', fontSize: '13px', fontWeight: 800, boxShadow: '0 4px 12px rgba(106,13,173,0.3)', letterSpacing: '0.03em' }}>
          {eta > 0 ? `Driver arriving in ${eta} min` : 'Driver arriving now'}
        </span>
      </div>

      <div className="container" style={{ marginTop: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Ongoing Trip</h2>
          </div>

          {/* Driver info */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150"
                alt="Driver" style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                <ShieldCheck size={14} color="var(--success)" fill="var(--success)" stroke="white" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>Michael</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Star size={14} fill="#FFD700" color="#FFD700" /><span>4.9 (127 trips)</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>ND 123-456</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Toyota Fortuner • White</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => setShowChat(true)} className="btn btn-secondary"
              style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#000', padding: '12px', fontSize: '14px', borderRadius: '12px' }}>
              <MessageCircle size={18} /> Message
            </button>
            <button onClick={handleCall} className="btn btn-secondary"
              style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#000', padding: '12px', fontSize: '14px', borderRadius: '12px' }}>
              <Phone size={18} /> Call
            </button>
          </div>

          {/* Route */}
          <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '14px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', flexShrink: 0 }} />
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Cape Town International Airport</div>
            </div>
            <div style={{ height: '16px', width: '1px', borderLeft: '1px dashed #ddd', marginLeft: '3px', margin: '4px 0 4px 3px' }} />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000', flexShrink: 0 }} />
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Waterfront Luxury Suites</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div onClick={() => setShowDetails(true)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Info size={18} color="var(--text-muted)" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Trip Details</span>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
            <button onClick={handleCancel} className="btn"
              style={{ color: 'var(--error)', backgroundColor: 'transparent', fontSize: '14px', fontWeight: 700, padding: '12px' }}>
              <XCircle size={18} /> Cancel Ride
            </button>
          </div>
        </div>
      </div>

      {/* CHAT SHEET */}
      {showChat && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* Chat header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: '16px' }}>Michael</div>
                <div style={{ fontSize: '12px', color: '#34a853', fontWeight: 600 }}>● Online</div>
              </div>
              <button onClick={() => setShowChat(false)}
                style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'rider' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '75%', padding: '10px 14px', borderRadius: msg.sender === 'rider' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    backgroundColor: msg.sender === 'rider' ? '#6a0dad' : '#f0f0f0',
                    color: msg.sender === 'rider' ? '#fff' : '#111',
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{msg.text}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message…"
                style={{ flex: 1, padding: '12px 16px', border: '1px solid #eee', borderRadius: '24px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
              />
              <button onClick={sendMessage}
                style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#6a0dad', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Send size={18} color="#fff" />
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button onClick={() => { setShowCancelConfirm(false); setCancelled(true); }} className="btn"
                style={{ backgroundColor: '#ea4335', color: '#fff', fontWeight: 800, border: 'none' }}>
                Yes, Cancel Ride
              </button>
              <button onClick={() => setShowCancelConfirm(false)} className="btn"
                style={{ backgroundColor: '#f5f5f5', color: '#111', fontWeight: 700, border: 'none' }}>
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
