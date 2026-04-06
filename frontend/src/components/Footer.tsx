import React from 'react';

const Footer: React.FC = () => {
  return (
    <div 
      style={{ 
        marginTop: '64px', 
        padding: '32px 0 16px', 
        textAlign: 'center', 
        color: 'var(--text-muted)', 
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        opacity: 0.6
      }}
    >
      <div>© 2026 MOVE Ride App. All rights reserved.</div>
    </div>
  );
};

export default Footer;
