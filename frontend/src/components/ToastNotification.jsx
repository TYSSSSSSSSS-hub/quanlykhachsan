import React, { useEffect } from 'react';
import { Sparkles, CheckCircle2, X, ArrowRight, BedDouble, Calendar, ArrowRightLeft } from 'lucide-react';

export const ToastNotification = ({ isOpen, onClose, title, message, details, type = 'TRANSFER' }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        // Auto dismiss after 6 seconds
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      maxWidth: '460px',
      width: 'calc(100vw - 48px)'
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
      
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '1rem',
        padding: '1.25rem',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.2)',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top glowing bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: type === 'TRANSFER' 
            ? 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)' 
            : 'linear-gradient(90deg, #2563eb 0%, #10b981 100%)'
        }}></div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          {/* Animated Icon Badge */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '0.75rem',
            background: type === 'TRANSFER' 
              ? 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
          }}>
            {type === 'TRANSFER' ? <ArrowRightLeft size={22} /> : <Sparkles size={22} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                color: '#34d399',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <CheckCircle2 size={13} /> {type === 'TRANSFER' ? 'ĐỔI PHÒNG THÀNH CÔNG' : 'ĐẶT PHÒNG THÀNH CÔNG'}
              </span>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
              >
                <X size={16} />
              </button>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 2px 0' }}>
              {title}
            </h4>

            <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
              {message}
            </p>

            {/* Custom Details Pill Box */}
            {details && (
              <div style={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
                padding: '0.625rem 0.75rem',
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                {details.oldRoom && details.newRoom && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <span style={{ color: '#f87171' }}>Phòng cũ: {details.oldRoom}</span>
                    <ArrowRight size={14} color="#94a3b8" />
                    <span style={{ color: '#34d399' }}>Phòng mới: {details.newRoom}</span>
                  </div>
                )}
                {details.guestCount && (
                  <div style={{ color: '#38bdf8' }}>👥 Số lượng khách thực tế: {details.guestCount} người</div>
                )}
                {details.bookingCode && (
                  <div style={{ color: '#fbbf24', fontWeight: 700 }}>🎟️ Mã đơn: {details.bookingCode}</div>
                )}
                <div style={{ color: '#94a3b8', fontSize: '0.6875rem', marginTop: '2px' }}>
                  ✓ Dữ liệu đã tự động đồng bộ thời gian thực (Không cần F5 trang)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
