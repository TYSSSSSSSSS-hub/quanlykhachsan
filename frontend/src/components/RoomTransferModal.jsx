import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Users, AlertCircle, CheckCircle2, BedDouble, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const RoomTransferModal = ({ isOpen, onClose, booking, currentRoom, onSuccess }) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [newNumGuests, setNewNumGuests] = useState(booking?.numGuests || currentRoom?.roomType?.capacity || 2);
  const [reason, setReason] = useState('Phát sinh thêm người / Nâng cấp phòng');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAvailableRooms();
      if (booking?.numGuests) {
        setNewNumGuests(booking.numGuests);
      }
    }
  }, [isOpen, booking]);

  const loadAvailableRooms = async () => {
    try {
      const allRooms = await api.getRooms();
      // Filter rooms that are AVAILABLE (or case-insensitive) and not current room
      const currentRoomId = currentRoom?.id || booking?.room?.id;
      const filtered = allRooms.filter(r => {
        const isAvail = (r.status || '').toUpperCase() === 'AVAILABLE';
        return isAvail && r.id !== currentRoomId;
      });
      setAvailableRooms(filtered);
      if (filtered.length > 0) {
        setSelectedRoomId(filtered[0].id.toString());
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách phòng trống:', err);
    }
  };

  if (!isOpen) return null;

  const currentRoomObj = currentRoom || booking?.room;
  const targetRoomObj = availableRooms.find(r => r.id.toString() === selectedRoomId.toString());

  const currentPrice = currentRoomObj?.roomType?.basePrice || 0;
  const targetPrice = targetRoomObj?.roomType?.basePrice || 0;
  const priceDiff = targetPrice - currentPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) {
      setError('Vui lòng chọn phòng mới cần đổi!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingIdToUse = booking?.id || 0;
      await api.transferRoom(bookingIdToUse, {
        oldRoomId: currentRoomObj?.id,
        newRoomId: Number(selectedRoomId),
        newNumGuests: Number(newNumGuests),
        reason,
        notes
      });

      if (onSuccess) {
        onSuccess({
          oldRoom: currentRoomObj?.roomNumber,
          newRoom: targetRoomObj?.roomNumber,
          guestCount: newNumGuests,
          guestName: booking?.guest?.fullName || 'Khách lưu trú'
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Chuyển phòng thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0f172a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                ĐỔI PHÒNG / NÂNG CẤP HẠNG PHÒNG
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, marginTop: '2px' }}>
                Linh hoạt chuyển phòng khi phát sinh thêm khách lưu trú
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem'
            }}>
              {error}
            </div>
          )}

          {/* Current Info Box */}
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            fontSize: '0.8125rem'
          }}>
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'block' }}>PHÒNG HIỆN TẠI</span>
              <strong style={{ fontSize: '1rem', color: '#f59e0b' }}>
                {currentRoomObj?.roomNumber || 'P101'}
              </strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1' }}>
                {currentRoomObj?.roomType?.name || 'Standard'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'block' }}>KHÁCH ĐẠI DIỆN</span>
              <strong style={{ fontSize: '0.9375rem', color: '#f8fafc' }}>
                {booking?.guest?.fullName || 'Khách lưu trú'}
              </strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8' }}>
                Số khách cũ: {booking?.numGuests || currentRoomObj?.roomType?.capacity || 1} người
              </span>
            </div>
          </div>

          {/* New Num Guests */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.375rem' }}>
              <Users size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Số Lượng Khách Thực Tế Sau Khi Phát Sinh
            </label>
            <input
              type="number"
              min={1}
              max={10}
              className="input-field"
              value={newNumGuests}
              onChange={(e) => setNewNumGuests(Number(e.target.value))}
              required
            />
          </div>

          {/* Select New Available Room */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.375rem' }}>
              <BedDouble size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Chọn Phòng Mới Chuyển Đến (Đang Trống)
            </label>

            {availableRooms.length === 0 ? (
              <div style={{ color: '#f87171', fontSize: '0.8125rem', padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.375rem' }}>
                Hiện không có phòng trống nào sẵn sàng trong hệ thống!
              </div>
            ) : (
              <select
                className="input-field"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                required
              >
                {availableRooms.map(room => {
                  const capacityMatch = room.roomType?.capacity >= newNumGuests;
                  return (
                    <option key={room.id} value={room.id}>
                      Phòng {room.roomNumber} - {room.roomType?.name} (Sức chứa: {room.roomType?.capacity} khách) - {room.roomType?.basePrice?.toLocaleString('vi-VN')} VNĐ/đêm {capacityMatch ? '✓ Phù hợp' : '⚠️ Vượt tải'}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Price Difference Indicator */}
          {targetRoomObj && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8125rem'
            }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Chênh lệch giá phòng:</span>
                <div style={{ fontWeight: 800, color: priceDiff >= 0 ? '#34d399' : '#f87171', fontSize: '0.9375rem' }}>
                  {priceDiff >= 0 ? `+${priceDiff.toLocaleString('vi-VN')} VNĐ/đêm` : `${priceDiff.toLocaleString('vi-VN')} VNĐ/đêm`}
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                {priceDiff >= 0 ? 'Phụ thu thêm' : 'Giảm trừ tiền'}
              </span>
            </div>
          )}

          {/* Reason & Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.375rem' }}>
              Lý do chuyển phòng / Ghi chú
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Ví dụ: Phát sinh thêm 2 người, khách đổi sang phòng Suite rộng hơn"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ flex: 1, height: '44px' }}
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={loading || availableRooms.length === 0}
              className="btn btn-primary"
              style={{ flex: 2, height: '44px', fontWeight: 700, backgroundColor: '#f59e0b', color: '#0f172a' }}
            >
              {loading ? 'Đang thực hiện đổi phòng...' : 'XÁC NHẬN ĐỔI / NÂNG PHÒNG'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
