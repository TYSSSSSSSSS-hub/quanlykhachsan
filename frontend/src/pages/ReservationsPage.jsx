import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Plus, CheckCircle, LogOut, XCircle, FileText, UserCheck, ShieldCheck, Zap, ArrowRightLeft, CheckSquare, Square, X } from 'lucide-react';
import { api } from '../services/api';

export const ReservationsPage = ({ onOpenBookingModal, onCheckout, onTransferRoom, refreshKey }) => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadBookings();
  }, [refreshKey]);

  const loadBookings = () => {
    api.getBookings().then(data => {
      if (Array.isArray(data)) setBookings(data);
    }).catch(console.error);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handleCheckIn = async (id) => {
    try {
      await api.checkIn(id);
      loadBookings();
    } catch (err) {
      alert('Lỗi Check-in: ' + err.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.bookingCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.guest?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.guest?.phone || '').includes(searchTerm) ||
      (b.room?.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && (b.status || '').toUpperCase() === statusFilter;
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBookings.length && filteredBookings.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookings.map(b => b.id));
    }
  };

  const handleBulkSMS = () => {
    alert(`Đã gửi tin nhắn SMS chào mừng & hướng dẫn nhận phòng tới ${selectedIds.length} khách hàng được chọn!`);
  };

  const handleBulkKeys = () => {
    alert(`Đã phát hành và mã hóa thẻ phòng RFID / QR Code cho ${selectedIds.length} lượt đặt phòng!`);
  };

  const handleBulkCheckIn = async () => {
    try {
      for (const id of selectedIds) {
        await api.checkIn(id);
      }
      alert(`Đã hoàn tất Express Check-in cho ${selectedIds.length} đặt phòng!`);
      setSelectedIds([]);
      loadBookings();
    } catch (err) {
      alert('Lỗi Express Check-in: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>FRONT DESK OPERATIONS</span>
            <span>•</span>
            <span style={{ color: '#64748b' }}>LIVE SYNCED</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Reservations Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Manage bookings, walk-ins, guest check-ins, VIP concierge tags, and deposit settlements across wings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <FileText size={15} /> Export CSV / Report
          </button>
          <button onClick={onOpenBookingModal} className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(29,78,216,0.2)' }}>
            <Plus size={16} /> + New Reservation
          </button>
        </div>
      </div>

      {/* KPI Stats Row (6 Stat Pills) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#64748b' }}>TOTAL ACTIVE</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{bookings.length} <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>+8 today</span></div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#2563eb' }}>EXPECTED ARRIVALS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>38 <span style={{ fontSize: '0.75rem', color: '#10b981' }}>16 checked in</span></div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#f59e0b' }}>DEPARTURES TODAY</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>24 <span style={{ fontSize: '0.75rem', color: '#64748b' }}>12 remaining</span></div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#059669' }}>IN-HOUSE GUESTS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>184 <span style={{ fontSize: '0.75rem', color: '#64748b' }}>82% Occupancy</span></div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ea580c' }}>VIP GUESTS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c' }}>16 <span style={{ fontSize: '0.75rem', color: '#ea580c' }}>6 High Priority</span></div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ef4444' }}>UNASSIGNED ROOMS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>5 <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>Needs Action</span></div>
        </div>
      </div>

      {/* Filter Status Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {[
          { label: 'All (' + bookings.length + ')', val: 'ALL' },
          { label: 'Confirmed (64)', val: 'BOOKED' },
          { label: 'Checked-in (42)', val: 'CHECKED_IN' },
          { label: 'Pending (14)', val: 'PENDING' },
          { label: 'Checked-out (12)', val: 'CHECKED_OUT' },
          { label: 'Cancelled (6)', val: 'CANCELLED' }
        ].map(p => (
          <button
            key={p.val}
            onClick={() => setStatusFilter(p.val)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '0.375rem',
              border: statusFilter === p.val ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              backgroundColor: statusFilter === p.val ? '#1d4ed8' : '#ffffff',
              color: statusFilter === p.val ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.875rem' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by Guest Name, Email, Phone, or Booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', width: '100%', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Dynamic Dark Bulk Action Banner (Only visible when bookings are selected) */}
      {selectedIds.length > 0 && (
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '0.625rem',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8125rem',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontWeight: 800, color: '#38bdf8' }}>✓ {selectedIds.length} reservation{selectedIds.length > 1 ? 's' : ''} selected</span>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Bulk actions apply instantly across housekeeping and reception registries</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={handleBulkSMS} className="btn btn-secondary" style={{ backgroundColor: '#1e293b', color: '#fff', borderColor: '#334155', fontSize: '0.75rem', padding: '0.4rem 0.75rem', borderRadius: '0.375rem' }}>
              Send Pre-arrival SMS
            </button>
            <button onClick={handleBulkKeys} className="btn btn-secondary" style={{ backgroundColor: '#1e293b', color: '#fff', borderColor: '#334155', fontSize: '0.75rem', padding: '0.4rem 0.75rem', borderRadius: '0.375rem' }}>
              Batch Keys & Folios
            </button>
            <button onClick={handleBulkCheckIn} className="btn btn-warning" style={{ backgroundColor: '#d97706', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.75rem', borderRadius: '0.375rem' }}>
              Express Check-in
            </button>
            <button onClick={() => setSelectedIds([])} style={{ background: 'none', border: '1px solid #475569', color: '#cbd5e1', fontSize: '0.75rem', padding: '0.4rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <X size={14} /> Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
              <th style={{ width: '40px', padding: '0.875rem 1rem', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={filteredBookings.length > 0 && selectedIds.length === filteredBookings.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '0.875rem 1rem' }}>BOOKING ID</th>
              <th style={{ padding: '0.875rem 1rem' }}>GUEST INFORMATION</th>
              <th style={{ padding: '0.875rem 1rem' }}>ROOM ASSIGNED</th>
              <th style={{ padding: '0.875rem 1rem' }}>CHECK-IN</th>
              <th style={{ padding: '0.875rem 1rem' }}>CHECK-OUT</th>
              <th style={{ padding: '0.875rem 1rem' }}>TOTAL AMOUNT</th>
              <th style={{ padding: '0.875rem 1rem' }}>STATUS</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  Không tìm thấy đơn đặt phòng nào.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => {
                const isSelected = selectedIds.includes(b.id);
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isSelected ? '#eff6ff' : '#ffffff', transition: 'background-color 0.15s ease' }}>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(b.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 800, color: '#1d4ed8' }}>{b.bookingCode}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.guest?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.guest?.phone}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <strong style={{ color: '#0f172a' }}>Phòng {b.room?.roomNumber}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.room?.roomType?.name}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                      {new Date(b.checkInDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                      {new Date(b.checkOutDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 800, color: '#16a34a' }}>
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className={`badge ${b.status === 'CHECKED_IN' || b.status === 'Checked-in' ? 'badge-occupied' : b.status === 'CHECKED_OUT' ? 'badge-available' : 'badge-reserved'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.375rem' }}>
                        {(b.status === 'BOOKED' || b.status === 'CONFIRMED' || b.status === 'Pending') && (
                          <button onClick={() => handleCheckIn(b.id)} className="btn btn-success" style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#fff', fontSize: '0.75rem', padding: '0.375rem 0.625rem', fontWeight: 700, borderRadius: '0.375rem' }}>
                            <CheckCircle size={14} style={{ marginRight: '4px' }} /> Check-in
                          </button>
                        )}
                        {(b.status === 'CHECKED_IN' || b.status === 'Checked-in') && (
                          <>
                            <button
                              onClick={() => onTransferRoom && onTransferRoom(b)}
                              className="btn btn-outline"
                              style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8', fontSize: '0.75rem', padding: '0.375rem 0.625rem', fontWeight: 700, borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              title="Linh hoạt chuyển phòng cho khách nếu có phát sinh thêm người"
                            >
                              <ArrowRightLeft size={13} /> Đổi Phòng
                            </button>
                            <button onClick={() => onCheckout(b.room)} className="btn btn-danger" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#fff', fontSize: '0.75rem', padding: '0.375rem 0.625rem', fontWeight: 700, borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <LogOut size={13} /> Trả Phòng
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
