import React, { useState } from 'react';
/* Pages & Components */
import Home from './components/Home';
import Login from './components/Login';
import BookingForm from './components/BookingForm';
import TripStatus from './components/TripStatus';
import ActivityPage from './pages/ActivityPage';
import AccountPage from './pages/AccountPage';
import NotificationBell from './components/NotificationBell';
import RideRating from './components/RideRating';
/* Icons */
import { Home as HomeIcon, User, Activity } from 'lucide-react';

type Page = 'home' | 'activity' | 'account' | 'booking' | 'trip';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [activeTripId, setActiveTripId] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);

  const handleLoginSuccess = (id: number, name: string) => {
    setUserId(id);
    setUserName(name);
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  const renderDashboard = () => {
    switch (currentPage) {
      case 'home':
        return <Home onBookRide={() => setCurrentPage('booking')} userId={userId} />;
      case 'activity':
        return <ActivityPage onBookRide={() => setCurrentPage('booking')} userId={userId} />;
      case 'account':
        return <AccountPage onLogout={() => setIsAuthenticated(false)} />;
      case 'booking':
        return <BookingForm onConfirm={(tripId) => { setActiveTripId(tripId); setCurrentPage('trip'); }} />;
      case 'trip':
        return <TripStatus tripId={activeTripId} onTripComplete={() => setShowRating(true)} />;
      default:
        return <Home onBookRide={() => setCurrentPage('booking')} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ paddingBottom: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
             <NotificationBell userId={userId} />
             <div 
               style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 0 0 1px #eee' }}
               onClick={() => setCurrentPage('account')}
             >
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=000&color=fff`} alt="Avatar" />
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
          className={`nav-item ${currentPage === 'activity' ? 'activity' === currentPage ? 'active' : '' : ''}`} 
          style={{ color: currentPage === 'activity' ? 'var(--secondary)' : 'var(--text-muted)' }}
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
      {/* Ride Rating Modal */}
      {showRating && activeTripId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', backgroundColor: '#fff', borderRadius: '24px 24px 0 0' }}>
            <RideRating tripId={activeTripId} onDone={() => { setShowRating(false); setCurrentPage('home'); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
