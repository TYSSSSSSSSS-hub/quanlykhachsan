import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  BedDouble, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  Coffee, 
  BarChart3, 
  Settings, 
  LogOut,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const roleUpper = (user?.role || '').toUpperCase();
  const isReceptionist = roleUpper === 'RECEPTIONIST' || roleUpper.includes('LỄ TÂN');

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Reservations', icon: CalendarRange },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'staff', label: 'Staff & Users', icon: UserCheck, adminOnly: true },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck, adminOnly: true },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'services', label: 'Services', icon: Coffee },
    { id: 'reports', label: 'Reports', icon: BarChart3, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings, adminOnly: true },
  ];

  const menuItems = isReceptionist 
    ? allMenuItems.filter(item => !item.adminOnly)
    : allMenuItems;

  return (
    <aside style={{
      width: '230px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
      boxShadow: '2px 0 8px rgba(0,0,0,0.02)'
    }}>
      {/* Navigation Links */}
      <div style={{ padding: '0.875rem 0.75rem 0.5rem 0.75rem', fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        OPERATIONS & ADMIN
      </div>

      <nav style={{ flex: 1, padding: '0 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              <Icon size={17} color={isActive ? '#ffffff' : '#64748b'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Shift Schedule Card & Emergency Protocol */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          padding: '0.625rem 0.75rem',
          marginBottom: '0.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8' }}>SHIFT SCHEDULE</span>
            <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.625rem', padding: '0.125rem 0.375rem' }}>Active</span>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
            Morning: 07:00 - 15:00
          </div>
        </div>

        <button 
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '0.5rem',
            color: '#dc2626',
            fontWeight: 700,
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
          onClick={() => alert('Đã khởi chạy quy trình ứng phó sự cố khẩn cấp (Emergency Protocol).')}
        >
          <AlertTriangle size={14} />
          <span>Emergency Protocol</span>
        </button>

        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.5rem',
            marginTop: '0.5rem',
            backgroundColor: 'transparent',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <LogOut size={14} />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
};
