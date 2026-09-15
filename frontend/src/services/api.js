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
    return res.json();
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
    return res.json();
  },

  walkInCheckIn: async (bookingData) => {
    const res = await fetch(`${API_BASE_URL}/bookings/walk-in`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  checkIn: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/check-in`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  checkOut: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/check-out`, {
      method: 'POST',
      headers: getHeaders()
    });
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
    return res.json();
  },

  orderService: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/services/order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  getBookingServices: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/services/booking/${bookingId}`, { headers: getHeaders() });
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
