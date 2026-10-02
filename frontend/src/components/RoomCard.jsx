import React from 'react';
import { Bed, User, Wrench, Sparkles, CheckCircle2, Coffee, Receipt, ArrowRightLeft, Edit3, Trash2, Ban } from 'lucide-react';

export const RoomCard = ({ room, onSelectRoom, onOrderService, onCheckout, onEditRoom, onDeleteRoom, onToggleMaintenance }) => {
  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'AVAILABLE':
        return <span className="badge badge-available">● Sẵn sàng (Available)</span>;
      case 'OCCUPIED':
        return <span className="badge badge-occupied">● Đang ở (Occupied)</span>;
      case 'RESERVED':
        return <span className="badge badge-reserved">● Đã đặt (Reserved)</span>;
      case 'CLEANING':
        return <span className="badge badge-cleaning">● Đang dọn (Cleaning)</span>;
      case 'MAINTENANCE':
        return <span className="badge badge-maintenance" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>● Ngừng HĐ / Bảo trì</span>;
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
      case 'MAINTENANCE': return '1px solid #ef4444';
      default: return '1px solid #e2e8f0';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const currentStatusUpper = (room.status || '').toUpperCase();

  return (
    <div style={{
      backgroundColor: currentStatusUpper === 'MAINTENANCE' ? '#fffbfa' : '#ffffff',
      borderRadius: '0.875rem',
      border: getCardBorder(room.status),
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'relative'
    }}>
      {/* Room Header with Quick Admin Actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {room.roomNumber}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>
            {room.roomType?.name || 'Hạng phòng chưa gán'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem' }}>
          {getStatusBadge(room.status)}
          
          {/* Quick Edit/Delete buttons */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {onEditRoom && (
              <button
                onClick={() => onEditRoom(room)}
                title="Chỉnh sửa thông tin phòng"
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.25rem 0.4rem',
                  cursor: 'pointer',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Edit3 size={13} />
              </button>
            )}

            {onDeleteRoom && (
              <button
                onClick={() => onDeleteRoom(room)}
                title="Xóa phòng"
                style={{
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '0.375rem',
                  padding: '0.25rem 0.4rem',
                  cursor: 'pointer',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
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
          <strong style={{ color: '#0f172a' }}>Tầng {room.floor || 1}</strong>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                <ArrowRightLeft size={14} /> 🔄 Đổi Phòng (Thêm Người)
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

          {currentStatusUpper === 'CLEANING' && (
            <button 
              className="btn btn-success"
              style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem', fontWeight: 700 }}
              onClick={() => onSelectRoom(room, 'MARK_AVAILABLE')}
            >
              <CheckCircle2 size={16} /> Đã Dọn Xong (Đổi Sang Trống)
            </button>
          )}

          {currentStatusUpper === 'MAINTENANCE' && (
            <button 
              className="btn btn-success"
              style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem', fontWeight: 700, backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#fff' }}
              onClick={() => onToggleMaintenance && onToggleMaintenance(room, 'AVAILABLE')}
            >
              <CheckCircle2 size={16} /> Kích Hoạt Lại (Sẵn Sàng Đón Khách)
            </button>
          )}
        </div>

        {/* Manager Maintenance / Out of service toggle */}
        {currentStatusUpper === 'AVAILABLE' && onToggleMaintenance && (
          <button
            onClick={() => onToggleMaintenance(room, 'MAINTENANCE')}
            style={{
              background: '#fef2f2',
              border: '1px dashed #fca5a5',
              color: '#dc2626',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.35rem 0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}
          >
            <Ban size={13} /> Tạm Ngừng Hoạt Động (Bảo Trì)
          </button>
        )}
      </div>
    </div>
  );
};
