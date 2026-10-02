import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, CreditCard, ShieldCheck, CheckCircle2, BedDouble, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CustomerBookingModal = ({
  isOpen,
  onClose,
  roomType,
  availableRooms = [],
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2,
  onSuccess
}) => {
  const { user } = useAuth();

  // Setup default dates
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const defaultCheckIn = initialCheckIn ? `${initialCheckIn}T14:00` : `${todayStr}T14:00`;
  const defaultCheckOut = initialCheckOut ? `${initialCheckOut}T12:00` : `${tomorrowStr}T12:00`;

  const [checkInDateTime, setCheckInDateTime] = useState(defaultCheckIn);
  const [checkOutDateTime, setCheckOutDateTime] = useState(defaultCheckOut);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [numGuests, setNumGuests] = useState(initialGuests || 2);
  const [paymentMethod, setPaymentMethod] = useState('PAY_AT_HOTEL');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    idCard: '',
    gender: 'Nam',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update selected room and user data when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setCheckInDateTime(initialCheckIn ? `${initialCheckIn}T14:00` : `${todayStr}T14:00`);
      setCheckOutDateTime(initialCheckOut ? `${initialCheckOut}T12:00` : `${tomorrowStr}T12:00`);
      setNumGuests(initialGuests || 2);

      // Auto pick first available room
      if (availableRooms.length > 0) {
        setSelectedRoomId(availableRooms[0].id);
      } else {
        setSelectedRoomId('');
      }

      setFormData(prev => ({
        ...prev,
        fullName: user?.fullName || prev.fullName || '',
        phone: user?.phone || prev.phone || '',
        email: user?.email || prev.email || ''
      }));
    }
  }, [isOpen, roomType, availableRooms, initialCheckIn, initialCheckOut, initialGuests, user]);

  if (!isOpen || !roomType) return null;

  // Calculate nights
  const calculateNights = () => {
    const start = new Date(checkInDateTime);
    const end = new Date(checkOutDateTime);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const pricePerNight = roomType.price || roomType.basePrice || 0;
  const totalPrice = pricePerNight * nights;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Client-side validation ---
    if (!selectedRoomId) {
      setError('❌ Hạng phòng này hiện không còn phòng trống. Vui lòng chọn hạng phòng khác!');
      return;
    }

    if (!formData.fullName.trim()) {
      setError('❌ Vui lòng nhập Họ và tên khách hàng.');
      return;
    }
    if (formData.fullName.trim().length < 2) {
      setError('❌ Họ và tên phải có ít nhất 2 ký tự.');
      return;
    }

    const phoneRegex = /^[0-9+]{9,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      setError('❌ Số điện thoại không hợp lệ (chỉ gồm 9–15 chữ số, có thể bắt đầu bằng +).');
      return;
    }

    if (formData.email.trim() && !/^[A-Za-z0-9+_.-]+@(.+)$/.test(formData.email.trim())) {
      setError('❌ Địa chỉ email không đúng định dạng.');
      return;
    }

    const checkIn = new Date(checkInDateTime);
    const checkOut = new Date(checkOutDateTime);
    const now = new Date();

    if (checkIn < new Date(now.getTime() - 2 * 60 * 60 * 1000)) {
      setError('❌ Thời gian nhận phòng không thể ở trong quá khứ.');
      return;
    }
    if (checkOut <= checkIn) {
      setError('❌ Thời gian trả phòng phải sau thời gian nhận phòng.');
      return;
    }

    const diffHours = (checkOut - checkIn) / (1000 * 60 * 60);
    if (diffHours < 6) {
      setError('❌ Thời gian lưu trú tối thiểu là 6 giờ.');
      return;
    }

    const parsedGuests = Number(numGuests);
    if (!parsedGuests || parsedGuests < 1) {
      setError('❌ Số lượng khách phải ít nhất là 1 người.');
      return;
    }
    const capacity = roomType?.capacity;
    if (capacity && parsedGuests > capacity) {
      setError(`❌ Số lượng khách (${parsedGuests}) vượt quá sức chứa tối đa của phòng này (${capacity} người).`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        roomId: Number(selectedRoomId),
        guestName: formData.fullName.trim(),
        guestPhone: formData.phone.trim(),
        guestEmail: formData.email.trim() || (user?.email || ''),
        guestIdCard: formData.idCard.trim(),
        guestGender: formData.gender,
        checkInDate: checkInDateTime.length === 16 ? `${checkInDateTime}:00` : checkInDateTime,
        checkOutDate: checkOutDateTime.length === 16 ? `${checkOutDateTime}:00` : checkOutDateTime,
        numGuests: parsedGuests,
        depositAmount: 0.0,
        notes: (formData.notes ? formData.notes.trim() + ' • ' : '') + `[Khách đặt Online - ${paymentMethod === 'PAY_AT_HOTEL' ? 'Thanh toán tại khách sạn' : 'Chuyển khoản QR'}]`
      };

      const result = await api.createBooking(payload);
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      // Parse error message from backend JSON response
      let msg = err.message || 'Có lỗi xảy ra khi tạo đơn đặt phòng. Vui lòng thử lại!';
      try {
        const parsed = JSON.parse(msg);
        msg = parsed.message || msg;
      } catch (_) {}
      setError('❌ ' + msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1.25rem',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 800,
                fontSize: '0.6875rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.375rem',
                textTransform: 'uppercase'
              }}>
                {roomType.category || 'Luxury'}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Xác Nhận Đặt Phòng Trực Tuyến
              </h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              {roomType.name} • {formatCurrency(pricePerNight)} / đêm
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Room Availability Banner */}
          <div style={{
            backgroundColor: availableRooms.length > 0 ? '#f0fdf4' : '#fff1f2',
            border: availableRooms.length > 0 ? '1px solid #bbf7d0' : '1px solid #fecdd3',
            borderRadius: '0.75rem',
            padding: '0.875rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BedDouble size={20} color={availableRooms.length > 0 ? '#16a34a' : '#e11d48'} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: availableRooms.length > 0 ? '#166534' : '#9f1239' }}>
                  {availableRooms.length > 0 
                    ? `Hiện có ${availableRooms.length} phòng trống sẵn sàng đón khách`
                    : 'Rất tiếc! Hạng phòng này hiện đã kín phòng'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {availableRooms.length > 0 ? 'Hệ thống tự động ưu tiên gán phòng đẹp nhất cho bạn' : 'Vui lòng chọn loại phòng khác'}
                </div>
              </div>
            </div>

            {availableRooms.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Gán phòng:</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #86efac',
                    borderRadius: '0.375rem',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#166534'
                  }}
                >
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Phòng {r.roomNumber} (Tầng {r.floor || 1})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Dates & Guests Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                📅 Thời Gian Nhận Phòng (Check-in) *
              </label>
              <input
                type="datetime-local"
                value={checkInDateTime}
                onChange={(e) => setCheckInDateTime(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                📅 Thời Gian Trả Phòng (Check-out) *
              </label>
              <input
                type="datetime-local"
                value={checkOutDateTime}
                onChange={(e) => setCheckOutDateTime(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                👥 Số Lượng Khách
              </label>
              <select
                value={numGuests}
                onChange={(e) => setNumGuests(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              >
                <option value={1}>1 Khách</option>
                <option value={2}>2 Khách</option>
                <option value={3}>3 Khách</option>
                <option value={4}>4 Khách</option>
                <option value={5}>5 Khách</option>
              </select>
            </div>
          </div>

          {/* Guest Contact Information */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              👤 Thông Tin Khách Đặt Phòng
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lê Hoàng Khách"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  Số Điện Thoại Liên Hệ *
                </label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0988776655"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  Email Nhận Xác Nhận
                </label>
                <input
                  type="email"
                  placeholder="khachhang@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  Số CCCD / Hộ Chiếu
                </label>
                <input
                  type="text"
                  placeholder="012345678901 (không bắt buộc)"
                  value={formData.idCard}
                  onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                Yêu Cầu Đặc Biệt / Ghi Chú
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Giường đôi lớn, phòng tầng cao, check-in muộn sau 18h..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              💳 Phương Thức Thanh Toán
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => setPaymentMethod('PAY_AT_HOTEL')}
                style={{
                  border: paymentMethod === 'PAY_AT_HOTEL' ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                  backgroundColor: paymentMethod === 'PAY_AT_HOTEL' ? '#eff6ff' : '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: paymentMethod === 'PAY_AT_HOTEL' ? '5px solid #1d4ed8' : '2px solid #94a3b8'
                }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>Thanh toán tại quầy</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Thanh toán trực tiếp khi nhận phòng</div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('QR_TRANSFER')}
                style={{
                  border: paymentMethod === 'QR_TRANSFER' ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                  backgroundColor: paymentMethod === 'QR_TRANSFER' ? '#eff6ff' : '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: paymentMethod === 'QR_TRANSFER' ? '5px solid #1d4ed8' : '2px solid #94a3b8'
                }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>Chuyển khoản QR / Thẻ</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Xác nhận giữ phòng tức thì</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div style={{
            backgroundColor: '#f1f5f9',
            borderRadius: '0.75rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px dashed #cbd5e1'
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                Đơn giá: <strong>{formatCurrency(pricePerNight)}</strong> × <strong>{nights} đêm</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                ✓ Miễn phí hủy phòng trước 24h • Không phụ phí ẩn
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Tổng Tiền Thanh Toán
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1d4ed8' }}>
                {formatCurrency(totalPrice)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={loading || availableRooms.length === 0}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: availableRooms.length === 0 ? '#94a3b8' : '#1d4ed8',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: availableRooms.length === 0 || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)'
              }}
            >
              {loading ? (
                <span>Đang xử lý đặt phòng...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Xác Nhận Đặt Phòng</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
