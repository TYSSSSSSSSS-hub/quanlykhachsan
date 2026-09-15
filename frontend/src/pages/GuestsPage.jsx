import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Phone, Mail, CreditCard, MapPin, Download, GitMerge, Award, ShieldAlert, Star, Calendar, CheckCircle2, ChevronRight, Edit3, Lock, AlertCircle, X } from 'lucide-react';
import { api } from '../services/api';

export const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ fullName: '', phone: '', idCard: '', email: '', gender: 'Nam', address: '' });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = () => {
    api.getGuests().then(data => {
      if (Array.isArray(data)) {
        setGuests(data);
        if (data.length > 0) setSelectedGuest(data[0]);
      }
    }).catch(console.error);
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      await api.createGuest(newGuest);
      setShowAddModal(false);
      setNewGuest({ fullName: '', phone: '', idCard: '', email: '', gender: 'Nam', address: '' });
      loadGuests();
    } catch (err) {
      alert('Lỗi thêm khách hàng: ' + err.message);
    }
  };

  const filteredGuests = guests.filter(g => {
    const matchesSearch = 
      (g.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.phone || '').includes(searchTerm) ||
      (g.idCard || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterTab === 'ALL') return matchesSearch;
    return matchesSearch;
  });

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>GUEST RELATIONS & CRM</span>
            <span>•</span>
            <span style={{ color: '#64748b' }}>LIVE PMS SYNC (FY2024)</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Guest Directory & Profiles
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Manage hotel guest records, loyalty membership tiers, stay histories, identification credentials, and personalized stay preferences.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Download size={15} /> Export Guest CRM
          </button>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <GitMerge size={15} /> Merge Duplicates
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(29,78,216,0.2)' }}>
            <Plus size={16} /> Register New Guest
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (5 Stat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Stat 1 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL PROFILES</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {guests.length > 0 ? `${guests.length} Registered` : '3,842 Active'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem' }}>
              126 VIP Members
            </span>
            <span style={{ color: '#64748b' }}>Omnichannel</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>CURRENTLY IN-HOUSE</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            184 Guests
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem' }}>
              92% Occupancy
            </span>
            <span style={{ color: '#64748b' }}>24 Due Out</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ARRIVING TODAY</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={14} color="#ea580c" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            38 Expected
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            14 VIP Arrivals • Check-in from 14:00
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>REPEAT GUEST RATIO</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={14} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', lineHeight: 1.2 }}>
            46.8%
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            1,798 Lifetime Return Guests
          </div>
        </div>

        {/* Stat 5 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>GUEST SPEND BASE</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            1.84M ₫
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            Avg Folio: 1.420.000 ₫ ADR
          </div>
        </div>

      </div>

      {/* Main Layout: Left Directory Table, Right Guest Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.25rem' }}>
        
        {/* Left Guest Directory Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          
          {/* Search & Filter bar */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', flex: 1, minWidth: '200px' }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search by Guest Name, Phone, Passport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', width: '100%', fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {[
                { label: 'All (3,842)', val: 'ALL' },
                { label: 'In-House (184)', val: 'IN_HOUSE' },
                { label: 'VIPs Only (126)', val: 'VIP' }
              ].map(t => (
                <button
                  key={t.val}
                  onClick={() => setFilterTab(t.val)}
                  style={{
                    backgroundColor: filterTab === t.val ? '#1d4ed8' : '#ffffff',
                    color: filterTab === t.val ? '#ffffff' : '#64748b',
                    border: filterTab === t.val ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.35rem 0.625rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Table */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 0.875rem' }}>GUEST / LOYALTY</th>
                  <th style={{ padding: '0.75rem 0.875rem' }}>CONTACT DETAILS</th>
                  <th style={{ padding: '0.75rem 0.875rem' }}>ID / PASSPORT</th>
                  <th style={{ padding: '0.75rem 0.875rem', textAlign: 'right' }}>STAYS & SPEND</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((g, idx) => {
                  const isSelected = selectedGuest?.id === g.id;
                  return (
                    <tr
                      key={g.id || idx}
                      onClick={() => setSelectedGuest(g)}
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
                            {g.fullName ? g.fullName.charAt(0) : 'G'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{g.fullName}</div>
                            <div style={{ fontSize: '0.6875rem', color: '#ea580c', fontWeight: 700 }}>
                              VIP Silver • Tier {idx + 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.875rem', color: '#334155' }}>
                        <div>{g.phone || '+1 (555) 0192'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.email || 'guest@example.com'}</div>
                      </td>
                      <td style={{ padding: '0.75rem 0.875rem', color: '#64748b', fontWeight: 600 }}>
                        {g.idCard || 'US P982410'}
                      </td>
                      <td style={{ padding: '0.75rem 0.875rem', textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#16a34a' }}>14,890.000 ₫</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>12 Stays • 3.4 Avg</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Detailed Guest Profile Card */}
        {selectedGuest ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Guest Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1d4ed8', color: '#ffffff', fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedGuest.fullName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{selectedGuest.fullName}</h3>
                  <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>
                    VIP Silver Member • Tier 2
                  </div>
                </div>
              </div>
              <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', padding: '0.375rem', borderRadius: '0.375rem' }}>
                <Edit3 size={15} color="#475569" />
              </button>
            </div>

            {/* Loyalty Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              <span style={{ backgroundColor: '#fff7ed', color: '#c2410c', fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                ★ High Spender
              </span>
              <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                Late Checkout Preferred (14:00)
              </span>
              <span style={{ backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                ⚠ Allergy: Feather Down
              </span>
            </div>

            {/* Active Stay Card */}
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.625rem', padding: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>● ACTIVE STAY • ROOM 504</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#1e40af' }}>In-House</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Executive Ocean View Suite 504</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.25rem' }}>
                5 Nights • Night 1 in progress
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #dbeafe', fontSize: '0.75rem' }}>
                <span>Live Folio Balance: <strong style={{ color: '#16a34a' }}>1.244.500 ₫</strong></span>
                <button className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', padding: '0.25rem 0.625rem', fontSize: '0.6875rem', fontWeight: 700, borderRadius: '0.25rem' }}>
                  Inspect Folio
                </button>
              </div>
            </div>

            {/* Contact & Identification */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CONTACT & IDENTIFICATION</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Primary Phone:</span>
                <strong style={{ color: '#0f172a' }}>{selectedGuest.phone || '+1 (555) 0192'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Primary Email:</span>
                <strong style={{ color: '#0f172a' }}>{selectedGuest.email || 'guest@example.com'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Identification:</span>
                <strong style={{ color: '#0f172a' }}>{selectedGuest.idCard || 'US Passport P982410'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Primary Address:</span>
                <strong style={{ color: '#0f172a' }}>{selectedGuest.address || 'New York, NY 10023, USA'}</strong>
              </div>
            </div>

            {/* Concierge Notes */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem' }}>PERSONAL PREFERENCES & NOTES</div>
              <p style={{ color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Hypoallergenic foam pillows required. Lactose-free milk requested for room service. Morning financial times print delivery daily.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', padding: '0.5rem' }}>
                New Booking for Guest
              </button>
              <button className="btn btn-outline" style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.75rem', padding: '0.5rem' }}>
                Issue Keycard
              </button>
            </div>

          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Select a guest profile from the directory to view detailed history.
          </div>
        )}

      </div>

      {/* Register New Guest Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Register New Guest</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddGuest} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                <input type="text" placeholder="e.g. Eleanor Vance" className="input-field" value={newGuest.fullName} onChange={e => setNewGuest({ ...newGuest, fullName: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Phone Number *</label>
                <input type="tel" placeholder="+1 (555) 0192" className="input-field" value={newGuest.phone} onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>CCCD / Passport ID</label>
                <input type="text" placeholder="US Passport P982410" className="input-field" value={newGuest.idCard} onChange={e => setNewGuest({ ...newGuest, idCard: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                <input type="email" placeholder="eleanor.vance@example.com" className="input-field" value={newGuest.email} onChange={e => setNewGuest({ ...newGuest, email: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Address</label>
                <input type="text" placeholder="New York, NY, USA" className="input-field" value={newGuest.address} onChange={e => setNewGuest({ ...newGuest, address: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Save Guest Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
