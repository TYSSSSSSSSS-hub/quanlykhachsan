import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Users, 
  Search, 
  BedDouble, 
  Coffee, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  MapPin,
  Phone,
  Star,
  ArrowRight,
  AlertCircle,
  XCircle,
  RefreshCw,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CustomerBookingModal } from '../components/CustomerBookingModal';

export const CustomerPortalPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');

  // Search State
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [checkInDate, setCheckInDate] = useState(todayStr);
  const [checkOutDate, setCheckOutDate] = useState(tomorrowStr);
  const [guestsCount, setGuestsCount] = useState(2);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  // Live Data from Backend API
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingServicesMap, setBookingServicesMap] = useState({});
  const [hotelServices, setHotelServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toast / Banner alert
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ show: true, message, type });
    setTimeout(() => {
      setAlertInfo(prev => ({ ...prev, show: false }));
    }, 6000);
  };

  // High quality images & descriptions per room type
  const roomMeta = {
    'Standard Single': {
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      category: 'Standard',
      amenities: ['Wifi tốc độ cao', 'TV 43" Smart HD', 'Điều hòa 2 chiều', 'Bàn làm việc'],
      description: 'Phòng tiêu chuẩn 1 giường đơn ấm cúng, thiết kế hiện đại, đầy đủ tiện nghi cho chuyến công tác ngắn ngày.'
    },
    'Standard Double': {
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      category: 'Standard',
      amenities: ['Wifi miễn phí', 'TV 50" Smart HD', 'Minibar & Tủ lạnh', 'Máy sấy tóc & Vệ sinh cao cấp'],
      description: 'Phòng tiêu chuẩn 1 giường đôi cỡ lớn, không gian thoáng mát, lý tưởng cho cặp đôi nghỉ dưỡng.'
    },
    'Deluxe Ocean View': {
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      category: 'Deluxe',
      amenities: ['Giường King Size', 'View trực diện biển', 'Ban công rộng rãi', 'Bồn tắm Jacuzzi', 'Máy pha cà phê Espresso'],
      description: 'Phòng sang trọng tầm nhìn trực diện biển Đà Nẵng, có ban công riêng và bồn tắm Jacuzzi cao cấp.'
    },
    'VIP Executive Suite': {
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      category: 'Suite',
      amenities: ['2 Giường King Beds', 'Phòng khách riêng', 'Ban công Panorama 360', 'Dịch vụ Butler 24/7', 'Phòng xông hơi'],
      description: 'Căn hộ Khách sạn VIP với 2 phòng ngủ riêng biệt, phòng khách tiếp khách sang trọng và view toàn cảnh biển.'
    }
  };

  // Load live data from Backend API
  const loadData = async () => {
    setLoading(true);
    try {
      const userPhone = (user?.phone || '').trim();
      const userEmail = (user?.email || '').trim().toLowerCase();

      const [roomsData, typesData, servicesData] = await Promise.all([
        api.getRooms().catch(() => []),
        api.getRoomTypes().catch(() => []),
        api.getServices().catch(() => [])
      ]);

      if (Array.isArray(roomsData)) setRooms(roomsData);
      if (Array.isArray(typesData)) setRoomTypes(typesData);
      if (Array.isArray(servicesData)) setHotelServices(servicesData);

      // Fetch only THIS user's bookings from the backend
      let myBookingsData = [];
      if (userPhone.length > 0 || userEmail.length > 0) {
        myBookingsData = await api.getMyBookings(userPhone || null, userEmail || null).catch(() => []);
      }

      // Also pick up session-tracked booking IDs (created in this browser session)
      const sessionIds = JSON.parse(sessionStorage.getItem('my_booking_ids') || '[]');
      if (sessionIds.length > 0) {
        // Load any session bookings that aren't already in myBookingsData
        const existingIds = new Set(myBookingsData.map(b => b.id));
        const allBookings = await api.getBookings().catch(() => []);
        const sessionExtra = Array.isArray(allBookings)
          ? allBookings.filter(b => b && b.id && sessionIds.includes(b.id) && !existingIds.has(b.id))
          : [];
        myBookingsData = [...myBookingsData, ...sessionExtra];
      }

      // Sort latest bookings first
      if (Array.isArray(myBookingsData)) {
        myBookingsData.sort((a, b) => b.id - a.id);
        setMyBookings(myBookingsData);

        // Fetch ordered services for all my bookings in parallel
        const srvMap = {};
        await Promise.all(
          myBookingsData.map(async (bk) => {
            try {
              const srvs = await api.getBookingServices(bk.id);
              if (Array.isArray(srvs)) {
                srvMap[bk.id] = srvs;
              }
            } catch (_) {}
          })
        );
        setBookingServicesMap(srvMap);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu cổng khách hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Combine room types with active counts
  const enrichedRoomTypes = (roomTypes.length > 0 ? roomTypes : [
    { id: 1, name: 'Standard Single', basePrice: 450000, capacity: 1 },
    { id: 2, name: 'Standard Double', basePrice: 650000, capacity: 2 },
    { id: 3, name: 'Deluxe Ocean View', basePrice: 1200000, capacity: 2 },
    { id: 4, name: 'VIP Executive Suite', basePrice: 2500000, capacity: 4 }
  ]).map(type => {
    const meta = roomMeta[type.name] || {
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      category: 'Deluxe',
      amenities: ['Wifi tốc độ cao', 'Điều hòa 2 chiều', 'TV Smart HD', 'Minibar'],
      description: type.description || 'Phòng nghỉ tiện nghi đẳng cấp 5 sao tại Grand Horizon Resort & Spa.'
    };

    const typeRooms = rooms.filter(r => r.roomType?.id === type.id || r.roomType?.name === type.name);
    const available = typeRooms.filter(r => r.status && r.status.toUpperCase() === 'AVAILABLE');

    return {
      ...type,
      ...meta,
      price: type.basePrice || meta.price || 500000,
      totalRooms: typeRooms.length,
      availableRooms: available,
      availableCount: available.length
    };
  });

  const filteredRoomTypes = enrichedRoomTypes.filter(rt => {
    if (categoryFilter === 'ALL') return true;
    return (rt.category || '').toUpperCase() === categoryFilter.toUpperCase();
  });

  const handleOpenBooking = (typeObj) => {
    setSelectedRoomType(typeObj);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking) => {
    setIsBookingModalOpen(false);
    try {
      const curIds = JSON.parse(sessionStorage.getItem('my_booking_ids') || '[]');
      if (newBooking?.id) curIds.push(newBooking.id);
      if (newBooking?.bookingCode) curIds.push(newBooking.bookingCode);
      sessionStorage.setItem('my_booking_ids', JSON.stringify(curIds));
    } catch (_) {}

    showAlert(`🎉 Đặt phòng thành công! Mã xác nhận của quý khách là: ${newBooking.bookingCode || 'BK-' + newBooking.id}. Chúc quý khách kỳ nghỉ tuyệt vời!`, 'success');
    setActiveTab('my-bookings');
    loadData();
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('Quý khách có chắc chắn muốn hủy đơn đặt phòng này không?');
    if (!confirmCancel) return;

    try {
      await api.cancelBooking(bookingId, 'Khách hàng tự hủy trên Cổng Đặt Phòng Trực Tuyến');
      showAlert('✓ Đã hủy đơn đặt phòng thành công. Phòng đã được hoàn trả lại hệ thống.', 'info');
      loadData();
    } catch (err) {
      alert('Lỗi hủy đơn: ' + err.message);
    }
  };

  const handleOrderServiceQuick = async (service) => {
    const activeBooking = myBookings.find(b => b.status === 'CHECKED_IN');
    if (!activeBooking) {
      showAlert('⚠️ Quý khách cần hoàn tất thủ tục nhận phòng (Check-in) trước khi gọi dịch vụ tận phòng.', 'error');
      return;
    }

    try {
      const roomNum = activeBooking.room?.roomNumber || 'của quý khách';
      await api.orderService({
        bookingId: activeBooking.id,
        serviceId: service.id,
        quantity: 1
      });

      showAlert(`🍽️ Đã gửi yêu cầu "${service.name}" lên phòng ${roomNum} thành công! Nhân viên sẽ mang lên trong ít phút.`, 'success');
      loadData();
    } catch (err) {
      showAlert(`❌ Lỗi đặt dịch vụ: ${err.message}`, 'error');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Customer Header Bar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '0.875rem',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              GRAND HORIZON RESORT & SPA
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
              CỔNG ĐẶT PHÒNG KHÁCH HÀNG (CUSTOMER PORTAL)
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('rooms')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: activeTab === 'rooms' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'rooms' ? '#1d4ed8' : '#ffffff',
              color: activeTab === 'rooms' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.15s ease'
            }}
          >
            <BedDouble size={16} /> Tìm & Đặt Phòng
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: activeTab === 'my-bookings' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'my-bookings' ? '#1d4ed8' : '#ffffff',
              color: activeTab === 'my-bookings' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={16} /> Đơn Đặt Phòng Của Tôi ({myBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: activeTab === 'services' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'services' ? '#1d4ed8' : '#ffffff',
              color: activeTab === 'services' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Coffee size={16} /> Dịch Vụ Tại Phòng
          </button>
        </nav>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
              {user?.fullName || 'Khách Hàng'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
              ● Đang hoạt động • {user?.phone || '0988776655'}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#ef4444',
              fontSize: '0.8125rem',
              padding: '0.45rem 0.75rem',
              fontWeight: 700,
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} /> Đăng Xuất
          </button>
        </div>
      </header>

      {/* Alert Banner */}
      {alertInfo.show && (
        <div style={{
          backgroundColor: alertInfo.type === 'success' ? '#f0fdf4' : alertInfo.type === 'info' ? '#eff6ff' : '#fef2f2',
          borderBottom: `1px solid ${alertInfo.type === 'success' ? '#86efac' : alertInfo.type === 'info' ? '#93c5fd' : '#fca5a5'}`,
          color: alertInfo.type === 'success' ? '#166534' : alertInfo.type === 'info' ? '#1e40af' : '#991b1b',
          padding: '0.875rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} />
            <span>{alertInfo.message}</span>
          </div>
          <button
            onClick={() => setAlertInfo(prev => ({ ...prev, show: false }))}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
        
        {/* TAB 1: ROOM SEARCH & LIVE BOOKING */}
        {activeTab === 'rooms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Search Filter Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1.25rem',
              alignItems: 'end'
            }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  📅 Ngày Nhận Phòng (Check-in)
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.5rem',
                    width: '100%',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  📅 Ngày Trả Phòng (Check-out)
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.5rem',
                    width: '100%',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  👥 Số Lượng Khách
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.5rem',
                    width: '100%',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  <option value={1}>1 Khách (Single)</option>
                  <option value={2}>2 Khách (Double / Couple)</option>
                  <option value={3}>3 Khách (Family)</option>
                  <option value={4}>4 Khách (VIP Family Suite)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  🏷️ Hạng Phòng
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.5rem',
                    width: '100%',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  <option value="ALL">Tất Cả Hạng Phòng</option>
                  <option value="STANDARD">Standard</option>
                  <option value="DELUXE">Deluxe</option>
                  <option value="SUITE">VIP Suite</option>
                </select>
              </div>

              <div>
                <button
                  onClick={loadData}
                  style={{
                    backgroundColor: '#1d4ed8',
                    border: 'none',
                    color: '#ffffff',
                    width: '100%',
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)'
                  }}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span>CẬP NHẬT PHÒNG TRỐNG</span>
                </button>
              </div>
            </div>

            {/* Room Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {filteredRoomTypes.map(room => {
                const isAvailable = room.availableCount > 0;

                return (
                  <div key={room.id} style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}>
                    <div>
                      {/* Room Image & Availability Badge */}
                      <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                        <img
                          src={room.image}
                          alt={room.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          display: 'flex',
                          gap: '0.5rem'
                        }}>
                          <span style={{
                            backgroundColor: '#1d4ed8',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '1rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}>
                            {room.category}
                          </span>
                        </div>

                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px'
                        }}>
                          {isAvailable ? (
                            <span style={{
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.6875rem',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '1rem',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                              ✓ Còn {room.availableCount} phòng trống
                            </span>
                          ) : (
                            <span style={{
                              backgroundColor: '#ef4444',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.6875rem',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '1rem',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                              ✕ Tạm hết phòng
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Room Info */}
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {room.name}
                          </h3>
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                          {room.description}
                        </p>

                        {/* Amenities */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                          {room.amenities.map((am, idx) => (
                            <span key={idx} style={{
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.25rem'
                            }}>
                              ✓ {am}
                            </span>
                          ))}
                        </div>

                        {/* Available room numbers pill */}
                        {isAvailable && (
                          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                            Các phòng sẵn sàng: {room.availableRooms.map(r => r.roomNumber).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room Card Footer */}
                    <div style={{
                      padding: '1.25rem',
                      backgroundColor: '#f8fafc',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đơn giá / Đêm:</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>
                          {formatCurrency(room.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(room)}
                        disabled={!isAvailable}
                        style={{
                          backgroundColor: isAvailable ? '#1d4ed8' : '#94a3b8',
                          border: 'none',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.8125rem',
                          padding: '0.625rem 1.125rem',
                          borderRadius: '0.5rem',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          boxShadow: isAvailable ? '0 4px 10px rgba(29, 78, 216, 0.25)' : 'none'
                        }}
                      >
                        <span>{isAvailable ? 'Đặt Phòng Ngay' : 'Hết Phòng'}</span>
                        {isAvailable && <ArrowRight size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: MY BOOKINGS LIST */}
        {activeTab === 'my-bookings' && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.75rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Đơn Đặt Phòng Của Bạn ({myBookings.length})
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Quản lý danh sách đặt chỗ, thời gian nhận phòng và trạng thái đơn hàng của bạn
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={loadData}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.45rem 0.875rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Làm Mới
                </button>
                <button
                  onClick={() => setActiveTab('rooms')}
                  style={{
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.45rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  + Đặt Thêm Phòng
                </button>
              </div>
            </div>

            {myBookings.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3.5rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px dashed #cbd5e1'
              }}>
                <BedDouble size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  Bạn chưa có đơn đặt phòng nào
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                  Hãy khám phá ngay các hạng phòng sang trọng tại Grand Horizon Resort & Spa và tận hưởng kỳ nghỉ lý tưởng!
                </p>
                <button
                  onClick={() => setActiveTab('rooms')}
                  style={{
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Khám Phá & Đặt Phòng Ngay
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myBookings.map(b => {
                  const checkInFormatted = b.checkInDate ? new Date(b.checkInDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
                  const checkOutFormatted = b.checkOutDate ? new Date(b.checkOutDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

                  const canCancel = b.status === 'BOOKED' || b.status === 'CONFIRMED' || b.status === 'Pending';
                  const services = bookingServicesMap[b.id] || [];
                  const serviceTotal = services.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
                  const roomTotal = b.totalAmount || 0;
                  const grandTotal = roomTotal + serviceTotal;

                  return (
                    <div key={b.id} style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.875rem',
                      padding: '1.25rem 1.5rem',
                      backgroundColor: b.status === 'CANCELLED' ? '#f8fafc' : '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{
                            backgroundColor: 
                              b.status === 'BOOKED' || b.status === 'CONFIRMED' ? '#dcfce7' :
                              b.status === 'CHECKED_IN' ? '#dbeafe' :
                              b.status === 'CHECKED_OUT' ? '#f1f5f9' : '#fee2e2',
                            color: 
                              b.status === 'BOOKED' || b.status === 'CONFIRMED' ? '#166534' :
                              b.status === 'CHECKED_IN' ? '#1e40af' :
                              b.status === 'CHECKED_OUT' ? '#475569' : '#991b1b',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '0.375rem'
                          }}>
                            ● {b.status === 'BOOKED' ? 'ĐÃ ĐẶT CHỖ' :
                                b.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN' :
                                b.status === 'CHECKED_IN' ? 'ĐANG LƯU TRÚ' :
                                b.status === 'CHECKED_OUT' ? 'ĐÃ TRẢ PHÒNG' :
                                b.status === 'CANCELLED' ? 'ĐÃ HỦY ĐƠN' : b.status}
                          </span>

                          <strong style={{ fontSize: '1.125rem', color: '#0f172a' }}>
                            Phòng {b.room?.roomNumber || 'Đang phân bổ'} - {b.room?.roomType?.name || 'Hạng phòng cao cấp'}
                          </strong>
                        </div>

                        <div style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                          <div>Mã đơn: <strong style={{ color: '#1d4ed8' }}>{b.bookingCode}</strong></div>
                          <div>•</div>
                          <div>📅 Nhận: <strong>{checkInFormatted}</strong></div>
                          <div>→</div>
                          <div>📅 Trả: <strong>{checkOutFormatted}</strong></div>
                          <div>•</div>
                          <div>👥 Khách: <strong>{b.numGuests || 1} người</strong></div>
                        </div>

                        {b.notes && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem' }}>
                            Ghi chú: {b.notes}
                          </div>
                        )}

                        {/* Ordered in-room services list */}
                        {services.length > 0 && (
                          <div style={{ marginTop: '0.75rem', padding: '0.625rem 0.875rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Coffee size={14} /> Dịch vụ phòng đã gọi ({services.length} món):
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {services.map(s => (
                                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#334155' }}>
                                  <span>• <strong>{s.service?.name}</strong> x{s.quantity}</span>
                                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatCurrency(s.totalPrice)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ textAlign: 'right', minWidth: '190px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                            <span>Tiền phòng:</span>
                            <strong style={{ color: '#0f172a' }}>{formatCurrency(roomTotal)}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2px' }}>
                            <span>Tiền dịch vụ:</span>
                            <strong style={{ color: serviceTotal > 0 ? '#ea580c' : '#64748b' }}>{formatCurrency(serviceTotal)}</strong>
                          </div>
                          <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '4px', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>Tổng chi phí:</span>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>
                              {formatCurrency(grandTotal)}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.6875rem', color: '#1d4ed8', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                            {b.status === 'CHECKED_OUT' ? '✓ Đã Thanh Toán Khi Trả Phòng' : 'Thanh toán tại quầy lễ tân'}
                          </span>
                        </div>

                        {canCancel && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            style={{
                              backgroundColor: '#fff1f2',
                              border: '1px solid #fecdd3',
                              color: '#e11d48',
                              padding: '0.5rem 0.875rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <XCircle size={14} /> Hủy Đặt
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IN-ROOM SERVICES */}
        {activeTab === 'services' && (() => {
          const activeBooking = myBookings.find(b => b.status === 'CHECKED_IN');
          const activeServices = activeBooking ? (bookingServicesMap[activeBooking.id] || []) : [];

          return (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              padding: '1.75rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Dịch Vụ Phục Vụ Tại Phòng (In-Room Services)
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Đặt đồ ăn, giặt ủi và các dịch vụ thư giãn phục vụ tận phòng của bạn trong vòng 15-30 phút
                </p>
              </div>

              {/* Status Banner: Check if Customer is Checked-in */}
              {!activeBooking ? (
                <div style={{
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  color: '#c2410c'
                }}>
                  <AlertCircle size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '0.9375rem', display: 'block', marginBottom: '2px' }}>
                      Chưa Thể Đặt Dịch Vụ: Quý Khách Chưa Làm Thủ Tục Nhận Phòng (Check-in)
                    </strong>
                    <span style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
                      Dịch vụ phòng chỉ khả dụng khi quý khách đang lưu trú tại khách sạn. Quý khách vui lòng làm thủ tục Check-in tại quầy lễ tân để được phân bổ phòng trước khi gọi dịch vụ.
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#1d4ed8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coffee size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: 800 }}>
                        ĐANG PHỤC VỤ TẬN NƠI: PHÒNG {activeBooking.room?.roomNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Hạng phòng: {activeBooking.room?.roomType?.name} • Khách hàng: <strong style={{ color: '#0f172a' }}>{activeBooking.guest?.fullName}</strong>
                      </div>
                    </div>
                  </div>
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.625rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800 }}>
                    ● Sẵn Sàng Gọi Phục Vụ
                  </span>
                </div>
              )}

              {/* Already Ordered In-Room Services for Current Room */}
              {activeBooking && activeServices.length > 0 && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Coffee size={16} color="#1d4ed8" /> Các Dịch Vụ Đã Gọi Lên Phòng {activeBooking.room?.roomNumber} ({activeServices.length} món)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                    {activeServices.map(item => (
                      <div key={item.id} style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong style={{ fontSize: '0.8125rem', color: '#0f172a', display: 'block' }}>{item.service?.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Số lượng: {item.quantity} • {new Date(item.orderedAt || Date.now()).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.875rem' }}>
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Cards Catalog */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {(hotelServices.length > 0 ? hotelServices : [
                  { id: 1, name: 'Bữa sáng buffet sang trọng', price: 150000, description: 'Buffet Á - Âu hơn 50 món, phục vụ tận phòng' },
                  { id: 2, name: 'Giặt ủi quần áo cao cấp', price: 50000, description: 'Giặt sấy, ủi phẳng và giao tận phòng trong 2h' },
                  { id: 3, name: 'Massage Spa thảo dược (60 phút)', price: 350000, description: 'Thư giãn toàn thân với tinh dầu cao cấp' },
                  { id: 4, name: 'Nước ngọt & Minibar tủ lạnh', price: 30000, description: 'Set 4 lon nước ngọt & trái cây nhiệt đới' }
                ]).map((serv) => (
                  <div key={serv.id} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.375rem 0' }}>
                        {serv.name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                        {serv.description}
                      </p>
                    </div>

                    <div style={{
                      marginTop: '1.25rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <strong style={{ fontSize: '1.05rem', color: '#16a34a' }}>
                        {formatCurrency(serv.price)}
                      </strong>
                      <button
                        onClick={() => handleOrderServiceQuick(serv)}
                        disabled={!activeBooking}
                        style={{
                          backgroundColor: activeBooking ? '#1d4ed8' : '#94a3b8',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.75rem',
                          padding: '0.45rem 0.875rem',
                          fontWeight: 700,
                          borderRadius: '0.375rem',
                          cursor: activeBooking ? 'pointer' : 'not-allowed',
                          opacity: activeBooking ? 1 : 0.7
                        }}
                      >
                        {activeBooking ? 'Gọi Phục Vụ' : 'Cần Check-in'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </main>

      {/* Customer Online Booking Modal */}
      {isBookingModalOpen && selectedRoomType && (
        <CustomerBookingModal
          isOpen={isBookingModalOpen}
          roomType={selectedRoomType}
          availableRooms={selectedRoomType.availableRooms || []}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialGuests={guestsCount}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

    </div>
  );
};
