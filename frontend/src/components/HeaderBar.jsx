import React from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  LayoutGrid, 
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HeaderBar = ({ onOpenBookingModal, activeTab, setActiveTab }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
    }}>
      {/* Left: Brand & Hotel Branch Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '0.625rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
          }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              Grand Horizon
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#2563eb', fontWeight: 700 }}>
              FRONT DESK PORTAL
            </div>
          </div>
        </div>

        {/* Branch Selector Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '0.375rem 0.75rem',
          fontSize: '0.8125rem',
          color: '#475569',
          cursor: 'pointer'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Front Desk</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Grand Horizon Resort & Spa (Main Wing)</span>
          <ChevronDown size={14} color="#64748b" />
        </div>

        {/* Global Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '0.375rem 0.75rem',
          width: '220px'
        }}>
          <Search size={16} color="#94a3b8" />
          <input 
            type="text"
            placeholder="Console Search..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: '0.8125rem',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Right: Quick Action Buttons & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          onClick={onOpenBookingModal}
          className="btn btn-primary"
          style={{ height: '38px', padding: '0 1rem', fontSize: '0.8125rem', fontWeight: 700 }}
        >
          <Plus size={16} />
          <span>+ New Walk-in / Reservation</span>
        </button>

        <button 
          onClick={() => setActiveTab('rooms')}
          className="btn btn-outline"
          style={{ height: '38px', padding: '0 0.875rem', fontSize: '0.8125rem', fontWeight: 600 }}
        >
          <LayoutGrid size={15} color="#2563eb" />
          <span>Room Status Board</span>
        </button>

        <div style={{
          width: '1px',
          height: '24px',
          backgroundColor: '#e2e8f0',
          margin: '0 0.25rem'
        }}></div>

        {/* User Profile Avatar Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.25rem 0.625rem',
          borderRadius: '0.5rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8125rem'
          }}>
            {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'SJ'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
              {user?.fullName || 'Sarah Jenkins'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
              {user?.role || 'Front Desk Manager'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
