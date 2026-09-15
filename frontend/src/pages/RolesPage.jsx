import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Check, Lock, Search, Download, ShieldAlert, Key, UserCheck, Shield, Laptop, AlertOctagon, X, CheckSquare, Square, Smartphone, LogOut } from 'lucide-react';
import { api } from '../services/api';

export const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', position: 'Receptionist', department: 'Front Desk Operations', phone: '', email: '' });

  useEffect(() => {
    api.getRoles().then(data => { if (Array.isArray(data)) setRoles(data); }).catch(console.error);
    loadStaff();
  }, []);

  const loadStaff = () => {
    api.getStaff().then(data => {
      if (Array.isArray(data)) {
        setStaffList(data);
        if (data.length > 0) setSelectedUser(data[0]);
      }
    }).catch(console.error);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.createStaff(newUser);
      setShowAddUserModal(false);
      setNewUser({ fullName: '', position: 'Receptionist', department: 'Front Desk Operations', phone: '', email: '' });
      loadStaff();
    } catch (err) {
      alert('Lỗi tạo người dùng: ' + err.message);
    }
  };

  const filteredStaff = staffList.filter(s => {
    const matchesSearch = 
      (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>SYSTEM ADMINISTRATION & SECURITY</span>
            <span>•</span>
            <span style={{ color: '#64748b' }}>RBAC POLICY ENGINE V4.2</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Users & Access Control
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Provision user accounts, configure role-based access permissions (RBAC), enforce 2FA/MFA policies, and review authentication audit trails.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Download size={15} /> Security Audit Log (CSV)
          </button>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <ShieldCheck size={15} /> Configure Role Templates
          </button>
          <button onClick={() => setShowAddUserModal(true)} className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(29,78,216,0.2)' }}>
            <Plus size={16} /> Add New User
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (5 Stat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Stat 1 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL SYSTEM USERS</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {staffList.length > 0 ? `${staffList.length} Accounts` : '42 Accounts'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>● 38 Active</span>
            <span style={{ color: '#64748b' }}>• 4 Suspended</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ACTIVE ROLES</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            6 Configured
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            Super Admin, GM, Front Desk, Housekeeping...
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ACTIVE SESSIONS</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Laptop size={14} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            19 Online
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            14 Desktop • 5 Handhelds
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>2FA / MFA RATE</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', lineHeight: 1.2 }}>
            95.2% High
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            40/42 Enrolled • 2 Grace
          </div>
        </div>

        {/* Stat 5 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>FAILED AUTH (24H)</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertOctagon size={14} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>
            3 Flagged
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>
            IP Rate-Limited • 0 Breaches
          </div>
        </div>

      </div>

      {/* Main Grid: Left User Directory Table, Right Policy Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.25rem' }}>
        
        {/* Left Staff Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.4rem 0.75rem' }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search by username, staff name, emp ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', width: '100%', fontSize: '0.8125rem' }}
              />
            </div>

            {/* Scope Pills */}
            <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto', paddingBottom: '0.125rem' }}>
              {[
                { label: 'All Users (42)', val: 'ALL' },
                { label: 'Administrators (4)', val: 'ADMIN' },
                { label: 'Front Desk Staff (18)', val: 'FRONT_DESK' },
                { label: 'Housekeeping (12)', val: 'HOUSEKEEPING' },
                { label: 'Pending Activation (2)', val: 'PENDING' }
              ].map(s => (
                <button
                  key={s.val}
                  onClick={() => setScopeFilter(s.val)}
                  style={{
                    backgroundColor: scopeFilter === s.val ? '#1d4ed8' : '#ffffff',
                    color: scopeFilter === s.val ? '#ffffff' : '#64748b',
                    border: scopeFilter === s.val ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.3rem 0.625rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 0.875rem' }}>USER & CREDENTIALS</th>
                  <th style={{ padding: '0.75rem 0.875rem' }}>ROLE & DEPARTMENT</th>
                  <th style={{ padding: '0.75rem 0.875rem' }}>ACCESS SCOPE</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((st, idx) => {
                  const isSelected = selectedUser?.id === st.id;
                  return (
                    <tr
                      key={st.id || idx}
                      onClick={() => setSelectedUser(st)}
                      style={{
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '0.75rem 0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem' }}>
                            {st.fullName ? st.fullName.charAt(0) : 'S'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{st.fullName}</div>
                            <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{st.email || 's.jenkins@grandhorizon.com'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.875rem' }}>
                        <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 800, fontSize: '0.6875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block', marginBottom: '2px' }}>
                          {st.position || 'Front Desk Mgr'}
                        </span>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{st.department || 'Front Desk & Concierge'}</div>
                      </td>
                      <td style={{ padding: '0.75rem 0.875rem', color: '#334155', fontWeight: 600, fontSize: '0.75rem' }}>
                        ● Main Wing & Pavilion
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Policy Matrix */}
        {selectedUser ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Granular RBAC Policy</h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Policy Template: <strong>v4.2 Front Desk Mgr</strong></div>
              </div>
              <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                Active Profile
              </span>
            </div>

            {/* Selected user badge */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1d4ed8', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedUser.fullName.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>{selectedUser.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Emp ID: #EMP-0102 • Shift: Morning 07:00-15:00</div>
              </div>
            </div>

            {/* Permission checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PERMISSIONS & ACCESS MATRIX
              </div>

              {/* Module 1 */}
              <div style={{ border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '0.625rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem' }}>
                  <span>Front Desk & Reservations</span>
                  <span style={{ color: '#16a34a', fontSize: '0.6875rem' }}>4 of 4 Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#475569' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> View Reservations & Folios</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Create & Modify Bookings</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Cancel Bookings & Waive Policy</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Flexible Room Transfer Authority</label>
                </div>
              </div>

              {/* Module 2 */}
              <div style={{ border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '0.625rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem' }}>
                  <span>Rooms & Housekeeping Flow</span>
                  <span style={{ color: '#16a34a', fontSize: '0.6875rem' }}>3 of 4 Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#475569' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Inspect Real-Time Room States</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Assign & Reallocate Suites</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Override Cleaning Clean/Dirty Flag</label>
                </div>
              </div>

              {/* Module 3 */}
              <div style={{ border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '0.625rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem' }}>
                  <span>Billing, Cashiering & Folios</span>
                  <span style={{ color: '#16a34a', fontSize: '0.6875rem' }}>3 of 4 Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#475569' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> View Guest Ledger & Invoices</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Post Room Charges & Incidentals</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}><CheckSquare size={14} color="#1d4ed8" /> Force Batch Credit Settlement</label>
                </div>
              </div>

            </div>

            {/* Session actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-outline" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626', fontWeight: 700, fontSize: '0.75rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                <LogOut size={14} /> Terminate Terminal Session Remotely
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem' }}>
                Save Permission Overrides
              </button>
            </div>

          </div>
        ) : null}

      </div>

      {/* Compliance Banner */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="#16a34a" />
          <span style={{ fontWeight: 800, color: '#0f172a' }}>SOC2 Type II & PCI-DSS 4.0 Active Compliance</span>
          <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 700 }}>Global Policy Active</span>
        </div>
        <div style={{ color: '#64748b' }}>
          Automated password rotations enforced every 90 days. Sensitive guest cardholder data (CHD) tokenized end-to-end.
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Add New System User</h3>
              <button onClick={() => setShowAddUserModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                <input type="text" placeholder="e.g. Sarah Jenkins" className="input-field" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Role (Position) *</label>
                <select className="input-field" value={newUser.position} onChange={e => setNewUser({ ...newUser, position: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }}>
                  <option value="Admin">Admin (Super Administrator)</option>
                  <option value="Manager">Manager (General Manager)</option>
                  <option value="Receptionist">Receptionist (Front Desk)</option>
                  <option value="Accountant">Accountant (Billing & Cashier)</option>
                  <option value="Housekeeping">Housekeeping Supervisor</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Department</label>
                <input type="text" placeholder="Front Desk Operations" className="input-field" value={newUser.department} onChange={e => setNewUser({ ...newUser, department: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Phone *</label>
                <input type="tel" placeholder="+1 (555) 0102" className="input-field" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Email *</label>
                <input type="email" placeholder="s.jenkins@grandhorizon.com" className="input-field" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Provision User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
