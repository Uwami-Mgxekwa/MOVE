import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import BookingForm from './components/BookingForm';
import TripStatus from './components/TripStatus';
import Footer from './components/Footer';

type Page = 'home' | 'login' | 'booking' | 'trip';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login />;
      case 'booking':
        return <BookingForm />;
      case 'trip':
        return <TripStatus />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            className="logo"
            style={{ fontSize: '28px', fontWeight: 900, color: 'var(--secondary)', cursor: 'pointer' }}
            onClick={() => setCurrentPage('home')}
          >
            MOVE<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentPage === 'home' && (
              <button
                className="btn btn-secondary"
                style={{ width: 'auto', padding: '10px 20px', borderRadius: '12px' }}
                onClick={() => setCurrentPage('login')}
              >
                Login
              </button>
            )}
            {currentPage !== 'home' && (
              <button
                className="btn"
                style={{ width: 'auto', padding: '10px 20px', borderRadius: '12px', background: 'var(--accent-transparent)', color: 'var(--accent)' }}
                onClick={() => setCurrentPage('home')}
              >
                Back
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <div className="container" style={{ textAlign: 'center', marginTop: '20px', display:'flex', gap: '8px', justifyContent:'center', overflowX: 'auto', paddingBottom:'10px' }}>
          <button 
            className={`btn ${currentPage === 'home' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: 'auto', fontSize: '12px', padding: '8px 12px' }}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            className={`btn ${currentPage === 'login' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: 'auto', fontSize: '12px', padding: '8px 12px' }}
            onClick={() => setCurrentPage('login')}
          >
            Auth
          </button>
          <button 
            className={`btn ${currentPage === 'booking' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: 'auto', fontSize: '12px', padding: '8px 12px' }}
            onClick={() => setCurrentPage('booking')}
          >
            Book
          </button>
          <button 
            className={`btn ${currentPage === 'trip' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: 'auto', fontSize: '12px', padding: '8px 12px' }}
            onClick={() => setCurrentPage('trip')}
          >
            Status
          </button>
        </div>
        
        {renderPage()}
      </main>

      <Footer />
    </>
  );
};

export default App;
