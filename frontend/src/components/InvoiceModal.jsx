import React, { useState, useEffect } from 'react';
import { X, Printer, CheckCircle, Hotel, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const InvoiceModal = ({ isOpen, onClose, bookingId, onCheckoutSuccess }) => {
  const [invoice, setInvoice] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && bookingId) {
      setLoading(true);
      api.getInvoiceByBooking(bookingId).then(data => {
        setInvoice(data);
        if (data?.booking?.id) {
          api.getBookingServices(data.booking.id).then(setServices);
        }
        setLoading(false);
      });
    }
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmCheckout = async () => {
    try {
      await api.checkOut(bookingId);
      alert('✓ Trả phòng thành công! Phòng đã chuyển sang trạng thái Cần dọn dẹp (CLEANING) để buồng phòng dọn dẹp trước khi đón khách mới.');
      if (onCheckoutSuccess) onCheckoutSuccess();
      onClose();
    } catch (err) {
      alert('Lỗi khi trả phòng: ' + err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Đang khởi tạo hóa đơn...</div>
        ) : (
          <div className="printable-invoice">
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 800, fontSize: '1.25rem' }}>
                  <Hotel size={24} /> ROYAL HOTEL & RESORT
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px' }}>
                  Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh<br />
                  Hotline: (028) 3829 9999 | Email: info@royalhotel.com
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>HÓA ĐƠN THANH TOÁN</h2>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#b45309', marginTop: '2px' }}>
                  {invoice?.invoiceNumber}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Ngày xuất: {new Date(invoice?.createdAt || Date.now()).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>

            {/* Guest & Room Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem' }}>THÔNG TIN KHÁCH HÀNG</p>
                <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{invoice?.booking?.guest?.fullName}</p>
                <p>SĐT: {invoice?.booking?.guest?.phone}</p>
                <p>CCCD/Hộ chiếu: {invoice?.booking?.guest?.idCard || 'N/A'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#64748b', fontSize: '0.75rem' }}>THÔNG TIN PHÒNG</p>
                <p style={{ fontWeight: 700, color: '#b45309', fontSize: '1rem' }}>PHÒNG {invoice?.booking?.room?.roomNumber}</p>
                <p>Loại phòng: {invoice?.booking?.room?.roomType?.name}</p>
                <p>Mã đặt phòng: {invoice?.booking?.bookingCode}</p>
              </div>
            </div>

            {/* Charges Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #cbd5e1' }}>Mục Thanh Toán</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #cbd5e1', textAlign: 'center' }}>SL</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #cbd5e1', textAlign: 'right' }}>Đơn Giá</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #cbd5e1', textAlign: 'right' }}>Thành Tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                    <strong>Tiền phòng ({invoice?.booking?.room?.roomNumber})</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Check-in: {new Date(invoice?.booking?.checkInDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>1</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{formatCurrency(invoice?.roomCharge)}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{formatCurrency(invoice?.roomCharge)}</td>
                </tr>

                {services.map(s => (
                  <tr key={s.id}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                      {s.service?.name}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>{s.quantity}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{formatCurrency(s.service?.price)}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{formatCurrency(s.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '2px solid #0f172a', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Hình Thức Thanh Toán: <strong>TIỀN MẶT / CHUYỂN KHOẢN</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#16a34a', fontWeight: 700, marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  <ShieldCheck size={18} /> Đã Xác Nhận Thanh Toán Đầy Đủ
                </div>
              </div>
              <div style={{ width: '240px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span>Tiền Phòng:</span>
                  <span>{formatCurrency(invoice?.roomCharge)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span>Tiền Dịch Vụ:</span>
                  <span>{formatCurrency(invoice?.serviceCharge)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', color: '#64748b' }}>
                  <span>Thuế VAT (10%):</span>
                  <span>{formatCurrency(invoice?.taxAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid #cbd5e1', marginTop: '0.25rem', fontWeight: 800, fontSize: '1.125rem', color: '#b45309' }}>
                  <span>TỔNG CỘNG:</span>
                  <span>{formatCurrency(invoice?.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar (hidden when printing) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handlePrint} className="btn btn-secondary" style={{ backgroundColor: '#475569' }}>
                <Printer size={18} /> In Hóa Đơn
              </button>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={onClose} className="btn btn-outline" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                  Đóng
                </button>
                {invoice?.booking?.status === 'CHECKED_IN' && (
                  <button onClick={handleConfirmCheckout} className="btn btn-success">
                    <CheckCircle size={18} /> Xác Nhận Trả Phòng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
