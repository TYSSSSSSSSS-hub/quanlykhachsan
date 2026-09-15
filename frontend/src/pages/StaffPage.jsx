import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Plus, Lock, Unlock, Key, Phone, Mail, Search, X } from 'lucide-react';
import { api } from '../services/api';

export const StaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStaff, setNewStaff] = useState({ fullName: '', position: 'Receptionist', department: 'Front Desk', phone: '', email: '' });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    api.getStaff().then(data => {
      if (Array.isArray(data)) setStaffList(data);
    }).catch(console.error);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.createStaff(newStaff);
      setShowModal(false);
      setNewStaff({ fullName: '', position: 'Receptionist', department: 'Front Desk', phone: '', email: '' });
      loadStaff();
    } catch (err) {
      alert('Lỗi tạo nhân viên: ' + err.message);
    }
  };

  const filteredStaff = staffList.filter(s =>
    (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>STAFF & PERSONNEL DIRECTORY</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Quản Lý Nhân Viên & Tài Khoản System
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Phân công chức vụ & tài khoản: Admin, Manager, Receptionist, Accountant, Housekeeping
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> + Thêm Nhân Viên Mới
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.45rem 0.75rem' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Tìm theo Tên nhân viên, Chức vụ, Bộ phận..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', width: '100%', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Staff Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.875rem 1rem' }}>NHÂN VIÊN</th>
              <th style={{ padding: '0.875rem 1rem' }}>CHỨC VỤ (ROLE)</th>
              <th style={{ padding: '0.875rem 1rem' }}>BỘ PHẬN</th>
              <th style={{ padding: '0.875rem 1rem' }}>SỐ ĐIỆN THOẠI</th>
              <th style={{ padding: '0.875rem 1rem' }}>EMAIL</th>
              <th style={{ padding: '0.875rem 1rem' }}>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((s, idx) => (
              <tr key={s.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.fullName ? s.fullName.charAt(0) : 'N'}
                    </div>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{s.fullName}</span>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 800, fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                    {s.position}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>{s.department || 'Front Desk'}</td>
                <td style={{ padding: '0.875rem 1rem', color: '#16a34a', fontWeight: 600 }}>{s.phone}</td>
                <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>{s.email}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                    ● {s.status || 'ACTIVE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Thêm Nhân Viên Mới</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Họ và tên *</label>
                <input type="text" placeholder="Nguyễn Văn A" className="input-field" value={newStaff.fullName} onChange={e => setNewStaff({ ...newStaff, fullName: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Chức vụ (Role) *</label>
                <select className="input-field" value={newStaff.position} onChange={e => setNewStaff({ ...newStaff, position: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }}>
                  <option value="Admin">Admin (Quản trị hệ thống)</option>
                  <option value="Manager">Manager (Quản lý khách sạn)</option>
                  <option value="Receptionist">Receptionist (Lễ tân)</option>
                  <option value="Accountant">Accountant (Kế toán)</option>
                  <option value="Housekeeping">Housekeeping (Buồng phòng)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Bộ phận</label>
                <input type="text" placeholder="Front Desk" className="input-field" value={newStaff.department} onChange={e => setNewStaff({ ...newStaff, department: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Số điện thoại *</label>
                <input type="tel" placeholder="0901234567" className="input-field" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Email *</label>
                <input type="email" placeholder="staff@grandhorizon.com" className="input-field" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Xác Nhận Tạo</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
