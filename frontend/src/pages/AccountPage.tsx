import React from 'react';
import { User, CreditCard, ShieldCheck, Settings, LogOut, ChevronRight, Mail, Phone } from 'lucide-react';

interface AccountPageProps {
  onLogout: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onLogout }) => {
  const sections = [
    { name: 'Personal Information', icon: <User size={18} />, desc: 'Manage your profile and info' },
    { name: 'Payment Methods', icon: <CreditCard size={18} />, desc: 'View and update your cards' },
    { name: 'Safety & Emergency', icon: <ShieldCheck size={18} />, desc: 'Set up contacts and safety' },
    { name: 'Preferences', icon: <Settings size={18} />, desc: 'App settings and themes' },
  ];

  return (
    <div className="container fade-in" style={{ padding: '32px 0 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
         <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
               src="https://ui-avatars.com/api/?name=User&background=6a0dad&color=fff" 
               alt="User Avatar" 
               style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eee' }}
            />
            <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Settings size={14} color="#fff" />
            </div>
         </div>
         <h1 style={{ fontSize: '24px', fontWeight: 900, marginTop: '20px', marginBottom: '4px' }}>John Doe</h1>
         <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Rider since 2026 • ⭐ 4.95</div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {sections.map((section, index) => (
          <div 
            key={section.name} 
            style={{ 
              padding: '20px 24px', 
              borderBottom: index === sections.length - 1 ? 'none' : '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              cursor: 'pointer'
            }}
          >
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
               <Mail size={18} />
               <span>support@moveapp.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
               <Phone size={18} />
               <span>+27 21 555 0123</span>
            </div>
         </div>
      </div>
      
      <button 
        onClick={onLogout}
        className="btn" 
        style={{ marginTop: '48px', color: 'var(--error)', backgroundColor: '#fff', border: '1px solid #fcebeb', fontSize: '15px', fontWeight: 800 }}
      >
        <LogOut size={18} />
        Log Out of Account
      </button>
    </div>
  );
};

export default AccountPage;
