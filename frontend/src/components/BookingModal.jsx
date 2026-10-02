import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, CreditCard, Mail, Check } from 'lucide-react';
import { api } from '../services/api';

export const BookingModal = ({ isOpen, onClose, initialRoom, onSuccess }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [isWalkIn, setIsWalkIn] = useState(true);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestIdCard: '',
    guestEmail: '',
    guestGender: 'Nam',
    checkInDate: new Date().toISOString().slice(0, 16),
    checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    numGuests: 1,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      api.getRooms().then(data => {
        setRooms(data);
        if (initialRoom) {
          setSelectedRoomId(initialRoom.id);
        } else if (data.length > 0) {
          const avail = data.find(r => r.status === 'AVAILABLE');
          setSelectedRoomId(avail ? avail.id : data[0].id);
        }
      });
    }
  }, [isOpen, initialRoom]);

  if (!isOpen) return null;

  const selectedRoomObj = rooms.find(r => r.id === Number(selectedRoomId));

  const calculateDays = () => {
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const estimatedCost = selectedRoomObj?.roomType?.basePrice ? selectedRoomObj.roomType.basePrice * days : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // --- Client-side validation ---
    if (!selectedRoomId) {
      setFormError('❌ Vui lòng chọn phòng.');
      return;
    }
    if (!formData.guestName.trim() || formData.guestName.trim().length < 2) {
      setFormError('❌ Họ và tên khách phải có ít nhất 2 ký tự.');
      return;
    }
    const phoneRegex = /^[0-9+]{9,15}$/;
    if (!formData.guestPhone.trim() || !phoneRegex.test(formData.guestPhone.trim())) {
      setFormError('❌ Số điện thoại không hợp lệ (9–15 chữ số, có thể bắt đầu bằng +).');
      return;
    }
    if (formData.guestEmail && formData.guestEmail.trim() && !/^[A-Za-z0-9+_.-]+@(.+)$/.test(formData.guestEmail.trim())) {
      setFormError('❌ Địa chỉ email không đúng định dạng.');
      return;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    if (!formData.checkInDate || !formData.checkOutDate) {
      setFormError('❌ Vui lòng nhập đầy đủ ngày nhận phòng và trả phòng.');
      return;
    }
    if (checkOut <= checkIn) {
      setFormError('❌ Thời gian trả phòng phải sau thời gian nhận phòng.');
      return;
    }

    const numGuests = Number(formData.numGuests);
    if (numGuests < 1) {
      setFormError('❌ Số lượng khách phải ít nhất là 1.');
      return;
    }
    const selectedRoom = rooms.find(r => r.id === Number(selectedRoomId));
    const cap = selectedRoom?.roomType?.capacity;
    if (cap && numGuests > cap) {
      setFormError(`❌ Số khách (${numGuests}) vượt sức chứa tối đa của phòng này (${cap} người).`);
      return;
    }

    try {
      const checkInFormatted = formData.checkInDate && formData.checkInDate.length === 16
        ? `${formData.checkInDate}:00`
        : formData.checkInDate;
      const checkOutFormatted = formData.checkOutDate && formData.checkOutDate.length === 16
        ? `${formData.checkOutDate}:00`
        : formData.checkOutDate;

      const payload = {
        ...formData,
        checkInDate: checkInFormatted,
        checkOutDate: checkOutFormatted,
        roomId: Number(selectedRoomId)
      };

      if (isWalkIn) {
        await api.walkInCheckIn(payload);
      } else {
        await api.createBooking(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      let msg = err.message || 'Lỗi tạo đơn đặt phòng.';
      try { const p = JSON.parse(msg); msg = p.message || msg; } catch (_) {}
      setFormError('❌ ' + msg);
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
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isWalkIn ? 'Nhận Phòng Nhanh (Walk-in Check-in)' : 'Tạo Đơn Đặt Phòng Mới'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Nhập thông tin khách hàng và thông tin thời gian lưu trú
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Type Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`btn ${isWalkIn ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => setIsWalkIn(true)}
          >
            Check-in Nhận Phòng Ngay
          </button>
          <button
            type="button"
            className={`btn ${!isWalkIn ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => setIsWalkIn(false)}
          >
            Đặt Trước (Reservation)
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Validation Error Banner */}
          {formError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              color: '#ef4444',
              fontWeight: 600
            }}>
              {formError}
            </div>
          )}
          {/* Room Selection */}

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-gold)' }}>
              Chọn Phòng Khách Sạn
            </label>
            <select
              className="input-field"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              required
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  Phòng {room.roomNumber} - {room.roomType?.name} ({formatCurrency(room.roomType?.basePrice || 0)}/đêm) - Trạng thái: {room.status}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Họ và Tên Khách *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Nguyễn Văn A"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Số Điện Thoại *
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="0987654321"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Số CCCD / Hộ Chiếu
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="012345678901"
                value={formData.guestIdCard}
                onChange={(e) => setFormData({ ...formData, guestIdCard: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="khachhang@email.com"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              />
            </div>
          </div>

          {/* Date Picker */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Ngày Check-in *
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Ngày Check-out *
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Ghi Chú Yêu Cầu
            </label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="Ví dụ: Cần thêm gối, yêu cầu phòng yên tĩnh..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Summary Box */}
          <div style={{
            backgroundColor: 'rgba(251, 191, 36, 0.08)',
            border: '1px dashed rgba(251, 191, 36, 0.3)',
            borderRadius: '0.5rem',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Thời gian lưu trú: <strong>{days} Đêm</strong>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Đơn giá: {formatCurrency(selectedRoomObj?.roomType?.basePrice || 0)} / Đêm
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tổng Tiền Dự Kiến</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                {formatCurrency(estimatedCost)}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              <span>Xác Nhận {isWalkIn ? 'Nhận Phòng' : 'Đặt Phòng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
