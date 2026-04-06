import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${isLogin ? 'Logging in' : 'Signing up'} with ${email}`);
    // Simulate authentication success
    onLoginSuccess();
  };

  return (
    <div className="container" style={{ padding: '80px 0', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="fade-in" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, color: 'var(--secondary)' }}>
            MOVE<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '12px', fontWeight: 500 }}>
            {isLogin ? 'Welcome back, please sign in' : 'Create an account to start riding'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div className="input-group">
              <label>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  style={{ paddingLeft: '48px' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '-12px' }}>
              <button
                type="button"
                style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <button className="btn" style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', gap: '12px' }}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <button className="btn" style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', gap: '12px', marginTop: '12px' }}>
          <svg width="18" height="18" viewBox="0 0 814 1000" aria-hidden="true" fill="currentColor">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.8 0 228.4 0 190.5c0-98.7 54.5-150.9 106.2-150.9 55.5 0 98.7 37.5 131.8 37.5 31.8 0 81.5-40.8 145.5-40.8 22.5 0 108.1 2 166.3 82.3zm-56.8-215.5c26.3-30.8 44.5-73.5 44.5-116.2 0-5.8-.5-11.7-1.5-16.5-42.3 1.5-92.5 28.3-123.3 64-22.5 25.5-44 68.2-44 111.5 0 6.5 1 13 1.5 15 2.5.5 6.5 1 10.5 1 37.5 0 85.3-25.3 112.3-58.8z"/>
          </svg>
          Continue with Apple
        </button>

        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: 'var(--accent)',
              fontWeight: 700,
              padding: 0,
              marginLeft: '4px',
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
