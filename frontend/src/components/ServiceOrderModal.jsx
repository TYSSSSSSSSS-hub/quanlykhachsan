import React, { useState, useEffect } from 'react';
import { X, Plus, Coffee, Check } from 'lucide-react';
import { api } from '../services/api';

export const ServiceOrderModal = ({ isOpen, onClose, room, onSuccess }) => {
  const [services, setServices] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderedServices, setOrderedServices] = useState([]);

  useEffect(() => {
    if (isOpen && room) {
      api.getServices().then(data => {
        setServices(data);
        if (data.length > 0) setSelectedServiceId(data[0].id);
      });

      api.getBookings().then(bookings => {
        const active = bookings.find(b => b.room.id === room.id && b.status === 'CHECKED_IN');
        if (active) {
          setActiveBooking(active);
          api.getBookingServices(active.id).then(setOrderedServices);
        }
      });
    }
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const selectedServiceObj = services.find(s => s.id === Number(selectedServiceId));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!activeBooking) {
      alert('Không tìm thấy đơn check-in hợp lệ cho phòng này!');
      return;
    }

    try {
      await api.orderService({
        bookingId: activeBooking.id,
        serviceId: Number(selectedServiceId),
        quantity: Number(quantity)
      });
      const updatedList = await api.getBookingServices(activeBooking.id);
      setOrderedServices(updatedList);
      if (onSuccess) onSuccess();
      alert('Thêm dịch vụ vào phòng thành công!');
    } catch (err) {
      alert('Lỗi đặt dịch vụ: ' + err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Gọi Dịch Vụ - Phòng {room.roomNumber}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gold)', fontWeight: 600, marginTop: '2px' }}>
              Khách hàng: {activeBooking?.guest?.fullName || 'Đang ở'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Order Form */}
        <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Chọn Dịch Vụ
            </label>
            <select
              className="input-field"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.category}] {s.name} - {formatCurrency(s.price)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Số lượng
              </label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
              <Plus size={18} /> Thêm Vào Đơn Phòng
            </button>
          </div>
        </form>

        {/* Ordered Services List */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Danh Sách Dịch Vụ Đã Gọi ({orderedServices.length})
          </h4>
          
          {orderedServices.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
              Chưa có dịch vụ bổ sung nào.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {orderedServices.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.625rem 0.875rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{item.service?.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {item.quantity} x {formatCurrency(item.service?.price)}
                    </div>
                  </div>
                  <strong style={{ color: 'var(--color-gold)' }}>
                    {formatCurrency(item.totalPrice)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
