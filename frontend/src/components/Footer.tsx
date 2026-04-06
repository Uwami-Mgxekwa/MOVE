import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>© 2026 MOVE Ride App. All rights reserved.</p>
          <p style={{ fontSize: '16px', fontWeight: 600 }}>
            Powered by{' '}
            <a
              href="https://brelinx.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', fontWeight: 700 }}
            >
              Brelinx
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
