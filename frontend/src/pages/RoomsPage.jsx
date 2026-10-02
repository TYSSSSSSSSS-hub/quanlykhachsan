import React, { useState, useEffect } from 'react';
import { RoomCard } from '../components/RoomCard';
import { 
  Plus, Filter, Search, BedDouble, RefreshCw, Tag, 
  DollarSign, Check, X, Edit3, Trash2, Power, AlertCircle, 
  Sparkles, CheckCircle2, Ban, Layers, Users
} from 'lucide-react';
import { api } from '../services/api';

export const RoomsPage = ({ onSelectRoom, onOrderService, onCheckout, refreshKey }) => {
  // Tabs: 'rooms' | 'types'
  const [activeTab, setActiveTab] = useState('rooms');

  // Rooms Data
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters for Rooms tab
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state for Room CRUD
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    floor: 1,
    roomTypeId: '',
    status: 'AVAILABLE'
  });

  // Modals state for RoomType & Pricing CRUD
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeFormData, setTypeFormData] = useState({
    name: '',
    basePrice: '',
    capacity: 2,
    description: '',
    amenities: 'Wifi, TV Smart, Điều hòa, Minibar'
  });

  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (text, type = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  useEffect(() => {
    loadAllData();
  }, [refreshKey]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [roomsData, typesData] = await Promise.all([
        api.getRooms().catch(() => []),
        api.getRoomTypes().catch(() => [])
      ]);
      if (Array.isArray(roomsData)) setRooms(roomsData);
      if (Array.isArray(typesData)) setRoomTypes(typesData);
    } catch (err) {
      console.error('Lỗi tải dữ liệu phòng & loại phòng:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  // --- ROOM HANDLERS ---
  const handleOpenCreateRoom = () => {
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: '',
      floor: 1,
      roomTypeId: roomTypes[0]?.id || '',
      status: 'AVAILABLE'
    });
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      roomNumber: room.roomNumber,
      floor: room.floor || 1,
      roomTypeId: room.roomType?.id || roomTypes[0]?.id || '',
      status: room.status || 'AVAILABLE'
    });
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        roomNumber: roomFormData.roomNumber.trim().toUpperCase(),
        floor: Number(roomFormData.floor),
        status: roomFormData.status,
        roomType: { id: Number(roomFormData.roomTypeId) }
      };

      if (editingRoom) {
        await api.updateRoom(editingRoom.id, payload);
        showAlert(`✓ Cập nhật phòng ${payload.roomNumber} thành công!`);
      } else {
        await api.createRoom(payload);
        showAlert(`✓ Thêm mới phòng ${payload.roomNumber} thành công!`);
      }
      setIsRoomModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Lỗi lưu phòng: ' + err.message);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (room.status === 'OCCUPIED') {
      alert('Không thể xóa phòng đang có khách lưu trú!');
      return;
    }
    const confirmDel = window.confirm(`Bạn có chắc chắn muốn xóa phòng ${room.roomNumber} khỏi hệ thống không?`);
    if (!confirmDel) return;

    try {
      await api.deleteRoom(room.id);
      showAlert(`✓ Đã xóa phòng ${room.roomNumber} thành công!`, 'info');
      loadAllData();
    } catch (err) {
      alert('Lỗi xóa phòng: ' + err.message);
    }
  };

  const handleToggleRoomMaintenance = async (room, targetStatus) => {
    try {
      await api.updateRoomStatus(room.id, targetStatus);
      showAlert(`✓ Đã chuyển trạng thái phòng ${room.roomNumber} sang "${targetStatus === 'MAINTENANCE' ? 'Ngừng HĐ / Bảo trì' : 'Sẵn sàng đón khách'}"!`);
      loadAllData();
    } catch (err) {
      alert('Lỗi đổi trạng thái phòng: ' + err.message);
    }
  };

  // --- ROOM TYPE & PRICING HANDLERS ---
  const handleOpenCreateType = () => {
    setEditingType(null);
    setTypeFormData({
      name: '',
      basePrice: '',
      capacity: 2,
      description: '',
      amenities: 'Wifi, Smart TV, Điều hòa 2 chiều, Minibar'
    });
    setIsTypeModalOpen(true);
  };

  const handleOpenEditType = (type) => {
    setEditingType(type);
    setTypeFormData({
      name: type.name,
      basePrice: type.basePrice || '',
      capacity: type.capacity || 2,
      description: type.description || '',
      amenities: type.amenities || ''
    });
    setIsTypeModalOpen(true);
  };

  const handleSaveType = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: typeFormData.name.trim(),
        basePrice: Number(typeFormData.basePrice),
        capacity: Number(typeFormData.capacity),
        description: typeFormData.description.trim(),
        amenities: typeFormData.amenities.trim(),
        isActive: editingType ? editingType.isActive : true
      };

      if (editingType) {
        await api.updateRoomType(editingType.id, payload);
        showAlert(`✓ Đã cập nhật loại phòng "${payload.name}" và áp dụng giá mới: ${formatCurrency(payload.basePrice)}/đêm!`);
      } else {
        await api.createRoomType(payload);
        showAlert(`✓ Thêm mới loại phòng "${payload.name}" với đơn giá: ${formatCurrency(payload.basePrice)}/đêm!`);
      }
      setIsTypeModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Lỗi lưu loại phòng & giá: ' + err.message);
    }
  };

  const handleToggleTypeStatus = async (type) => {
    try {
      await api.toggleRoomTypeStatus(type.id);
      showAlert(`✓ Đã ${type.isActive ? 'ngừng hoạt động' : 'kích hoạt lại'} loại phòng "${type.name}"!`);
      loadAllData();
    } catch (err) {
      alert('Lỗi đổi trạng thái loại phòng: ' + err.message);
    }
  };

  const handleDeleteType = async (type) => {
    const roomsWithType = rooms.filter(r => r.roomType?.id === type.id);
    if (roomsWithType.length > 0) {
      alert(`Không thể xóa loại phòng này vì đang có ${roomsWithType.length} phòng liên kết! Hãy ngừng hoạt động loại phòng thay vì xóa.`);
      return;
    }
    const confirmDel = window.confirm(`Bạn có chắc muốn xóa vĩnh viễn loại phòng "${type.name}" không?`);
    if (!confirmDel) return;

    try {
      await api.deleteRoomType(type.id);
      showAlert(`✓ Đã xóa loại phòng "${type.name}"!`, 'info');
      loadAllData();
    } catch (err) {
      alert('Lỗi xóa loại phòng: ' + err.message);
    }
  };

  // KPIs
  const totalCount = rooms.length;
  const availCount = rooms.filter(r => (r.status || '').toUpperCase() === 'AVAILABLE').length;
  const occCount = rooms.filter(r => (r.status || '').toUpperCase() === 'OCCUPIED').length;
  const resCount = rooms.filter(r => (r.status || '').toUpperCase() === 'RESERVED').length;
  const cleanCount = rooms.filter(r => (r.status || '').toUpperCase() === 'CLEANING').length;
  const maintCount = rooms.filter(r => (r.status || '').toUpperCase() === 'MAINTENANCE').length;

  const filteredRooms = rooms.filter(r => {
    const matchFloor = selectedFloor === 'ALL' || r.floor === Number(selectedFloor);
    const matchStatus = selectedStatus === 'ALL' || (r.status || '').toUpperCase() === selectedStatus.toUpperCase();
    const matchSearch = (r.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (r.roomType?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchFloor && matchStatus && matchSearch;
  });

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Toast Alert */}
      {alertMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: alertMessage.type === 'info' ? '#eff6ff' : '#f0fdf4',
          border: `1px solid ${alertMessage.type === 'info' ? '#93c5fd' : '#86efac'}`,
          color: alertMessage.type === 'info' ? '#1e40af' : '#166534',
          padding: '0.875rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          fontWeight: 700,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={18} />
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Top Header & Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            HOTEL OPERATIONS & PRICING CONTROLLER
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Quản Lý Phòng, Loại Phòng & Bảng Giá
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Thêm mới, điều chỉnh thông tin phòng, cập nhật bảng giá niêm yết và quản lý trạng thái hoạt động toàn hệ thống.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          {activeTab === 'rooms' ? (
            <button
              onClick={handleOpenCreateRoom}
              className="btn btn-primary"
              style={{ height: '38px', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#1d4ed8', color: '#fff', borderRadius: '0.5rem', padding: '0 1rem' }}
            >
              <Plus size={16} /> + Thêm Phòng Mới
            </button>
          ) : (
            <button
              onClick={handleOpenCreateType}
              className="btn btn-primary"
              style={{ height: '38px', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#16a34a', color: '#fff', borderRadius: '0.5rem', padding: '0 1rem' }}
            >
              <Plus size={16} /> + Thêm Loại Phòng & Đặt Giá
            </button>
          )}

          <button
            onClick={loadAllData}
            style={{ height: '38px', padding: '0 0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, fontSize: '0.8125rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Làm Mới
          </button>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('rooms')}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: activeTab === 'rooms' ? '#1d4ed8' : 'transparent',
            color: activeTab === 'rooms' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <BedDouble size={18} />
          <span>Sơ Đồ & Danh Sách Phòng ({rooms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('types')}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: activeTab === 'types' ? '#1d4ed8' : 'transparent',
            color: activeTab === 'types' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <Tag size={18} />
          <span>Quản Lý Loại Phòng & Bảng Giá ({roomTypes.length})</span>
        </button>
      </div>

      {/* TAB 1: ROOMS GRID & INVENTORY */}
      {activeTab === 'rooms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Top KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#64748b' }}>TỔNG SỐ PHÒNG</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{totalCount}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#059669' }}>SẴN SÀNG (AVAILABLE)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{availCount}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#2563eb' }}>ĐANG Ở (OCCUPIED)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{occCount}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#d97706' }}>ĐÃ GIỮ CHỖ (RESERVED)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{resCount}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ea580c' }}>ĐANG DỌN DẸP</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c' }}>{cleanCount}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#dc2626' }}>NGỪNG HĐ / BẢO TRÌ</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{maintCount}</div>
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
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.875rem' }}>
              <Search size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Tìm theo số phòng (ví dụ P101, P202) hoặc loại phòng..." 
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
              <option value="ALL">Tất Cả Tầng</option>
              <option value="1">Tầng 1</option>
              <option value="2">Tầng 2</option>
              <option value="3">Tầng 3</option>
              <option value="4">Tầng 4</option>
              <option value="5">Tầng 5</option>
            </select>

            {/* Status Filter */}
            <select 
              className="input-field"
              style={{ width: '200px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">Tất Cả Trạng Thái</option>
              <option value="AVAILABLE">Sẵn Sàng (Available)</option>
              <option value="OCCUPIED">Đang Ở (Occupied)</option>
              <option value="RESERVED">Đã Đặt (Reserved)</option>
              <option value="CLEANING">Đang Dọn (Cleaning)</option>
              <option value="MAINTENANCE">Ngừng HĐ / Bảo Trì (Maintenance)</option>
            </select>
          </div>

          {/* Room Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onSelectRoom={(r, action) => {
                  if (action === 'MARK_AVAILABLE') {
                    handleToggleRoomMaintenance(r, 'AVAILABLE');
                  } else {
                    onSelectRoom(r, action);
                  }
                }}
                onOrderService={onOrderService}
                onCheckout={onCheckout}
                onEditRoom={handleOpenEditRoom}
                onDeleteRoom={handleDeleteRoom}
                onToggleMaintenance={handleToggleRoomMaintenance}
              />
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: ROOM TYPES & PRICING CONFIGURATION */}
      {activeTab === 'types' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Bảng Cấu Hình Loại Phòng & Giá Niêm Yết
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Điều chỉnh giá bán theo đêm, thay đổi mô tả, tiện nghi hoặc tạm ngừng kinh doanh loại phòng
                </p>
              </div>

              <button
                onClick={handleOpenCreateType}
                className="btn btn-primary"
                style={{ backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <Plus size={16} /> Thêm Hạng Phòng & Giá Mới
              </button>
            </div>

            {/* Room Types Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.875rem 1rem' }}>MÃ & TÊN HẠNG PHÒNG</th>
                    <th style={{ padding: '0.875rem 1rem' }}>ĐƠN GIÁ NIÊM YẾT / ĐÊM</th>
                    <th style={{ padding: '0.875rem 1rem' }}>SỨC CHỨA</th>
                    <th style={{ padding: '0.875rem 1rem' }}>TIỆN NGHI TIÊU BIỂU</th>
                    <th style={{ padding: '0.875rem 1rem' }}>PHÒNG THỰC TẾ</th>
                    <th style={{ padding: '0.875rem 1rem' }}>TRẠNG THÁI</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {roomTypes.map(t => {
                    const linkedRooms = rooms.filter(r => r.roomType?.id === t.id);
                    const isTypeActive = t.isActive !== false;

                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isTypeActive ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ padding: '1rem' }}>
                          <strong style={{ fontSize: '0.9375rem', color: isTypeActive ? '#0f172a' : '#94a3b8' }}>{t.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '280px', marginTop: '2px' }}>
                            {t.description || 'Không có mô tả chi tiết'}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: isTypeActive ? '#16a34a' : '#94a3b8' }}>
                            {formatCurrency(t.basePrice)}
                          </div>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>/ đêm lưu trú</span>
                        </td>

                        <td style={{ padding: '1rem', color: '#334155', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Users size={15} color="#64748b" />
                            <span>{t.capacity || 2} Người</span>
                          </div>
                        </td>

                        <td style={{ padding: '1rem', maxWidth: '250px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                            {t.amenities || 'Wifi, TV, Minibar'}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            fontWeight: 800,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem'
                          }}>
                            {linkedRooms.length} phòng
                          </span>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          {isTypeActive ? (
                            <span style={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '0.375rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              ✓ Đang Kinh Doanh
                            </span>
                          ) : (
                            <span style={{
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '0.375rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              ✕ Ngừng Hoạt Động
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditType(t)}
                              style={{
                                padding: '0.35rem 0.625rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#1d4ed8',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Edit3 size={13} /> Sửa & Đổi Giá
                            </button>

                            <button
                              onClick={() => handleToggleTypeStatus(t)}
                              style={{
                                padding: '0.35rem 0.625rem',
                                borderRadius: '0.375rem',
                                border: isTypeActive ? '1px solid #fecdd3' : '1px solid #86efac',
                                backgroundColor: isTypeActive ? '#fff1f2' : '#f0fdf4',
                                color: isTypeActive ? '#e11d48' : '#16a34a',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Power size={13} /> {isTypeActive ? 'Ngừng HĐ' : 'Kích Hoạt'}
                            </button>

                            <button
                              onClick={() => handleDeleteType(t)}
                              style={{
                                padding: '0.35rem 0.5rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#dc2626',
                                cursor: 'pointer'
                              }}
                              title="Xóa loại phòng"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* MODAL 1: ADD / EDIT ROOM */}
      {isRoomModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '480px',
            padding: '1.75rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingRoom ? `Chỉnh Sửa Phòng ${editingRoom.roomNumber}` : 'Thêm Phòng Mới Vào Khách Sạn'}
              </h3>
              <button onClick={() => setIsRoomModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  Số Phòng (Room Number) *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: P105, P206, VIP301"
                  value={roomFormData.roomNumber}
                  onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                    Tầng (Floor) *
                  </label>
                  <select
                    value={roomFormData.floor}
                    onChange={(e) => setRoomFormData({ ...roomFormData, floor: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    {[1, 2, 3, 4, 5].map(fl => (
                      <option key={fl} value={fl}>Tầng {fl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                    Trạng Thái Khởi Tạo *
                  </label>
                  <select
                    value={roomFormData.status}
                    onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    <option value="AVAILABLE">AVAILABLE (Sẵn sàng)</option>
                    <option value="MAINTENANCE">MAINTENANCE (Ngừng HĐ/Bảo trì)</option>
                    <option value="CLEANING">CLEANING (Đang dọn dẹp)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  Loại Phòng & Mức Giá Áp Dụng *
                </label>
                <select
                  value={roomFormData.roomTypeId}
                  onChange={(e) => setRoomFormData({ ...roomFormData, roomTypeId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  {roomTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} - {formatCurrency(rt.basePrice)}/đêm ({rt.capacity || 2} khách)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#1d4ed8', color: '#ffffff', fontWeight: 800, fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  {editingRoom ? 'Lưu Thay Đổi' : 'Tạo Phòng Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT ROOM TYPE & PRICING */}
      {isTypeModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '540px',
            padding: '1.75rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingType ? `Chỉnh Sửa Loại Phòng & Giá: ${editingType.name}` : 'Thêm Loại Phòng & Thiết Lập Giá Mới'}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Giá thay đổi sẽ áp dụng ngay cho các đơn đặt phòng mới của khách hàng
                </p>
              </div>
              <button onClick={() => setIsTypeModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveType} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  Tên Loại Phòng *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Deluxe Ocean Panoramic View"
                  value={typeFormData.name}
                  onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                    💰 Đơn Giá Niêm Yết / Đêm (VND) *
                  </label>
                  <input
                    type="number"
                    step="10000"
                    placeholder="1200000"
                    value={typeFormData.basePrice}
                    onChange={(e) => setTypeFormData({ ...typeFormData, basePrice: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '2px solid #86efac', fontSize: '0.9375rem', fontWeight: 800, color: '#16a34a' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                    👥 Sức Chứa (Người) *
                  </label>
                  <select
                    value={typeFormData.capacity}
                    onChange={(e) => setTypeFormData({ ...typeFormData, capacity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    <option value={1}>1 Người (Single)</option>
                    <option value={2}>2 Người (Couple/Twin)</option>
                    <option value={3}>3 Người (Triple)</option>
                    <option value={4}>4 Người (Family Suite)</option>
                    <option value={6}>6 Người (Penthouse)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  Mô Tả Hạng Phòng
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả không gian, tầm nhìn, phong cách kiến trúc..."
                  value={typeFormData.description}
                  onChange={(e) => setTypeFormData({ ...typeFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  Tiện Nghi Kèm Theo (Phân tách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Wifi tốc độ cao, Smart TV 55 inch, Bồn tắm Jacuzzi, Minibar"
                  value={typeFormData.amenities}
                  onChange={(e) => setTypeFormData({ ...typeFormData, amenities: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 800, fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  {editingType ? 'Cập Nhật Giá & Loại Phòng' : 'Tạo Loại Phòng & Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
