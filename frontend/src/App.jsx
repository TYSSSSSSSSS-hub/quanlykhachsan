import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HeaderBar } from './components/HeaderBar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { RoomsPage } from './pages/RoomsPage';
import { GuestsPage } from './pages/GuestsPage';
import { StaffPage } from './pages/StaffPage';
import { RolesPage } from './pages/RolesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ServicesPage } from './pages/ServicesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { StaffWorkspacePage } from './pages/StaffWorkspacePage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';

import { BookingModal } from './components/BookingModal';
import { ServiceOrderModal } from './components/ServiceOrderModal';
import { InvoiceModal } from './components/InvoiceModal';
import { RoomTransferModal } from './components/RoomTransferModal';
import { ToastNotification } from './components/ToastNotification';

const MainLayout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [initialRoomForBooking, setInitialRoomForBooking] = useState(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedRoomForService, setSelectedRoomForService] = useState(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedBookingIdForInvoice, setSelectedBookingIdForInvoice] = useState(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedRoomForTransfer, setSelectedRoomForTransfer] = useState(null);
  const [selectedBookingForTransfer, setSelectedBookingForTransfer] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState({ isOpen: false, title: '', message: '', details: null, type: 'TRANSFER' });

  if (!user) {
    return <LoginPage />;
  }

  // 4 Roles Routing Logic
  const roleUpper = (user.role || '').toUpperCase();

  // Role 3: Staff -> Staff Workspace View
  if (roleUpper === 'STAFF' || roleUpper.includes('BUỒNG PHÒNG') || roleUpper.includes('HOUSEKEEPING')) {
    return <StaffWorkspacePage />;
  }

  // Role 4: Customer -> Customer Booking Portal View
  if (roleUpper === 'CUSTOMER' || roleUpper.includes('KHÁCH')) {
    return <CustomerPortalPage />;
  }

  const handleSelectRoom = (room, action) => {
    if (action === 'TRANSFER_ROOM') {
      setSelectedRoomForTransfer(room);
      setIsTransferModalOpen(true);
      return;
    }
    setInitialRoomForBooking(room);
    setIsBookingModalOpen(true);
  };

  const handleOrderService = (room) => {
    setSelectedRoomForService(room);
    setIsServiceModalOpen(true);
  };

  const handleCheckout = async (target) => {
    let bookingId = null;
    if (typeof target === 'number') {
      bookingId = target;
    } else if (target?.bookingCode) {
      bookingId = target.id;
    } else if (target?.roomNumber) {
      try {
        const bookings = await api.getBookings();
        const active = bookings.find(b => b.room?.id === target.id && (b.status === 'CHECKED_IN' || b.status === 'Checked-in'));
        if (active) {
          bookingId = active.id;
        } else {
          alert(`Phòng ${target.roomNumber} hiện không có đơn lưu trú nào đang Check-in.`);
          return;
        }
      } catch (err) {
        alert('Lỗi tìm đơn đặt phòng: ' + err.message);
        return;
      }
    } else if (target?.id) {
      bookingId = target.id;
    }

    if (bookingId) {
      setSelectedBookingIdForInvoice(bookingId);
      setIsInvoiceModalOpen(true);
    }
  };

  const handleTransferSuccess = (transferData) => {
    // 1. Instantly trigger real-time refresh without page reload F5
    setRefreshKey(prev => prev + 1);
    
    // 2. Display premium toast notification
    setToast({
      isOpen: true,
      title: `Chuyển sang phòng ${transferData?.newRoom || 'mới'} thành công!`,
      message: `Đã đổi phòng từ ${transferData?.oldRoom} sang ${transferData?.newRoom} cho ${transferData?.guestName || 'khách'}.`,
      details: transferData,
      type: 'TRANSFER'
    });
    setIsTransferModalOpen(false);
  };

  const handleBookingSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setToast({
      isOpen: true,
      title: 'Tạo đơn đặt phòng thành công!',
      message: 'Thông tin phòng và đơn đặt đã được lưu vào hệ thống thời gian thực.',
      details: { bookingCode: 'BK-' + (System.currentTimeMillis ? System.currentTimeMillis() % 1000000 : Math.floor(Math.random()*1000000)) },
      type: 'BOOKING'
    });
    setIsBookingModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <HeaderBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBookingModal={() => {
          setInitialRoomForBooking(null);
          setIsBookingModalOpen(true);
        }}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc' }}>
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenBookingModal={() => {
                setInitialRoomForBooking(null);
                setIsBookingModalOpen(true);
              }}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'reservations' && (
            <ReservationsPage
              refreshKey={refreshKey}
              onOpenBookingModal={() => {
                setInitialRoomForBooking(null);
                setIsBookingModalOpen(true);
              }}
              onCheckout={handleCheckout}
              onTransferRoom={(booking) => {
                setSelectedBookingForTransfer(booking);
                setSelectedRoomForTransfer(booking?.room);
                setIsTransferModalOpen(true);
              }}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomsPage
              refreshKey={refreshKey}
              onSelectRoom={handleSelectRoom}
              onOrderService={handleOrderService}
              onCheckout={handleCheckout}
            />
          )}

          {activeTab === 'guests' && <GuestsPage />}
          {activeTab === 'staff' && <StaffPage />}
          {activeTab === 'roles' && <RolesPage />}

          {activeTab === 'payments' && (
            <PaymentsPage
              onOpenInvoiceModal={(bookingId) => {
                setSelectedBookingIdForInvoice(bookingId || 1);
                setIsInvoiceModalOpen(true);
              }}
            />
          )}

          {activeTab === 'services' && <ServicesPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Toast Notification */}
      <ToastNotification
        isOpen={toast.isOpen}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
        title={toast.title}
        message={toast.message}
        details={toast.details}
        type={toast.type}
      />

      {/* Global Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialRoom={initialRoomForBooking}
        onSuccess={handleBookingSuccess}
      />

      <ServiceOrderModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        room={selectedRoomForService}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
          setIsServiceModalOpen(false);
        }}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        bookingId={selectedBookingIdForInvoice}
        onCheckoutSuccess={() => {
          setRefreshKey(prev => prev + 1);
          setIsInvoiceModalOpen(false);
        }}
      />

      <RoomTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        currentRoom={selectedRoomForTransfer}
        booking={selectedBookingForTransfer}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
