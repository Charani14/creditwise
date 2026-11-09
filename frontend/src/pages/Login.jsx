import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setApiError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const validationMessage = data?.errors?.map((item) => item.msg).filter(Boolean).join(' ');
      setApiError(data?.message || validationMessage || (!err.response || err.response.status >= 500
        ? 'The CreditWise API is unavailable. Confirm the backend is running and MySQL is connected, then try again.'
        : 'Login failed. Check your details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card slide-up">
          <div className="auth-logo">
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💳</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '4px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to your CreditWise account</p>
          </div>

          {apiError && (
            <div className="alert-cw alert-error">
              <i className="fas fa-circle-exclamation"></i> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group-cw">
              <label className="form-label-cw">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control-cw"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <div className="form-error"><i className="fas fa-triangle-exclamation"></i> {errors.email}</div>}
            </div>

            <div className="form-group-cw">
              <label className="form-label-cw">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  className="form-control-cw"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.password && <div className="form-error"><i className="fas fa-triangle-exclamation"></i> {errors.password}</div>}
            </div>

            <button type="submit" className="btn-primary-cw" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginBottom: '20px' }} disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> Signing in...</> : <><i className="fas fa-sign-in-alt"></i> Sign In</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
