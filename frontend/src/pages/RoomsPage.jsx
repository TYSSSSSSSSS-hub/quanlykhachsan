import React, { useState, useEffect } from 'react';
import { RoomCard } from '../components/RoomCard';
import { Plus, Filter, Search, BedDouble, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const RoomsPage = ({ onSelectRoom, onOrderService, onCheckout, refreshKey }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRooms();
  }, [refreshKey]);

  const loadRooms = () => {
    api.getRooms().then(setRooms);
  };

  const handleStatusChange = async (room, newStatus) => {
    try {
      await api.updateRoomStatus(room.id, newStatus);
      loadRooms();
    } catch (err) {
      alert('Lỗi cập nhật trạng thái phòng: ' + err.message);
    }
  };

  const totalCount = rooms.length || 120;
  const availCount = rooms.filter(r => (r.status || '').toUpperCase() === 'AVAILABLE').length;
  const occCount = rooms.filter(r => (r.status || '').toUpperCase() === 'OCCUPIED').length;
  const resCount = rooms.filter(r => (r.status || '').toUpperCase() === 'RESERVED').length;
  const cleanCount = rooms.filter(r => (r.status || '').toUpperCase() === 'CLEANING').length;
  const maintCount = rooms.filter(r => (r.status || '').toUpperCase() === 'MAINTENANCE').length;

  const filteredRooms = rooms.filter(r => {
    const matchFloor = selectedFloor === 'ALL' || r.floor === Number(selectedFloor);
    const matchStatus = selectedStatus === 'ALL' || r.status.toUpperCase() === selectedStatus.toUpperCase();
    const matchSearch = r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (r.roomType?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchFloor && matchStatus && matchSearch;
  });

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
            OPERATIONS FLOORPLAN • REAL-TIME TELEMETRY
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
            Room Management & Housekeeping Grid
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '2px 0 0 0' }}>
            Live inventory, turnaround cycles, and guest occupancy telemetry for {totalCount} key units.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ height: '38px', fontSize: '0.8125rem' }}>
            ⚡ Bulk Status Update
          </button>
          <button className="btn btn-primary" style={{ height: '38px', fontSize: '0.8125rem', fontWeight: 700 }}>
            + Add New Room
          </button>
        </div>
      </div>

      {/* Top Stat Pills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#64748b' }}>ALL ROOMS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{totalCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#059669' }}>AVAILABLE</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{availCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#2563eb' }}>OCCUPIED</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{occCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#d97706' }}>RESERVED</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{resCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ea580c' }}>TURNAROUND</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c' }}>{cleanCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#dc2626' }}>MAINT / OOO</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{maintCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '0.875rem 1.25rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.875rem' }}>
          <Search size={16} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Find room number (e.g. 302)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', width: '100%', fontSize: '0.8125rem' }}
          />
        </div>

        {/* Floor Filter */}
        <select 
          className="input-field"
          style={{ width: '150px' }}
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
        >
          <option value="ALL">All Floors</option>
          <option value="1">Floor 1</option>
          <option value="2">Floor 2</option>
          <option value="3">Floor 3</option>
          <option value="4">Floor 4 - Executive</option>
          <option value="5">Floor 5 - Penthouse</option>
        </select>

        {/* Status Filter */}
        <select 
          className="input-field"
          style={{ width: '180px' }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ALL">All Room Statuses</option>
          <option value="AVAILABLE">Available (Trống)</option>
          <option value="OCCUPIED">Occupied (Đang ở)</option>
          <option value="RESERVED">Reserved (Đã đặt)</option>
          <option value="CLEANING">Cleaning (Dọn dẹp)</option>
          <option value="MAINTENANCE">Maintenance (Bảo trì)</option>
        </select>
      </div>

      {/* Room Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredRooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            onSelectRoom={(r, action) => {
              if (action === 'MARK_AVAILABLE') {
                handleStatusChange(r, 'Available');
              } else {
                onSelectRoom(r, action);
              }
            }}
            onOrderService={onOrderService}
            onCheckout={onCheckout}
          />
        ))}
      </div>
    </div>
  );
};
