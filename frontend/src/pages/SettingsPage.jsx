import React, { useState } from 'react';
import { Settings, Hotel, Lock, Bell, Save, ShieldCheck, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [hotelInfo, setHotelInfo] = useState({
    hotelName: 'Grand Horizon Resort & Spa (Main Wing)',
    address: '123 Ocean Boulevard, Da Nang, Vietnam',
    phone: '+84 236 399 9999',
    email: 'info@grandhorizonresort.com',
    taxRate: '10.0'
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không trùng khớp!');
      return;
    }
    try {
      await api.changePassword({
        username: user?.username || 'admin',
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPwdSuccess(true);
      setTimeout(() => setPwdSuccess(false), 3000);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert('Lỗi đổi mật khẩu: ' + err.message);
    }
  };

  const handleSaveHotelInfo = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header & Breadcrumb */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          <span>SYSTEM CONFIGURATION & SECURITY</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
          Cài Đặt Hệ Thống & Tài Khoản
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
          Quản lý thông tin thương hiệu khách sạn, bảo mật & cấu hình mật khẩu hệ thống
        </p>
      </div>

      {/* Hotel Information Form Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hotel size={20} color="#1d4ed8" /> Thông Tin Khách Sạn / Resort
          </h3>
          {saveSuccess && (
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={14} /> Đã lưu thành công!
            </span>
          )}
        </div>
        
        <form onSubmit={handleSaveHotelInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>Tên Khách Sạn / Resort</label>
            <input
              type="text"
              value={hotelInfo.hotelName}
              onChange={e => setHotelInfo({ ...hotelInfo, hotelName: e.target.value })}
              style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>Số Điện Thoại Hotline</label>
              <input
                type="text"
                value={hotelInfo.phone}
                onChange={e => setHotelInfo({ ...hotelInfo, phone: e.target.value })}
                style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>Email Liên Hệ</label>
              <input
                type="email"
                value={hotelInfo.email}
                onChange={e => setHotelInfo({ ...hotelInfo, email: e.target.value })}
                style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>Địa Chỉ</label>
            <input
              type="text"
              value={hotelInfo.address}
              onChange={e => setHotelInfo({ ...hotelInfo, address: e.target.value })}
              style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Save size={15} /> Lưu Cấu Hình Khách Sạn
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="#1d4ed8" /> Đổi Mật Khẩu Tài Khoản ({user?.username || 'admin'})
          </h3>
          {pwdSuccess && (
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={14} /> Đổi mật khẩu thành công!
            </span>
          )}
        </div>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>Mật khẩu hiện tại *</label>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              required
              style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>Mật khẩu mới *</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>Xác nhận mật khẩu mới *</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
              Cập Nhật Mật Khẩu
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
