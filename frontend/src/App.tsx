import React from 'react';
import Home from './components/Home';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <>
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ fontSize: '28px', fontWeight: 900, color: 'var(--secondary)' }}>
            MOVE<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <button
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '10px 20px', borderRadius: '12px' }}
          >
            Login
          </button>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Home />
      </main>

      <Footer />
    </>
  );
};

export default App;
