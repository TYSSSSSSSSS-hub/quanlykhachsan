import React, { useState } from 'react';
import { Building2, Lock, User, ArrowRight, ShieldCheck, UserPlus, Phone, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const LoginPage = () => {
  const { login } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register state for Customer
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await login({ username, password });
    } catch (err) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await api.register({
        username: regUsername,
        password: regPassword,
        fullName: regFullName,
        phone: regPhone,
        email: regEmail
      });
      setSuccessMsg('🎉 Đăng ký tài khoản Khách hàng thành công! Đang tự động đăng nhập...');
      setTimeout(async () => {
        await login({ username: regUsername, password: regPassword });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Đăng ký tài khoản không thành công. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleType) => {
    if (roleType === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (roleType === 'letan') {
      setUsername('letan01');
      setPassword('admin123');
    } else if (roleType === 'staff') {
      setUsername('staff01');
      setPassword('admin123');
    } else if (roleType === 'customer') {
      setUsername('khach01');
      setPassword('admin123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1.25rem',
        width: '100%',
        maxWidth: isRegisterMode ? '500px' : '480px',
        padding: '2.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        transition: 'all 0.3s ease'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '0.75rem',
            boxShadow: '0 8px 16px rgba(29, 78, 216, 0.25)'
          }}>
            <Building2 size={32} />
          </div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            LUXURY HOSPITALITY & PMS SUITE
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            GRAND HORIZON
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px' }}>
            Hệ Thống Quản Lý & Đặt Phòng Khách Sạn 5 Sao
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '0.5rem',
          padding: '4px',
          marginBottom: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: !isRegisterMode ? '#1d4ed8' : 'transparent',
              color: !isRegisterMode ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🔑 Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: isRegisterMode ? '#1d4ed8' : 'transparent',
              color: isRegisterMode ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ✨ Đăng Ký Khách Hàng
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#166534',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {!isRegisterMode && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                Tên đăng nhập hoặc Email *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                padding: '0.55rem 0.875rem',
                gap: '0.625rem'
              }}>
                <User size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder="admin, letan01, staff01, khach01..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#0f172a',
                    width: '100%',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                Mật khẩu *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                padding: '0.55rem 0.875rem',
                gap: '0.625rem'
              }}>
                <Lock size={18} color="#64748b" />
                <input
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#0f172a',
                    width: '100%',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>
            </div>

            {/* Quick Demo Role Selector */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              marginTop: '0.25rem'
            }}>
              <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                ⚡ CHỌN NHANH 4 TÁC NHÂN ĐỂ TEST:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  style={{
                    backgroundColor: username === 'admin' ? '#1d4ed8' : '#ffffff',
                    color: username === 'admin' ? '#ffffff' : '#334155',
                    border: username === 'admin' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.35rem 0.25rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('letan')}
                  style={{
                    backgroundColor: username === 'letan01' ? '#1d4ed8' : '#ffffff',
                    color: username === 'letan01' ? '#ffffff' : '#334155',
                    border: username === 'letan01' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.35rem 0.25rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  🛎️ Lễ Tân
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('staff')}
                  style={{
                    backgroundColor: username === 'staff01' ? '#1d4ed8' : '#ffffff',
                    color: username === 'staff01' ? '#ffffff' : '#334155',
                    border: username === 'staff01' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.35rem 0.25rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  🧹 Staff
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer')}
                  style={{
                    backgroundColor: username === 'khach01' ? '#1d4ed8' : '#ffffff',
                    color: username === 'khach01' ? '#ffffff' : '#334155',
                    border: username === 'khach01' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.35rem 0.25rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  🏖️ Khách
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                backgroundColor: '#1d4ed8',
                borderColor: '#1d4ed8',
                color: '#ffffff',
                padding: '0.6875rem',
                borderRadius: '0.5rem',
                fontWeight: 800,
                fontSize: '0.9375rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(29, 78, 216, 0.2)'
              }}
            >
              {loading ? 'Đang kết nối...' : 'Xác Nhận Đăng Nhập'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* MODE 2: REGISTER FORM */}
        {isRegisterMode && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Họ và Tên Quý Khách *
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                required
                style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Email Liên Hệ *
                </label>
                <input
                  type="email"
                  placeholder="guest@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Tên Đăng Nhập *
                </label>
                <input
                  type="text"
                  placeholder="khachvip01"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Mật Khẩu *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                backgroundColor: '#1d4ed8',
                borderColor: '#1d4ed8',
                color: '#ffffff',
                padding: '0.6875rem',
                borderRadius: '0.5rem',
                fontWeight: 800,
                fontSize: '0.9375rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Đang tạo...' : 'Tạo Tài Khoản & Vào Đặt Phòng'} <UserPlus size={18} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
