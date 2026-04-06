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
          Continue with Google
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
