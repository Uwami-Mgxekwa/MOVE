import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Phone, KeyRound } from 'lucide-react';
import { apiLogin, apiRegister, apiSendOtp, apiVerifyOtp, apiSendPasswordReset, apiConfirmPasswordReset } from '../api';

interface LoginProps {
  onLoginSuccess: (userId: number, name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'phone' | 'otp' | 'done'>('phone');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Restore remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // For signup, require OTP verification first
    if (!isLogin && !otpVerified) {
      setError('Please verify your phone number first.');
      return;
    }
    setLoading(true);
    try {
      const data = isLogin
        ? await apiLogin(email, password)
        : await apiRegister(name, email, password);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', String(data.userId));
        localStorage.setItem('userName', data.name);
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        onLoginSuccess(data.userId, data.name);
      } else {
        setError(data.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) { setError('Enter your phone number first.'); return; }
    setError('');
    setOtpLoading(true);
    try {
      const res = await apiSendOtp(phone);
      if (res.sent) { setOtpSent(true); }
      else { setError(res.error ?? 'Failed to send OTP.'); }
    } catch {
      setError('Could not send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setOtpLoading(true);
    try {
      const res = await apiVerifyOtp(phone, otp);
      if (res.verified) { setOtpVerified(true); }
      else { setError('Incorrect code. Please try again.'); }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
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
            <>
              <div className="input-group">
                <label>FULL NAME</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Sipho Dlamini" value={name}
                    onChange={(e) => setName(e.target.value)} autoComplete="name"
                    style={{ paddingLeft: '48px' }} required />
                </div>
              </div>

              <div className="input-group">
                <label>PHONE NUMBER</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Phone size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                    <input type="tel" placeholder="+27 82 555 0100" value={phone}
                      onChange={(e) => { setPhone(e.target.value); setOtpSent(false); setOtpVerified(false); }}
                      autoComplete="tel" disabled={otpVerified}
                      style={{ paddingLeft: '48px', border: otpVerified ? '1px solid #34a853' : undefined }} required />
                  </div>
                  {!otpVerified && (
                    <button type="button" onClick={handleSendOtp} disabled={otpLoading || !phone.trim()}
                      style={{ padding: '0 16px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', flexShrink: 0, opacity: !phone.trim() ? 0.6 : 1 }}>
                      {otpLoading ? '…' : otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  )}
                  {otpVerified && (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#34a853', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>✓ Verified</div>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="input-group">
                  <label>VERIFICATION CODE</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <KeyRound size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                      <input type="text" placeholder="123456" value={otp} maxLength={6}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        style={{ paddingLeft: '48px', letterSpacing: '0.2em', fontWeight: 700 }} />
                    </div>
                    <button type="button" onClick={handleVerifyOtp} disabled={otpLoading || otp.length < 6}
                      style={{ padding: '0 16px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', flexShrink: 0, opacity: otp.length < 6 ? 0.6 : 1 }}>
                      {otpLoading ? '…' : 'Verify'}
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Code sent to {phone}
                  </div>
                </div>
              )}
            </>
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
                autoComplete="email"
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
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {isLogin && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: '18px', height: '18px', borderRadius: '5px', border: `2px solid ${rememberMe ? 'var(--accent)' : '#ccc'}`,
                    backgroundColor: rememberMe ? 'var(--accent)' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer'
                  }}
                >
                  {rememberMe && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                Remember me
              </label>
              <button type="button" onClick={() => setShowForgot(true)} style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
            {loading ? 'Please wait…' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={20} />}
          </button>

          {error && (
            <div style={{ fontSize: '13px', color: 'var(--error)', textAlign: 'center', fontWeight: 600 }}>{error}</div>
          )}
        </form>

        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--accent)', fontWeight: 700, padding: 0, marginLeft: '4px' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>

      {/* Forgot Password Sheet */}
      {showForgot && (
        <div onClick={() => setShowForgot(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '32px 24px 48px' }}>
            <div style={{ fontWeight: 900, fontSize: '18px', marginBottom: '6px' }}>Reset Password</div>
            <div style={{ fontSize: '13px', color: '#a1a1a1', marginBottom: '28px' }}>
              {forgotStep === 'phone' && 'Enter the phone number linked to your account'}
              {forgotStep === 'otp' && 'Enter the code sent to your phone and your new password'}
              {forgotStep === 'done' && 'Your password has been reset successfully'}
            </div>

            {forgotStep === 'phone' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="+27 82 555 0100" type="tel"
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e2e2', borderRadius: '12px', fontSize: '15px', fontFamily: 'inherit' }} />
                {forgotError && <div style={{ fontSize: '13px', color: '#ea4335' }}>{forgotError}</div>}
                <button onClick={async () => {
                  setForgotLoading(true); setForgotError('');
                  const res = await apiSendPasswordReset(forgotPhone).catch(() => ({ sent: false }));
                  setForgotLoading(false);
                  if (res.sent) setForgotStep('otp');
                  else setForgotError('Could not send code. Please try again.');
                }} className="btn btn-primary" disabled={forgotLoading || !forgotPhone.trim()}>
                  {forgotLoading ? 'Sending…' : 'Send Reset Code'}
                </button>
              </div>
            )}

            {forgotStep === 'otp' && (
              <form onSubmit={(e) => { e.preventDefault(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code" maxLength={6} autoComplete="one-time-code"
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e2e2', borderRadius: '12px', fontSize: '20px', fontFamily: 'inherit', letterSpacing: '0.3em', textAlign: 'center', fontWeight: 700 }} />
                <input value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="New password" type="password" autoComplete="new-password"
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e2e2', borderRadius: '12px', fontSize: '15px', fontFamily: 'inherit' }} />
                {forgotError && <div style={{ fontSize: '13px', color: '#ea4335' }}>{forgotError}</div>}
                <button type="submit" onClick={async () => {
                  setForgotLoading(true); setForgotError('');
                  const res = await apiConfirmPasswordReset(forgotPhone, forgotOtp, forgotNewPassword).catch(() => ({ success: false }));
                  setForgotLoading(false);
                  if (res.success) setForgotStep('done');
                  else setForgotError(res.error ?? 'Invalid code. Please try again.');
                }} className="btn btn-primary" disabled={forgotLoading || forgotOtp.length < 6 || !forgotNewPassword.trim()}>
                  {forgotLoading ? 'Resetting…' : 'Reset Password'}
                </button>
              </form>
            )}

            {forgotStep === 'done' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✓</div>
                <div style={{ fontWeight: 700, marginBottom: '20px' }}>Password reset successfully!</div>
                <button onClick={() => { setShowForgot(false); setForgotStep('phone'); setForgotPhone(''); setForgotOtp(''); setForgotNewPassword(''); }}
                  className="btn btn-primary">Back to Sign In</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
