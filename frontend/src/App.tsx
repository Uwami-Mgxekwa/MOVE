import React, { useState } from 'react';
/* Pages & Components */
import Home from './components/Home';
import Login from './components/Login';
import BookingForm from './components/BookingForm';
import TripStatus from './components/TripStatus';
import ActivityPage from './pages/ActivityPage';
import AccountPage from './pages/AccountPage';
/* Icons */
import { Home as HomeIcon, LayoutPanelLeft, User, Activity } from 'lucide-react';

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
          <div style={{ display: 'flex', gap: '8px' }}>
             <div 
               style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 0 0 1px #eee' }}
               onClick={() => setCurrentPage('account')}
             >
                <img src="https://ui-avatars.com/api/?name=John+Doe&background=000&color=fff" alt="Avatar" />
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
    </div>
  );
};

export default App;
