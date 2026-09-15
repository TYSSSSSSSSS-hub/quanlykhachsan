import React from 'react';
import { Bell, Search, Clock, PlusCircle } from 'lucide-react';

export const Navbar = ({ onOpenBookingModal }) => {
  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Date & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <Clock size={16} color="var(--color-gold)" />
          <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{todayFormatted}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onOpenBookingModal}
          className="btn btn-primary"
        >
          <PlusCircle size={18} />
          <span>Đặt Phòng Nhanh</span>
        </button>

        <div style={{
          position: 'relative',
          padding: '0.5rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold)'
          }}></span>
        </div>
      </div>
    </header>
  );
};
