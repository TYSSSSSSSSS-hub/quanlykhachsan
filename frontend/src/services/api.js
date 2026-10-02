const API_BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Đăng nhập thất bại');
    }
    return res.json();
  },

  register: async (registerData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Đăng ký thất bại');
    }
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
    if (!res.ok) return null;
    return res.json();
  },

  changePassword: async (passwordData) => {
    const res = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(passwordData)
    });
    return res.json();
  },

  // Dashboard & Reports
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, { headers: getHeaders() });
    return res.json();
  },

  getReportSummary: async () => {
    const res = await fetch(`${API_BASE_URL}/reports/summary`, { headers: getHeaders() });
    return res.json();
  },

  // Rooms & Types
  getRooms: async () => {
    const res = await fetch(`${API_BASE_URL}/rooms`, { headers: getHeaders() });
    return res.json();
  },

  getRoomTypes: async () => {
    const res = await fetch(`${API_BASE_URL}/rooms/types`, { headers: getHeaders() });
    return res.json();
  },

  updateRoomStatus: async (roomId, status) => {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  createRoom: async (roomData) => {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(roomData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Thêm phòng thất bại');
    }
    return res.json();
  },

  updateRoom: async (roomId, roomData) => {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(roomData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Cập nhật phòng thất bại');
    }
    return res.json();
  },

  deleteRoom: async (roomId) => {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Xóa phòng thất bại');
    }
    return true;
  },

  createRoomType: async (typeData) => {
    const res = await fetch(`${API_BASE_URL}/rooms/types`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(typeData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Thêm loại phòng thất bại');
    }
    return res.json();
  },

  updateRoomType: async (typeId, typeData) => {
    const res = await fetch(`${API_BASE_URL}/rooms/types/${typeId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(typeData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Cập nhật loại phòng & giá thất bại');
    }
    return res.json();
  },

  toggleRoomTypeStatus: async (typeId) => {
    const res = await fetch(`${API_BASE_URL}/rooms/types/${typeId}/toggle-status`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Đổi trạng thái loại phòng thất bại');
    }
    return res.json();
  },

  deleteRoomType: async (typeId) => {
    const res = await fetch(`${API_BASE_URL}/rooms/types/${typeId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Xóa loại phòng thất bại');
    }
    return true;
  },

  // Bookings / Reservations
  getBookings: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings`, { headers: getHeaders() });
    return res.json();
  },

  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Đặt phòng thất bại');
    }
    return res.json();
  },

  cancelBooking: async (bookingId, reason = 'Khách yêu cầu hủy đơn') => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason, refundAmount: 0 })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Hủy đơn đặt phòng thất bại');
    }
    return res.json();
  },

  walkInCheckIn: async (bookingData) => {
    const res = await fetch(`${API_BASE_URL}/bookings/walk-in`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      let errMsg = 'Nhận phòng walk-in thất bại';
      try { const j = await res.json(); errMsg = j.message || errMsg; } catch (_) { try { errMsg = await res.text(); } catch (_) {} }
      throw new Error(errMsg);
    }
    return res.json();
  },

  confirmBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) {
      let errMsg = 'Xác nhận đặt phòng thất bại';
      try { const j = await res.json(); errMsg = j.message || errMsg; } catch (_) { try { errMsg = await res.text(); } catch (_) {} }
      throw new Error(errMsg);
    }
    return res.json();
  },

  checkIn: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/check-in`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) {
      let errMsg = 'Check-in thất bại';
      try { const j = await res.json(); errMsg = j.message || errMsg; } catch (_) { try { errMsg = await res.text(); } catch (_) {} }
      throw new Error(errMsg);
    }
    return res.json();
  },

  checkOut: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/check-out`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) {
      let errMsg = 'Check-out thất bại';
      try { const j = await res.json(); errMsg = j.message || errMsg; } catch (_) { try { errMsg = await res.text(); } catch (_) {} }
      throw new Error(errMsg);
    }
    return res.json();
  },

  transferRoom: async (bookingId, transferData) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/transfer-room`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(transferData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Chuyển phòng thất bại');
    }
    return res.json();
  },

  // Guests
  getGuests: async () => {
    const res = await fetch(`${API_BASE_URL}/guests`, { headers: getHeaders() });
    return res.json();
  },

  createGuest: async (guestData) => {
    const res = await fetch(`${API_BASE_URL}/guests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(guestData)
    });
    return res.json();
  },

  // Services
  getServices: async () => {
    const res = await fetch(`${API_BASE_URL}/services`, { headers: getHeaders() });
    return res.json();
  },

  createService: async (serviceData) => {
    const res = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(serviceData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Thêm dịch vụ thất bại');
    }
    return res.json();
  },

  updateService: async (serviceId, serviceData) => {
    const res = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(serviceData)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Cập nhật dịch vụ thất bại');
    }
    return res.json();
  },

  toggleServiceStatus: async (serviceId) => {
    const res = await fetch(`${API_BASE_URL}/services/${serviceId}/toggle-status`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Đổi trạng thái dịch vụ thất bại');
    }
    return res.json();
  },

  deleteService: async (serviceId) => {
    const res = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Xóa dịch vụ thất bại');
    }
    return true;
  },

  orderService: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/services/order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      let errMsg = 'Đặt dịch vụ thất bại';
      try {
        const errJson = await res.json();
        errMsg = errJson.message || errMsg;
      } catch (_) {
        const text = await res.text();
        if (text) errMsg = text;
      }
      throw new Error(errMsg);
    }
    return res.json();
  },

  getMyBookings: async (phone, email) => {
    const params = new URLSearchParams();
    if (phone) params.append('phone', phone);
    if (email) params.append('email', email);
    const res = await fetch(`${API_BASE_URL}/bookings/my?${params.toString()}`, { headers: getHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  getBookingServices: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/services/booking/${bookingId}`, { headers: getHeaders() });
    return res.json();
  },

  getAllServiceOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/services/orders`, { headers: getHeaders() });
    return res.json();
  },

  // Staff & Roles
  getStaff: async () => {
    const res = await fetch(`${API_BASE_URL}/staff`, { headers: getHeaders() });
    return res.json();
  },

  createStaff: async (staffData) => {
    const res = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(staffData)
    });
    return res.json();
  },

  getRoles: async () => {
    const res = await fetch(`${API_BASE_URL}/roles`, { headers: getHeaders() });
    return res.json();
  },

  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    return res.json();
  },

  // Invoices & Payments
  getInvoices: async () => {
    const res = await fetch(`${API_BASE_URL}/invoices`, { headers: getHeaders() });
    return res.json();
  },

  getInvoiceByBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/invoices/booking/${bookingId}`, { headers: getHeaders() });
    return res.json();
  }
};
