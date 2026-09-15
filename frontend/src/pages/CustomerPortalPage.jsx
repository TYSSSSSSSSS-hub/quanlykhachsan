import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from '../components/BookingModal';

export const CustomerPortalPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');

  // Search State
  const [checkInDate, setCheckInDate] = useState('2026-09-20');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-22');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  // Demo My Bookings
  const [myBookings, setMyBookings] = useState([
    {
      id: 1,
      bookingCode: 'RSH-9821',
      roomName: 'P202 - Deluxe Ocean View',
      checkIn: '2026-09-20 14:00',
      checkOut: '2026-09-22 12:00',
      totalAmount: 2400000,
      status: 'CONFIRMED',
      paymentStatus: 'PAID'
    }
  ]);

  // Demo Customer Service Orders
  const [myServices, setMyServices] = useState([
    { id: 1, serviceName: 'Bữa sáng buffet sang trọng', room: 'P202', price: 150000, status: 'Đã hoàn thành', time: '2026-09-21 08:00' }
  ]);

  const roomTypesData = [
    {
      id: 1,
      name: 'Standard Single Room',
      category: 'Standard',
      price: 450000,
      capacity: 1,
      description: 'Phòng tiêu chuẩn 1 giường đơn ấm cúng, thiết kế hiện đại, đầy đủ tiện nghi cho chuyến công tác ngắn ngày.',
      amenities: ['Wifi miễn phí tốc độ cao', 'TV 43" Smart HD', 'Điều hòa 2 chiều', 'Bàn làm việc'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Standard Double Room',
      category: 'Standard',
      price: 650000,
      capacity: 2,
      description: 'Phòng tiêu chuẩn 1 giường đôi cỡ lớn, không gian thoáng mát, lý tưởng cho cặp đôi nghỉ dưỡng.',
      amenities: ['Wifi miễn phí', 'TV 50" Smart HD', 'Minibar & Tủ lạnh', 'Máy sấy tóc & Bộ vệ sinh'],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Deluxe Ocean View',
      category: 'Deluxe',
      price: 1200000,
      capacity: 2,
      description: 'Phòng sang trọng tầm nhìn trực diện biển Đà Nẵng, có ban công riêng và bồn tắm Jacuzzi cao cấp.',
      amenities: ['Giường King Size', 'View trực diện biển', 'Ban công rộng rãi', 'Bồn tắm Jacuzzi', 'Máy pha cà phê Espresso'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'VIP Executive Suite',
      category: 'Suite',
      price: 2500000,
      capacity: 4,
      description: 'Căn hộ Khách sạn VIP với 2 phòng ngủ riêng biệt, phòng khách tiếp khách sang trọng và view toàn cảnh bãi biển.',
      amenities: ['2 Giường King Beds', 'Phòng khách riêng', 'Ban công Panorama 360', 'Dịch vụ Butler 24/7', 'Phòng xông hơi'],
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleOrderServiceQuick = (serviceName, price) => {
    const newService = {
      id: Date.now(),
      serviceName: serviceName,
      room: 'P202',
      price: price,
      status: 'Đang xử lý',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setMyServices([newService, ...myServices]);
    alert(`Đã gửi yêu cầu dịch vụ "${serviceName}" thành công! Nhân viên sẽ mang lên phòng cho quý khách.`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Customer Bar */}
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
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
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
            <Building2 size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              GRAND HORIZON RESORT & SPA
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
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
              border: 'none',
              backgroundColor: activeTab === 'rooms' ? '#1d4ed8' : '#ffffff',
              color: activeTab === 'rooms' ? '#ffffff' : '#64748b',
              border: activeTab === 'rooms' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            🏩 Tìm & Đặt Phòng
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: activeTab === 'my-bookings' ? '#1d4ed8' : '#ffffff',
              color: activeTab === 'my-bookings' ? '#ffffff' : '#64748b',
              border: activeTab === 'my-bookings' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            📋 Phòng Đã Đặt Của Tôi ({myBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: activeTab === 'services' ? '#1d4ed8' : '#ffffff',
              color: activeTab === 'services' ? '#ffffff' : '#64748b',
              border: activeTab === 'services' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            🍽️ Dịch Vụ Tại Phòng
          </button>
        </nav>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>{user?.fullName || 'Khách Hàng'}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>● Đã đăng nhập</div>
          </div>
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#ef4444', fontSize: '0.8125rem', padding: '0.45rem 0.75rem', fontWeight: 700 }}
          >
            <LogOut size={15} /> Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* TAB 1: SEARCH & BOOK ROOMS */}
        {activeTab === 'rooms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Hero Search Box */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  📅 NGÀY NHẬN PHÒNG (CHECK-IN)
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', width: '100%', fontSize: '0.875rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  📅 NGÀY TRẢ PHÒNG (CHECK-OUT)
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', width: '100%', fontSize: '0.875rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  👥 SỐ LƯỢNG KHÁCH
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', width: '100%', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <option value={1}>1 Khách (Single)</option>
                  <option value={2}>2 Khách (Double / Couple)</option>
                  <option value={4}>4 Khách (Family Suite)</option>
                </select>
              </div>

              <div>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', width: '100%', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Search size={18} /> TÌM PHÒNG SẴN SÀNG
                </button>
              </div>
            </div>

            {/* Room Category Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {roomTypesData.map(room => (
                <div key={room.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                      <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#1d4ed8',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.6875rem',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '1rem'
                      }}>
                        {room.category}
                      </span>
                    </div>

                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{room.name}</h3>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 1rem 0', lineHeight: 1.4 }}>{room.description}</p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                        {room.amenities.map((am, idx) => (
                          <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đơn giá / Đêm:</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRoomType(room);
                        setIsBookingModalOpen(true);
                      }}
                      className="btn btn-primary"
                      style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 800, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
                    >
                      Đặt Phòng Ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'my-bookings' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Danh Sách Đơn Đặt Phòng Của Bạn</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myBookings.map(b => (
                <div key={b.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                        ● {b.status}
                      </span>
                      <strong style={{ fontSize: '1.125rem', color: '#0f172a' }}>{b.roomName}</strong>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                      Mã đặt phòng: <strong>{b.bookingCode}</strong> • Nhận: {b.checkIn} → Trả: {b.checkOut}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalAmount)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700 }}>{b.paymentStatus === 'PAID' ? '✓ Đã Thanh Toán' : 'Chờ Thanh Toán'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ROOM SERVICES */}
        {activeTab === 'services' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Dịch Vụ Phục Vụ Tại Phòng (In-Room Services)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {[
                { name: 'Bữa sáng buffet tại phòng', price: 150000, desc: 'Set bánh mì, trứng ốp la, hoa quả & cà phê Ý' },
                { name: 'Giặt ủi quần áo lấy ngay', price: 80000, desc: 'Giặt sấy, ủi phẳng và giao tận phòng trong 2h' },
                { name: 'Dịch vụ Massage & Spa VIP', price: 500000, desc: 'Thư giãn 60 phút với tinh dầu thảo dược cao cấp' },
                { name: 'Minibar & Đồ uống lạnh', price: 120000, desc: 'Set 4 lon nước ngọt & trái cây tươi mọng' }
              ].map((serv, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>{serv.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{serv.desc}</p>
                  </div>
                  <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1rem', color: '#16a34a' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(serv.price)}</strong>
                    <button
                      onClick={() => handleOrderServiceQuick(serv.name, serv.price)}
                      className="btn btn-primary"
                      style={{ backgroundColor: '#1d4ed8', color: '#fff', fontSize: '0.75rem', padding: '0.35rem 0.625rem', fontWeight: 700 }}
                    >
                      Gọi Dịch Vụ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedRoomType && (
        <BookingModal
          roomType={selectedRoomType}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestsCount={guestsCount}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={() => {
            setIsBookingModalOpen(false);
            setActiveTab('my-bookings');
          }}
        />
      )}

    </div>
  );
};
