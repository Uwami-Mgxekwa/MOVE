import React, { useState, useEffect } from 'react';
import { User, CreditCard, ShieldCheck, Settings, LogOut, ChevronRight, Mail, Phone, Sun, Moon, Monitor, X, Save, Plus, Lock } from 'lucide-react';

type Theme = 'light' | 'dark' | 'device';
type Modal = 'preferences' | 'personal' | 'payment' | 'safety' | null;

interface AccountPageProps {
  onLogout: () => void;
}

const SheetWrapper: React.FC<{ onClose: () => void; title: string; subtitle?: string; children: React.ReactNode }> = ({ onClose, title, subtitle, children }) => (
  <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
    <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: '24px 24px 0 0', padding: '32px 24px 48px', color: '#111111', maxHeight: '85vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '18px' }}>{title}</div>
          {subtitle && <div style={{ fontSize: '13px', color: '#a1a1a1', marginTop: '2px' }}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 800, color: '#a1a1a1', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', border: '1px solid #e2e2e2', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', backgroundColor: '#fafafa', color: '#111', marginTop: '6px', display: 'block' };

const PaymentSheet: React.FC = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  if (showAddCard) {
    return (
      <div>
        <button onClick={() => setShowAddCard(false)} style={{ background: 'none', border: 'none', color: '#6a0dad', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>
          ← Back to Payment Methods
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Card Number</label>
            <input style={inputStyle} placeholder="1234 5678 9012 3456" value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })} />
          </div>
          <div>
            <label style={labelStyle}>Cardholder Name</label>
            <input style={inputStyle} placeholder="Thabo Nkosi" value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Expiry Date</label>
              <input style={inputStyle} placeholder="MM/YY" value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })} />
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input style={inputStyle} placeholder="•••" type="password" maxLength={4} value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#f0f9f4', borderRadius: '10px' }}>
            <Lock size={14} color="#1e7e34" />
            <span style={{ fontSize: '12px', color: '#1e7e34', fontWeight: 600 }}>Your card details are encrypted and secure</span>
          </div>
          <button onClick={() => setShowAddCard(false)} className="btn btn-primary" style={{ gap: '10px' }}>
            <Save size={18} /> Save Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Apple Pay */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#a1a1a1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>Digital Wallets</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '14px', border: '2px solid #eee', backgroundColor: '#fafafa' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Apple Pay</div>
            <div style={{ fontSize: '12px', color: '#a1a1a1' }}>Pay with Face ID or Touch ID</div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#34a853', backgroundColor: '#e6f4ea', padding: '4px 8px', borderRadius: '6px' }}>LINKED</span>
        </div>
      </div>

      {/* Saved Cards */}
      <div style={{ fontSize: '12px', fontWeight: 800, color: '#a1a1a1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>Saved Cards</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Visa ending in 4242', sub: 'Expires 08/28', active: true },
          { label: 'Mastercard ending in 8891', sub: 'Expires 03/27', active: false },
        ].map((card) => (
          <div key={card.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '14px', border: card.active ? '2px solid #6a0dad' : '2px solid #eee', backgroundColor: card.active ? 'rgba(106,13,173,0.06)' : '#fafafa' }}>
            <CreditCard size={22} color={card.active ? '#6a0dad' : '#a1a1a1'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{card.label}</div>
              <div style={{ fontSize: '12px', color: '#a1a1a1' }}>{card.sub}</div>
            </div>
            {card.active && <span style={{ fontSize: '11px', fontWeight: 800, color: '#6a0dad' }}>DEFAULT</span>}
          </div>
        ))}
      </div>

      <button onClick={() => setShowAddCard(true)} className="btn" style={{ border: '1px solid #eee', backgroundColor: 'transparent', color: '#111', fontWeight: 700, gap: '10px' }}>
        <Plus size={18} /> Add New Card
      </button>
    </div>
  );
};

const AccountPage: React.FC<AccountPageProps> = ({ onLogout }) => {
  const [modal, setModal] = useState<Modal>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) ?? 'device');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const sections = [
    { name: 'Personal Information', icon: <User size={18} />, desc: 'Manage your profile and info', onTap: () => setModal('personal') },
    { name: 'Payment Methods', icon: <CreditCard size={18} />, desc: 'View and update your cards', onTap: () => setModal('payment') },
    { name: 'Safety & Emergency', icon: <ShieldCheck size={18} />, desc: 'Set up contacts and safety', onTap: () => setModal('safety') },
    { name: 'Preferences', icon: <Settings size={18} />, desc: 'App settings and themes', onTap: () => setModal('preferences') },
  ];

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={20} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={20} /> },
    { value: 'device', label: 'Device Default', icon: <Monitor size={20} /> },
  ];

  return (
    <div className="container fade-in" style={{ padding: '32px 0 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src="https://ui-avatars.com/api/?name=User&background=6a0dad&color=fff" alt="User Avatar"
            style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eee' }} />
          <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={14} color="#fff" />
          </div>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, marginTop: '20px', marginBottom: '4px' }}>Thabo Nkosi</h1>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Rider since 2026 • ⭐ 4.95</div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {sections.map((section, index) => (
          <div key={section.name} onClick={section.onTap}
            style={{ padding: '20px 24px', borderBottom: index === sections.length - 1 ? 'none' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              {section.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>{section.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{section.desc}</div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '0 8px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact Support</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Mail size={18} /><span>support@moveapp.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Phone size={18} /><span>+27 21 555 0123</span>
          </div>
        </div>
      </div>

      <button onClick={onLogout} className="btn"
        style={{ marginTop: '48px', color: 'var(--error)', backgroundColor: '#fff', border: '1px solid #fcebeb', fontSize: '15px', fontWeight: 800 }}>
        <LogOut size={18} />
        Log Out of Account
      </button>

      {modal === 'personal' && (
        <SheetWrapper onClose={() => setModal(null)} title="Personal Information" subtitle="Update your profile details">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div><label style={labelStyle}>Full Name</label><input style={inputStyle} defaultValue="Thabo Nkosi" /></div>
            <div><label style={labelStyle}>Email Address</label><input style={inputStyle} type="email" defaultValue="thabo@example.com" /></div>
            <div><label style={labelStyle}>Phone Number</label><input style={inputStyle} type="tel" defaultValue="+27 82 555 0100" /></div>
            <div><label style={labelStyle}>Home Address</label><input style={inputStyle} defaultValue="42 Residential Ave, Gardens, Cape Town" /></div>
            <button onClick={() => setModal(null)} className="btn btn-primary" style={{ marginTop: '8px', gap: '10px' }}>
              <Save size={18} /> Save Changes
            </button>
          </div>
        </SheetWrapper>
      )}

      {modal === 'payment' && (
        <SheetWrapper onClose={() => setModal(null)} title="Payment Methods" subtitle="Manage your payment options">
        <PaymentSheet />
        </SheetWrapper>
      )}

      {modal === 'safety' && (
        <SheetWrapper onClose={() => setModal(null)} title="Safety & Emergency" subtitle="Your safety contacts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div><label style={labelStyle}>Emergency Contact Name</label><input style={inputStyle} defaultValue="Nomsa Dlamini" /></div>
            <div><label style={labelStyle}>Emergency Contact Number</label><input style={inputStyle} type="tel" defaultValue="+27 83 555 0199" /></div>
            <div style={{ padding: '14px', backgroundColor: '#e6f4ea', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ShieldCheck size={18} color="#1e7e34" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e7e34' }}>All your trips are monitored by MOVE Safety. Your emergency contact will be notified if anything unusual is detected.</span>
            </div>
            <button onClick={() => setModal(null)} className="btn btn-primary" style={{ gap: '10px' }}>
              <Save size={18} /> Save Contact
            </button>
          </div>
        </SheetWrapper>
      )}

      {modal === 'preferences' && (
        <SheetWrapper onClose={() => setModal(null)} title="Preferences" subtitle="App settings and themes">
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#a1a1a1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>Appearance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {themeOptions.map((opt) => (
              <button key={opt.value} onClick={() => setTheme(opt.value)}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '14px', cursor: 'pointer', border: theme === opt.value ? '2px solid #6a0dad' : '2px solid #eee', backgroundColor: theme === opt.value ? 'rgba(106,13,173,0.08)' : '#fafafa', fontWeight: 700, fontSize: '15px', color: theme === opt.value ? '#6a0dad' : '#111111', textAlign: 'left' }}>
                <span style={{ color: theme === opt.value ? '#6a0dad' : '#a1a1a1' }}>{opt.icon}</span>
                {opt.label}
                {theme === opt.value && <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 800, color: '#6a0dad' }}>ACTIVE</span>}
              </button>
            ))}
          </div>
        </SheetWrapper>
      )}
    </div>
  );
};

export default AccountPage;
