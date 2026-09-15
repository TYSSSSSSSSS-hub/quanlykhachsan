import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  BedDouble, 
  Coffee, 
  UserCheck, 
  LogOut, 
  RefreshCw,
  Search,
  Filter,
  Layers,
  Wrench,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const StaffWorkspacePage = () => {
  const { user, logout } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('housekeeping');

  // Rooms State from Backend API
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Service Tasks State
  const [serviceTasks, setServiceTasks] = useState([
    { id: 1, roomNumber: 'P102', serviceName: 'Set ăn tối tại phòng (Room Service)', quantity: 1, time: '16:15', status: 'Pending', guestName: 'Marcus Chen', note: 'Giao món lúc 18:30' },
    { id: 2, roomNumber: 'P201', serviceName: 'Giặt ủi quần áo cao cấp', quantity: 2, time: '15:45', status: 'In-Progress', guestName: 'Elena Vance', note: 'Ủi phẳng bộ comple xanh' },
    { id: 3, roomNumber: 'P301', serviceName: 'Nước ngọt & Minibar tủ lạnh', quantity: 4, time: '14:30', status: 'Completed', guestName: 'David Sterling', note: 'Đã giao 4 lon Nước ép' },
    { id: 4, roomNumber: 'P101', serviceName: 'Bữa sáng buffet sang trọng', quantity: 2, time: '07:30', status: 'Completed', guestName: 'Phạm Văn Nam', note: 'Đã phục vụ tại bàn' },
  ]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoadingRooms(true);
    try {
      const data = await api.getRooms();
      if (Array.isArray(data)) setRooms(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phòng:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Handle Room Status Updates with Backend API sync
  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    try {
      await api.updateRoomStatus(roomId, newStatus);
      loadRooms();
    } catch (err) {
      alert('Lỗi cập nhật trạng thái phòng: ' + err.message);
    }
  };

  // Handle Service Task Updates
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setServiceTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const cleaningCount = rooms.filter(r => (r.status || '').toUpperCase() === 'CLEANING').length;
  const pendingServiceCount = serviceTasks.filter(t => t.status !== 'Completed').length;
  const availableCount = rooms.filter(r => (r.status || '').toUpperCase() === 'AVAILABLE').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Staff Navigation Bar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.125rem',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                KÔNG TÁC NHÂN VIÊN (STAFF WORKSPACE)
              </h1>
              <span style={{
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                padding: '0.125rem 0.5rem',
                borderRadius: '1rem',
                fontSize: '0.6875rem',
                fontWeight: 700
              }}>
                🧹 Housekeeping & Services
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, marginTop: '2px' }}>
              Xin chào, <strong style={{ color: '#1d4ed8' }}>{user?.fullName || 'Nguyễn Văn Staff'}</strong> • Ca sáng (07:00 - 15:00)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={loadRooms}
            className="btn btn-outline"
            style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem', backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600 }}
          >
            <RefreshCw size={15} /> Tải lại dữ liệu
          </button>

          <button
            onClick={logout}
            className="btn btn-outline"
            style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem', backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#ef4444', fontWeight: 600 }}
          >
            <LogOut size={15} /> Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flex: 1, padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Quick Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PHÒNG CẦN DỌN DẸP (CLEANING)</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ea580c', marginTop: '4px' }}>{cleaningCount} Phòng</div>
              <span style={{ fontSize: '0.6875rem', color: '#ea580c', fontWeight: 600 }}>Cần vệ sinh trước khi đón khách mới</span>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
              <Clock size={24} />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>YÊU CẦU DỊCH VỤ ĐANG CHỜ</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>{pendingServiceCount} Task</div>
              <span style={{ fontSize: '0.6875rem', color: '#2563eb', fontWeight: 600 }}>Phục vụ tận phòng</span>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
              <Coffee size={24} />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PHÒNG SẴN SÀNG (AVAILABLE)</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>{availableCount} Phòng</div>
              <span style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600 }}>Đã đạt chuẩn 5 sao</span>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Staff */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <button
            onClick={() => setActiveSubTab('housekeeping')}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: activeSubTab === 'housekeeping' ? '#1d4ed8' : '#ffffff',
              color: activeSubTab === 'housekeeping' ? '#ffffff' : '#64748b',
              border: activeSubTab === 'housekeeping' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <BedDouble size={18} />
            Danh Sách Phòng Khách Sạn ({rooms.length})
          </button>

          <button
            onClick={() => setActiveSubTab('tasks')}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: activeSubTab === 'tasks' ? '#1d4ed8' : '#ffffff',
              color: activeSubTab === 'tasks' ? '#ffffff' : '#64748b',
              border: activeSubTab === 'tasks' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Coffee size={18} />
            Yêu Cầu Dịch Vụ Khách Hàng ({serviceTasks.length})
          </button>
        </div>

        {/* SubTab Content: Housekeeping / Room Management */}
        {activeSubTab === 'housekeeping' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {rooms.map(room => {
                const isCleaning = (room.status || '').toUpperCase() === 'CLEANING';
                const isAvailable = (room.status || '').toUpperCase() === 'AVAILABLE';
                const isOccupied = (room.status || '').toUpperCase() === 'OCCUPIED';
                const isMaintenance = (room.status || '').toUpperCase() === 'MAINTENANCE';

                return (
                  <div key={room.id} style={{
                    backgroundColor: '#ffffff',
                    border: isCleaning ? '2px solid #ea580c' : '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Phòng {room.roomNumber}</span>
                        <span style={{
                          backgroundColor: isCleaning ? '#ffedd5' : isAvailable ? '#dcfce7' : isOccupied ? '#eff6ff' : '#fef2f2',
                          color: isCleaning ? '#c2410c' : isAvailable ? '#166534' : isOccupied ? '#1e40af' : '#b91c1c',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '0.375rem'
                        }}>
                          {room.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <div>Loại phòng: <strong style={{ color: '#0f172a' }}>{room.roomType?.name || 'Deluxe King'}</strong></div>
                        <div>Tầng: <strong style={{ color: '#0f172a' }}>{room.floor || 1}</strong></div>
                        <div>Giá phòng: <strong style={{ color: '#16a34a' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price || 0)}</strong></div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>CẬP NHẬT TRẠNG THÁI HOUSEKEEPING:</span>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {isCleaning && (
                          <button
                            onClick={() => handleUpdateRoomStatus(room.id, 'AVAILABLE')}
                            className="btn btn-primary"
                            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#fff', fontSize: '0.75rem', padding: '0.4rem 0.5rem', fontWeight: 700 }}
                          >
                            <Check size={14} /> Hoàn Thành Dọn
                          </button>
                        )}

                        {!isCleaning && (
                          <button
                            onClick={() => handleUpdateRoomStatus(room.id, 'CLEANING')}
                            className="btn btn-outline"
                            style={{ backgroundColor: '#ffffff', borderColor: '#ea580c', color: '#ea580c', fontSize: '0.75rem', padding: '0.4rem 0.5rem', fontWeight: 700 }}
                          >
                            <Clock size={14} /> Cần Dọn Dẹp
                          </button>
                        )}

                        {!isMaintenance ? (
                          <button
                            onClick={() => handleUpdateRoomStatus(room.id, 'MAINTENANCE')}
                            className="btn btn-outline"
                            style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#64748b', fontSize: '0.75rem', padding: '0.4rem 0.5rem', fontWeight: 700 }}
                          >
                            <Wrench size={14} /> Báo Bảo Trì
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateRoomStatus(room.id, 'AVAILABLE')}
                            className="btn btn-primary"
                            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#fff', fontSize: '0.75rem', padding: '0.4rem 0.5rem', fontWeight: 700 }}
                          >
                            <Check size={14} /> Đã Xong Bảo Trì
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SubTab Content: Service Tasks */}
        {activeSubTab === 'tasks' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                  <th style={{ padding: '0.875rem 1rem' }}>PHÒNG</th>
                  <th style={{ padding: '0.875rem 1rem' }}>TÊN DỊCH VỤ / MÓN</th>
                  <th style={{ padding: '0.875rem 1rem' }}>GHI CHÚ GIAO HÀNG</th>
                  <th style={{ padding: '0.875rem 1rem' }}>THỜI GIAN</th>
                  <th style={{ padding: '0.875rem 1rem' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {serviceTasks.map(task => (
                  <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 800, color: '#1d4ed8' }}>{task.roomNumber}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0f172a' }}>{task.serviceName}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>{task.note}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>{task.time}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{
                        backgroundColor: task.status === 'Completed' ? '#dcfce7' : task.status === 'In-Progress' ? '#eff6ff' : '#ffedd5',
                        color: task.status === 'Completed' ? '#166534' : task.status === 'In-Progress' ? '#1e40af' : '#c2410c',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem'
                      }}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                          className="btn btn-primary"
                          style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#fff', fontSize: '0.75rem', padding: '0.35rem 0.625rem', fontWeight: 700 }}
                        >
                          Đã Giao Xong
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
