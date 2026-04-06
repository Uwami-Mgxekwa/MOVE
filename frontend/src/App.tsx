import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import BookingForm from './components/BookingForm';
import TripStatus from './components/TripStatus';
import Footer from './components/Footer';
import { Home as HomeIcon, MapPin, User, Activity } from 'lucide-react';

type Page = 'home' | 'activity' | 'account' | 'booking' | 'trip';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  const renderDashboard = () => {
    switch (currentPage) {
      case 'home':
        return <Home onBookRide={() => setCurrentPage('booking')} />;
      case 'activity':
        return <ActivityPage />;
      case 'account':
        return <AccountPage onLogout={() => setIsAuthenticated(false)} />;
      case 'booking':
        return <BookingForm onConfirm={() => setCurrentPage('trip')} />;
      case 'trip':
        return <TripStatus />;
      default:
        return <Home onBookRide={() => setCurrentPage('booking')} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Dynamic Header for different pages */}
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            className="logo"
            style={{ fontSize: '24px', fontWeight: 900, color: 'var(--secondary)', cursor: 'pointer' }}
            onClick={() => setCurrentPage('home')}
          >
            MOVE<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden' }}>
               <img src="https://ui-avatars.com/api/?name=User&background=6a0dad&color=fff" alt="Avatar" />
             </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {renderDashboard()}
      </main>

      {/* Persistent Bottom Nav for the Dashboard */}
      <nav className="bottom-nav">
        <div 
          className={`nav-item ${currentPage === 'home' || currentPage === 'booking' || currentPage === 'trip' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('home')}
        >
          <HomeIcon size={24} strokeWidth={currentPage === 'home' ? 2.5 : 2} />
          <span>Home</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'activity' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('activity')}
        >
          <Activity size={24} strokeWidth={currentPage === 'activity' ? 2.5 : 2} />
          <span>Activity</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'account' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('account')}
        >
          <User size={24} strokeWidth={currentPage === 'account' ? 2.5 : 2} />
          <span>Account</span>
        </div>
      </nav>
    </div>
  );
};

// Placeholder for Activity Page
const ActivityPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h2 style={{ marginBottom: '24px' }}>Your Activity</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={24} color="var(--accent)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>To Cape Town CBD</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Mar 24, 2026 • 14:30</div>
            </div>
            <div style={{ fontWeight: 800 }}>R145</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder for Account Page
const AccountPage: React.FC = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h2 style={{ marginBottom: '24px' }}>My Account</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {['Personal Info', 'Payment Methods', 'Safety', 'Settings'].map((item, index) => (
          <div 
            key={item} 
            style={{ 
              padding: '16px 20px', 
              borderBottom: index === 3 ? 'none' : '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontWeight: 600 }}>{item}</span>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
        ))}
      </div>
      
      <button 
        onClick={onLogout}
        className="btn" 
        style={{ marginTop: '32px', color: 'var(--error)', backgroundColor: 'transparent', fontSize: '15px', fontWeight: 700 }}
      >
        Sign Out
      </button>

      {/* Grayed out footer as requested */}
      <Footer />
    </div>
  );
};

// Helper components for the demo
const ArrowRight = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default App;
