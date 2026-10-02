import React, { useState, useEffect } from 'react';
import {
  Coffee, Plus, Tag, Check, X, Search, Clock,
  Sparkles, Car, Utensils, Shirt, Edit3, Trash2, Power,
  RefreshCw, CheckCircle2, Ban, BellRing, Layers, TrendingUp,
  Receipt, BedDouble, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export const ServicesPage = () => {
  const [activeMainTab, setActiveMainTab] = useState('orders'); // 'orders' | 'catalog'
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Filters for Catalog
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [searchTerm, setSearchTerm] = useState('');

  // Filters for Orders
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL'); // 'ALL' | 'CHECKED_IN' | 'CHECKED_OUT'

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Breakfast',
    description: '',
    isActive: true
  });

  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (text, type = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  useEffect(() => {
    loadServices();
    loadOrders();
  }, []);

  const loadServices = () => {
    setLoading(true);
    api.getServices().then(data => {
      if (Array.isArray(data)) setServices(data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  const loadOrders = () => {
    setLoadingOrders(true);
    api.getAllServiceOrders().then(data => {
      if (Array.isArray(data)) setOrders(data);
    }).catch(console.error).finally(() => setLoadingOrders(false));
  };

  const handleRefreshAll = () => {
    loadServices();
    loadOrders();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      price: '',
      category: 'Breakfast',
      description: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price || '',
      category: service.category || 'Breakfast',
      description: service.description || '',
      isActive: service.isActive !== false
    });
    setShowModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        description: formData.description.trim(),
        isActive: formData.isActive
      };

      if (editingService) {
        await api.updateService(editingService.id, payload);
        showAlert(`✓ Cập nhật dịch vụ "${payload.name}" thành công!`);
      } else {
        await api.createService(payload);
        showAlert(`✓ Thêm mới dịch vụ "${payload.name}" thành công!`);
      }
      setShowModal(false);
      loadServices();
    } catch (err) {
      alert('Lỗi lưu dịch vụ: ' + err.message);
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      await api.toggleServiceStatus(service.id);
      showAlert(`✓ Đã ${service.isActive !== false ? 'tạm ngừng hoạt động' : 'kích hoạt lại'} dịch vụ "${service.name}"!`);
      loadServices();
    } catch (err) {
      alert('Lỗi đổi trạng thái dịch vụ: ' + err.message);
    }
  };

  const handleDeleteService = async (service) => {
    const confirmDel = window.confirm(`Bạn có chắc muốn xóa dịch vụ "${service.name}" khỏi danh mục không?`);
    if (!confirmDel) return;

    try {
      await api.deleteService(service.id);
      showAlert(`✓ Đã xóa dịch vụ "${service.name}"!`, 'info');
      loadServices();
    } catch (err) {
      alert('Lỗi xóa dịch vụ: ' + err.message);
    }
  };

  // Category Configuration with icons & luxury color tags
  const categoryConfig = {
    'Breakfast': { label: 'Bữa Sáng & Ẩm Thực', icon: Utensils, color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' },
    'Room Service': { label: 'Room Service Tận Phòng', icon: BellRing, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    'Spa': { label: 'Spa & Chăm Sóc', icon: Sparkles, color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8' },
    'Laundry': { label: 'Giặt Ủi Cao Cấp', icon: Shirt, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    'Airport Transfer': { label: 'Đưa Đón Sân Bay', icon: Car, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    'Minibar': { label: 'Minibar & Đồ Uống', icon: Coffee, color: '#ea580c', bg: '#fff7ed', border: '#ffedd5' },
  };

  const getCategoryMeta = (cat) => {
    return categoryConfig[cat] || {
      label: cat || 'Tiện Ích Khách Sạn',
      icon: Tag,
      color: '#475569',
      bg: '#f8fafc',
      border: '#e2e8f0'
    };
  };

  // Filter Catalog
  const filteredServices = services.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = categoryFilter === 'ALL' || (s.category || '').toUpperCase().includes(categoryFilter);
    const isAct = s.isActive !== false;
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACTIVE' && isAct) || 
                          (statusFilter === 'INACTIVE' && !isAct);

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    const roomNum = (order.booking?.room?.roomNumber || '').toLowerCase();
    const guestName = (order.booking?.guest?.fullName || '').toLowerCase();
    const serviceName = (order.service?.name || '').toLowerCase();
    const q = orderSearchTerm.toLowerCase();
    const matchesSearch = !q || roomNum.includes(q) || guestName.includes(q) || serviceName.includes(q);

    const isCheckedIn = order.booking?.status === 'CHECKED_IN' || order.booking?.status === 'Checked-in';
    const matchesStatus = orderStatusFilter === 'ALL' ||
                          (orderStatusFilter === 'CHECKED_IN' && isCheckedIn) ||
                          (orderStatusFilter === 'CHECKED_OUT' && !isCheckedIn);

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const activeCount = services.filter(s => s.isActive !== false).length;
  const inactiveCount = services.filter(s => s.isActive === false).length;
  const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const activeStayOrdersCount = orders.filter(o => o.booking?.status === 'CHECKED_IN' || o.booking?.status === 'Checked-in').length;

  return (
    <div style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#0f172a'
    }}>
      
      {/* Toast Alert */}
      {alertMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: alertMessage.type === 'info' ? '#1e293b' : '#064e3b',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '0.875rem',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
          fontWeight: 700,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Sparkles size={20} color={alertMessage.type === 'info' ? '#60a5fa' : '#34d399'} />
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Hero Header with Luxury Hotel Concierge Branding */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #1e293b 100%)',
        borderRadius: '1.25rem',
        padding: '2rem 2.25rem',
        color: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {/* Subtle Decorative Background Glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '20%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(234, 88, 12, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#fbbf24',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={13} />
            <span>5-STAR HOTEL CONCIERGE & IN-ROOM DINING</span>
          </div>

          <h1 style={{
            fontSize: '2.15rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.2
          }}>
            Dịch Vụ & Ẩm Thực Khách Sạn
          </h1>
          <p style={{
            fontSize: '0.9375rem',
            color: '#cbd5e1',
            margin: 0,
            lineHeight: 1.5
          }}>
            Quản lý bảng giá thực đơn, phục vụ phòng tận nơi, và theo dõi tức thì các yêu cầu gọi món từ khách lưu trú.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', position: 'relative', zIndex: 1 }}>
          <button
            onClick={handleRefreshAll}
            style={{
              padding: '0.625rem 1.125rem',
              borderRadius: '0.625rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
          >
            <RefreshCw size={15} className={(loading || loadingOrders) ? 'animate-spin' : ''} />
            Làm Mới
          </button>

          <button
            onClick={handleOpenCreateModal}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.625rem',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              fontSize: '0.875rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.4)';
            }}
          >
            <Plus size={18} />
            + Thêm Dịch Vụ Mới
          </button>
        </div>
      </div>

      {/* KPI Row (4 Modern Stat Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* Stat 1: Total Services in Catalog */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '1.35rem 1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                DANH MỤC DỊCH VỤ
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem', lineHeight: 1.1 }}>
                {services.length} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Món</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '0.75rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} color="#2563eb" />
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>6 phân nhóm:</span> Ẩm thực, Spa, Giặt ủi, Minibar...
          </div>
        </div>

        {/* Stat 2: Active Services */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '1.35rem 1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ĐANG PHỤC VỤ (ACTIVE)
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#16a34a', marginTop: '0.35rem', lineHeight: 1.1 }}>
                {activeCount} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#16a34a' }}>Sẵn Sàng</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '0.75rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="#16a34a" />
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
            {inactiveCount > 0 ? (
              <span style={{ color: '#ea580c', fontWeight: 700 }}>⚠️ Có {inactiveCount} dịch vụ tạm dừng phục vụ</span>
            ) : (
              <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ 100% dịch vụ đang mở phục vụ phòng</span>
            )}
          </div>
        </div>

        {/* Stat 3: Room Orders */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '1.35rem 1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                YÊU CẦU GỌI TẠI PHÒNG
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem', lineHeight: 1.1 }}>
                {orders.length} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Lượt đặt</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '0.75rem', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BellRing size={20} color="#ea580c" />
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
            <strong style={{ color: '#ea580c' }}>{activeStayOrdersCount}</strong> yêu cầu từ khách đang lưu trú
          </div>
        </div>

        {/* Stat 4: Service Revenue */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '1.35rem 1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                DOANH THU DỊCH VỤ PHÁT SINH
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem', lineHeight: 1.1 }}>
                {formatCurrency(totalOrderRevenue)}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '0.75rem', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="#059669" />
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
            Tự động cộng dồn vào hóa đơn thanh toán khi trả phòng
          </div>
        </div>

      </div>

      {/* Modern Segmented Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '0.625rem 0.75rem',
        borderRadius: '1rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          <button
            onClick={() => setActiveMainTab('orders')}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.625rem',
              border: 'none',
              backgroundColor: activeMainTab === 'orders' ? '#0f172a' : 'transparent',
              color: activeMainTab === 'orders' ? '#ffffff' : '#64748b',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              transition: 'all 0.2s ease',
              boxShadow: activeMainTab === 'orders' ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            }}
          >
            <BellRing size={16} color={activeMainTab === 'orders' ? '#38bdf8' : '#64748b'} />
            <span>Yêu Cầu Dịch Vụ Tại Phòng</span>
            <span style={{
              backgroundColor: activeMainTab === 'orders' ? '#334155' : '#f1f5f9',
              color: activeMainTab === 'orders' ? '#ffffff' : '#475569',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('catalog')}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.625rem',
              border: 'none',
              backgroundColor: activeMainTab === 'catalog' ? '#0f172a' : 'transparent',
              color: activeMainTab === 'catalog' ? '#ffffff' : '#64748b',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              transition: 'all 0.2s ease',
              boxShadow: activeMainTab === 'catalog' ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            }}
          >
            <Layers size={16} color={activeMainTab === 'catalog' ? '#38bdf8' : '#64748b'} />
            <span>Bảng Giá & Menu Dịch Vụ</span>
            <span style={{
              backgroundColor: activeMainTab === 'catalog' ? '#334155' : '#f1f5f9',
              color: activeMainTab === 'catalog' ? '#ffffff' : '#475569',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {services.length}
            </span>
          </button>

        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
            {activeMainTab === 'orders' ? `Hiển thị ${filteredOrders.length}/${orders.length} đơn gọi phòng` : `Hiển thị ${filteredServices.length}/${services.length} dịch vụ`}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ROOM SERVICE ORDERS (YÊU CẦU DỊCH VỤ TẠI PHÒNG)                     */}
      {/* ========================================================================= */}
      {activeMainTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Orders Filter & Search Toolbar */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              flex: 1,
              minWidth: '280px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '0.625rem',
              padding: '0.625rem 0.875rem'
            }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Tìm nhanh theo số phòng (P101), tên khách hàng, hoặc tên dịch vụ..."
                value={orderSearchTerm}
                onChange={e => setOrderSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0f172a',
                  width: '100%',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              />
              {orderSearchTerm && (
                <button
                  onClick={() => setOrderSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Quick Status Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {[
                { label: 'Tất Cả Yêu Cầu', val: 'ALL', count: orders.length },
                { label: '● Đang Lưu Trú', val: 'CHECKED_IN', count: activeStayOrdersCount },
                { label: '○ Đã Trả Phòng', val: 'CHECKED_OUT', count: orders.length - activeStayOrdersCount },
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setOrderStatusFilter(f.val)}
                  style={{
                    backgroundColor: orderStatusFilter === f.val ? '#1e293b' : '#f8fafc',
                    color: orderStatusFilter === f.val ? '#ffffff' : '#475569',
                    border: orderStatusFilter === f.val ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{f.label}</span>
                  <span style={{
                    backgroundColor: orderStatusFilter === f.val ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                    color: orderStatusFilter === f.val ? '#ffffff' : '#64748b',
                    fontSize: '0.6875rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px',
                    fontWeight: 800
                  }}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table Container */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                    color: '#475569',
                    borderBottom: '1px solid #e2e8f0',
                    textTransform: 'uppercase',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.06em',
                    fontWeight: 800
                  }}>
                    <th style={{ padding: '1rem 1.25rem' }}>SỐ PHÒNG</th>
                    <th style={{ padding: '1rem 1.25rem' }}>KHÁCH HÀNG</th>
                    <th style={{ padding: '1rem 1.25rem' }}>DỊCH VỤ / MÓN GỌI</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>SỐ LƯỢNG</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>ĐƠN GIÁ</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>THÀNH TIỀN</th>
                    <th style={{ padding: '1rem 1.25rem' }}>THỜI GIAN ĐẶT</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{
                          display: 'inline-flex',
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: '#f1f5f9',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem'
                        }}>
                          <BellRing size={26} color="#94a3b8" />
                        </div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                          Chưa có yêu cầu dịch vụ nào phù hợp
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                          Khi khách hàng gọi món hoặc nhân viên order dịch vụ lên phòng, thông tin sẽ hiển thị tức thì tại đây.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, idx) => {
                      const roomNum = order.booking?.room?.roomNumber;
                      const roomFloor = order.booking?.room?.floor || 1;
                      const roomTypeName = order.booking?.room?.roomType?.name || 'Phòng Khách Sạn';
                      const guestName = order.booking?.guest?.fullName || 'Khách Lưu Trú';
                      const guestPhone = order.booking?.guest?.phone || '';
                      const isCheckedIn = order.booking?.status === 'CHECKED_IN' || order.booking?.status === 'Checked-in';
                      const catMeta = getCategoryMeta(order.service?.category);
                      const CatIcon = catMeta.icon;

                      return (
                        <tr
                          key={order.id || idx}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa'}
                        >
                          {/* Room Number Badge */}
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                              <div style={{
                                backgroundColor: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#1d4ed8',
                                fontWeight: 800,
                                fontSize: '0.9375rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '0.5rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem'
                              }}>
                                <BedDouble size={15} />
                                <span>{roomNum ? `Phòng ${roomNum}` : 'Chưa phân'}</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                <div style={{ fontWeight: 700, color: '#334155' }}>Tầng {roomFloor}</div>
                                <div style={{ fontSize: '0.6875rem' }}>{roomTypeName}</div>
                              </div>
                            </div>
                          </td>

                          {/* Guest Info */}
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                              <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                                color: '#334155',
                                fontWeight: 800,
                                fontSize: '0.8125rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {guestName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{guestName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{guestPhone || 'Không có SĐT'}</div>
                              </div>
                            </div>
                          </td>

                          {/* Ordered Service */}
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '0.375rem',
                                backgroundColor: catMeta.bg,
                                color: catMeta.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <CatIcon size={14} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>
                                  {order.service?.name || 'Dịch vụ'}
                                </div>
                                <div style={{ fontSize: '0.6875rem', color: catMeta.color, fontWeight: 700 }}>
                                  {catMeta.label}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                            <span style={{
                              backgroundColor: '#eff6ff',
                              color: '#1d4ed8',
                              fontWeight: 800,
                              fontSize: '0.875rem',
                              padding: '0.2rem 0.625rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #bfdbfe'
                            }}>
                              x{order.quantity || 1}
                            </span>
                          </td>

                          {/* Unit Price */}
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>
                            {formatCurrency(order.service?.price)}
                          </td>

                          {/* Total Price */}
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.9375rem' }}>
                              {formatCurrency(order.totalPrice)}
                            </div>
                          </td>

                          {/* Order Time */}
                          <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8125rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Clock size={13} color="#94a3b8" />
                              <span>{order.orderedAt ? new Date(order.orderedAt).toLocaleString('vi-VN') : 'Vừa mới đặt'}</span>
                            </div>
                          </td>

                          {/* Stay Status */}
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                            <span style={{
                              backgroundColor: isCheckedIn ? '#dcfce7' : '#f1f5f9',
                              color: isCheckedIn ? '#15803d' : '#475569',
                              border: isCheckedIn ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem'
                            }}>
                              <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: isCheckedIn ? '#22c55e' : '#94a3b8'
                              }} />
                              {isCheckedIn ? 'Đang Lưu Trú' : 'Đã Trả Phòng'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SERVICE CATALOG & PRICING (BẢNG GIÁ & MENU DỊCH VỤ)                */}
      {/* ========================================================================= */}
      {activeMainTab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Filter & Search Toolbar */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            {/* Top row: Search and Status dropdown */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                flex: 1,
                minWidth: '260px',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '0.625rem',
                padding: '0.625rem 0.875rem'
              }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ theo tên món ăn, mô tả, danh mục..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#0f172a',
                    width: '100%',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.625rem 1rem',
                  borderRadius: '0.625rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="ALL">Tất Cả Trạng Thái</option>
                <option value="ACTIVE">Chỉ Hiện Đang Phục Vụ (Active)</option>
                <option value="INACTIVE">Chỉ Hiện Ngừng Phục Vụ (Inactive)</option>
              </select>
            </div>

            {/* Bottom row: Category Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
              scrollbarWidth: 'thin'
            }}>
              {[
                { label: 'Tất Cả Danh Mục', val: 'ALL', icon: Layers },
                { label: 'Ẩm Thực & Bữa Sáng', val: 'BREAKFAST', icon: Utensils },
                { label: 'Room Service Tận Phòng', val: 'ROOM SERVICE', icon: BellRing },
                { label: 'Spa & Massage Thảo Dược', val: 'SPA', icon: Sparkles },
                { label: 'Giặt Ủi Cao Cấp', val: 'LAUNDRY', icon: Shirt },
                { label: 'Đưa Đón Sân Bay VIP', val: 'AIRPORT', icon: Car },
                { label: 'Minibar & Đồ Uống', val: 'MINIBAR', icon: Coffee },
              ].map(p => {
                const IconComponent = p.icon;
                const isSelected = categoryFilter === p.val;
                return (
                  <button
                    key={p.val}
                    onClick={() => setCategoryFilter(p.val)}
                    style={{
                      backgroundColor: isSelected ? '#1e293b' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: isSelected ? '1px solid #1e293b' : '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.875rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <IconComponent size={14} color={isSelected ? '#38bdf8' : '#64748b'} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Cards Grid */}
          {filteredServices.length === 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '4rem 2rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              color: '#64748b'
            }}>
              <div style={{
                display: 'inline-flex',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Search size={26} color="#94a3b8" />
              </div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                Không tìm thấy dịch vụ nào phù hợp
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
                Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn lại bộ lọc danh mục.
              </p>
              <button
                onClick={handleOpenCreateModal}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                + Thêm Dịch Vụ Mới Ngay
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}>
              {filteredServices.map((s, idx) => {
                const isAct = s.isActive !== false;
                const catMeta = getCategoryMeta(s.category);
                const CatIcon = catMeta.icon;

                return (
                  <div
                    key={s.id || idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: isAct ? '1px solid #e2e8f0' : '1px dashed #fca5a5',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.25s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* Top colored accent bar based on category */}
                    <div style={{ height: '4px', backgroundColor: isAct ? catMeta.color : '#cbd5e1' }} />

                    {/* Card Body */}
                    <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      {/* Category Badge & Status Pill */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                        <div style={{
                          backgroundColor: catMeta.bg,
                          border: `1px solid ${catMeta.border}`,
                          color: catMeta.color,
                          fontWeight: 800,
                          fontSize: '0.6875rem',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '0.375rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <CatIcon size={12} />
                          <span>{catMeta.label}</span>
                        </div>

                        {isAct ? (
                          <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            ● Đang Phục Vụ
                          </span>
                        ) : (
                          <span style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            fontWeight: 800,
                            fontSize: '0.6875rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            ○ Tạm Ngừng
                          </span>
                        )}
                      </div>

                      {/* Service Title */}
                      <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: isAct ? '#0f172a' : '#64748b',
                        margin: '0 0 0.5rem 0',
                        lineHeight: 1.3
                      }}>
                        {s.name}
                      </h3>
                      
                      {/* Service Description */}
                      <p style={{
                        fontSize: '0.8125rem',
                        color: '#64748b',
                        margin: '0 0 1rem 0',
                        lineHeight: 1.5,
                        flex: 1
                      }}>
                        {s.description || 'Dịch vụ tiện ích phục vụ nhanh chóng tận phòng cho quý khách lưu trú.'}
                      </p>

                      {/* Price Display */}
                      <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.625rem',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                          Đơn Giá Niêm Yết
                        </span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isAct ? '#16a34a' : '#94a3b8' }}>
                          {formatCurrency(s.price)}
                        </div>
                      </div>

                      {/* Actions Toolbar */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          style={{
                            flex: 1,
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#1d4ed8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.375rem',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <Edit3 size={13} /> Sửa
                        </button>

                        <button
                          onClick={() => handleToggleStatus(s)}
                          style={{
                            flex: 1,
                            backgroundColor: isAct ? '#fff1f2' : '#f0fdf4',
                            border: isAct ? '1px solid #fecdd3' : '1px solid #86efac',
                            color: isAct ? '#e11d48' : '#16a34a',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.375rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Power size={13} /> {isAct ? 'Tạm Ngừng' : 'Bật Lại'}
                        </button>

                        <button
                          onClick={() => handleDeleteService(s)}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#dc2626',
                            padding: '0.5rem 0.625rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                            e.currentTarget.style.borderColor = '#fca5a5';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}
                          title="Xóa dịch vụ khỏi hệ thống"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SERVICE (THÊM / SỬA DỊCH VỤ)                              */}
      {/* ========================================================================= */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.25rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1.25rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.5rem',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Utensils size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    {editingService ? `Mã dịch vụ: #${editingService.id}` : 'Điền thông tin tiện ích và đơn giá niêm yết'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Service Name */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Tên Dịch Vụ / Món Ăn *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bữa sáng buffet tại phòng, Rượu vang thượng hạng..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    width: '100%',
                    padding: '0.6875rem 0.875rem',
                    borderRadius: '0.625rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              {/* Category & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Danh Mục Dịch Vụ *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      width: '100%',
                      padding: '0.6875rem 0.875rem',
                      borderRadius: '0.625rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Breakfast">Breakfast (Bữa sáng)</option>
                    <option value="Room Service">Room Service (Ăn uống phòng)</option>
                    <option value="Laundry">Laundry (Giặt ủi)</option>
                    <option value="Spa">Spa & Massage</option>
                    <option value="Airport Transfer">Airport Transfer (Đưa đón)</option>
                    <option value="Minibar">Minibar & Đồ uống</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    💰 Đơn Giá (VND) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    placeholder="150000"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={{
                      backgroundColor: '#f0fdf4',
                      border: '1.5px solid #86efac',
                      color: '#166534',
                      width: '100%',
                      padding: '0.6875rem 0.875rem',
                      borderRadius: '0.625rem',
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Mô Tả Tiện Ích & Chi Tiết
                </label>
                <textarea
                  placeholder="Mô tả chi tiết nguyên liệu món ăn, khung giờ phục vụ hoặc quy trình đáp ứng..."
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    width: '100%',
                    padding: '0.6875rem 0.875rem',
                    borderRadius: '0.625rem',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Active Toggle */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Trạng Thái Phục Vụ
                </label>
                <select
                  value={formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                  onChange={e => setFormData({ ...formData, isActive: e.target.value === 'ACTIVE' })}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    width: '100%',
                    padding: '0.6875rem 0.875rem',
                    borderRadius: '0.625rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="ACTIVE">Kích Hoạt (Khách hàng có thể gọi)</option>
                  <option value="INACTIVE">Tạm Ngừng Hoạt Động (Ẩn khỏi menu)</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.625rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.625rem',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  {editingService ? 'Lưu Thay Đổi' : 'Tạo Dịch Vụ'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};