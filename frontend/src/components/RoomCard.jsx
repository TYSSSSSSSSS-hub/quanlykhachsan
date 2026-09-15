import React from 'react';
import { Bed, User, Wrench, Sparkles, CheckCircle2, Coffee, Receipt, ArrowRightLeft } from 'lucide-react';

export const RoomCard = ({ room, onSelectRoom, onOrderService, onCheckout }) => {
  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'AVAILABLE':
        return <span className="badge badge-available">● Available</span>;
      case 'OCCUPIED':
        return <span className="badge badge-occupied">● Occupied</span>;
      case 'RESERVED':
        return <span className="badge badge-reserved">● Reserved</span>;
      case 'CLEANING':
        return <span className="badge badge-cleaning">● Cleaning</span>;
      case 'MAINTENANCE':
        return <span className="badge badge-maintenance">● Maintenance</span>;
      default:
        return <span className="badge badge-maintenance">{status}</span>;
    }
  };

  const getCardBorder = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'AVAILABLE': return '1px solid #cbd5e1';
      case 'OCCUPIED': return '1px solid #2563eb';
      case 'RESERVED': return '1px solid #f59e0b';
      case 'CLEANING': return '1px solid #ea580c';
      default: return '1px solid #e2e8f0';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const currentStatusUpper = (room.status || '').toUpperCase();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '0.875rem',
      border: getCardBorder(room.status),
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* Room Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {room.roomNumber}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>
            {room.roomType?.name}
          </div>
        </div>
        {getStatusBadge(room.status)}
      </div>

      {/* Room Details */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        fontSize: '0.8125rem',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Tầng:</span>
          <strong style={{ color: '#0f172a' }}>Tầng {room.floor}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Sức chứa:</span>
          <strong style={{ color: '#0f172a' }}>{room.roomType?.capacity || 2} Khách</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Giá theo đêm:</span>
          <strong style={{ color: '#10b981', fontSize: '0.9375rem' }}>
            {formatCurrency(room.roomType?.basePrice || 0)}
          </strong>
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {currentStatusUpper === 'AVAILABLE' && (
          <button 
            className="btn btn-primary"
            style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem', fontWeight: 700 }}
            onClick={() => onSelectRoom(room, 'CHECKIN')}
          >
            Nhận Phòng Nhanh
          </button>
        )}

        {currentStatusUpper === 'OCCUPIED' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline"
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
                onClick={() => onOrderService(room)}
              >
                <Coffee size={14} /> Dịch Vụ
              </button>
              <button 
                className="btn btn-danger"
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
                onClick={() => onCheckout(room)}
              >
                <Receipt size={14} /> Trả Phòng
              </button>
            </div>
            <button 
              className="btn btn-warning"
              style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.5rem', backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
              onClick={() => onSelectRoom(room, 'TRANSFER_ROOM')}
            >
              <ArrowRightLeft size={14} /> 🔄 Đổi / Nâng Phòng (Thêm Người)
            </button>
          </div>
        )}

        {currentStatusUpper === 'RESERVED' && (
          <button 
            className="btn btn-success"
            style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem', fontWeight: 700 }}
            onClick={() => onSelectRoom(room, 'CHECKIN_RESERVED')}
          >
            Check-in Đơn Đặt
          </button>
        )}

        {(currentStatusUpper === 'CLEANING' || currentStatusUpper === 'MAINTENANCE') && (
          <button 
            className="btn btn-success"
            style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem', fontWeight: 700 }}
            onClick={() => onSelectRoom(room, 'MARK_AVAILABLE')}
          >
            <CheckCircle2 size={16} /> Đã Dọn Xong (Đổi Sang Trống)
          </button>
        )}
      </div>
    </div>
  );
};
