import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { strength: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { label: 'Very Weak', color: 'var(--danger)' },
      { label: 'Weak', color: '#f97316' },
      { label: 'Fair', color: 'var(--warning)' },
      { label: 'Strong', color: 'var(--success)' },
      { label: 'Very Strong', color: '#06b6d4' },
    ];
    return { strength: (score / 5) * 100, ...levels[Math.min(score - 1, 4)] };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setApiError('');
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password, phone: form.phone });
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const validationMessage = data?.errors?.map((item) => item.msg).filter(Boolean).join(' ');
      const forbiddenMessage = err.response?.status === 403
        ? 'The API returned 403 Forbidden. Registration is public in CreditWise; check that port 5001 is running this project’s backend at /api/health.'
        : '';
      setApiError(data?.message || validationMessage || forbiddenMessage || (!err.response || err.response.status >= 500
        ? 'The CreditWise API could not complete registration. Confirm the backend is running and MySQL is connected, then try again.'
        : 'Registration failed. Check your details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength();

  return (
    <div>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card slide-up" style={{ maxWidth: '500px' }}>
          <div className="auth-logo">
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✨</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '4px' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join CreditWise and manage your cards smarter</p>
          </div>

          {apiError && (
            <div className="alert-cw alert-error">
              <i className="fas fa-circle-exclamation"></i> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group-cw">
                <label className="form-label-cw">Full Name *</label>
                <input type="text" id="name" className="form-control-cw" placeholder="John Doe"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group-cw">
                <label className="form-label-cw">Phone (Optional)</label>
                <input type="tel" id="phone" className="form-control-cw" placeholder="+91 9876543210"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="form-group-cw">
              <label className="form-label-cw">Email Address *</label>
              <input type="email" id="email" className="form-control-cw" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group-cw">
              <label className="form-label-cw">Password *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} id="password" className="form-control-cw"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pwStrength.strength}%`, background: pwStrength.color, transition: 'all 0.3s ease', borderRadius: '2px' }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: pwStrength.color, marginTop: '4px' }}>{pwStrength.label}</div>
                </div>
              )}
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group-cw">
              <label className="form-label-cw">Confirm Password *</label>
              <input type="password" id="confirmPassword" className="form-control-cw" placeholder="Re-enter your password"
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              {form.confirmPassword && form.password === form.confirmPassword && (
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px' }}>
                  <i className="fas fa-check"></i> Passwords match
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary-cw" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginBottom: '20px' }} disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> Creating...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
