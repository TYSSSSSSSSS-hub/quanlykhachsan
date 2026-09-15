import React, { useState, useEffect } from 'react';
import { Coffee, Plus, Tag, Check, X, Search, Download, Clock, Sparkles, Car, Utensils, Scissors, Shirt, Activity, ChevronDown, Eye } from 'lucide-react';
import { api } from '../services/api';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [newService, setNewService] = useState({ name: '', price: '', category: 'Breakfast', description: '' });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    api.getServices().then(data => {
      if (Array.isArray(data)) setServices(data);
    }).catch(console.error);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.createService({ ...newService, price: Number(newService.price), isActive: true });
      setShowModal(false);
      setNewService({ name: '', price: '', category: 'Breakfast', description: '' });
      loadServices();
    } catch (err) {
      alert('Lỗi tạo dịch vụ: ' + err.message);
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (categoryFilter === 'ALL') return matchesSearch;
    return matchesSearch && (s.category || '').toUpperCase().includes(categoryFilter);
  });

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>PROPERTY CONCIERGE & OUTLETS</span>
            <span>•</span>
            <span style={{ color: '#64748b' }}>MAIN WING & BEACH CLUB PAVILION</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Services & Amenities Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Configure guest services, monitor live fulfillment orders, manage department operating hours, and track service billing revenue.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Download size={15} /> Export Catalog (PDF/CSV)
          </button>
          <button className="btn btn-outline" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Clock size={15} /> Service Queue <span style={{ backgroundColor: '#ffffff', color: '#ea580c', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 800 }}>12 Active</span>
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(29,78,216,0.2)' }}>
            <Plus size={16} /> Add New Service
          </button>
        </div>
      </div>

      {/* KPI Row (Stat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Stat 1 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL ACTIVE SERVICES</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coffee size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {services.length > 0 ? `${services.length} Configured` : '24 Configured'}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            6 Categories • 100% Operational
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TODAY'S SERVICE REVENUE</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={14} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            4.820.000 ₫
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem' }}>
              +18.2%
            </span>
            <span style={{ color: '#64748b' }}>46 orders billed</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ACTIVE IN FULFILLMENT</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={14} color="#ea580c" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            12 In-Progress
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ backgroundColor: '#ffedd5', color: '#9a3412', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem' }}>
              4 Priority/VIP
            </span>
            <span style={{ color: '#64748b' }}>Avg turnaround 18m</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOP PERFORMER OUTLET</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            Le Grand Spa & Wellness
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            2.150.000 ₫ today • 14 appointments
          </div>
        </div>

        {/* Stat 5 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>STAFF UTILIZATION</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={14} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', lineHeight: 1.2 }}>
            88% Allocated
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            29 / 33 On Duty
          </div>
        </div>

      </div>

      {/* Middle Section: Revenue Distribution & Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        
        {/* Revenue Distribution */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>Service Revenue Distribution</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fiscal breakdown by operational revenue centers</div>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>Total: 4.820.000 ₫</div>
          </div>
          
          <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#f1f5f9', display: 'flex', overflow: 'hidden', marginBottom: '0.875rem' }}>
            <div style={{ width: '48%', backgroundColor: '#2563eb' }} title="Spa & Wellness 48%"></div>
            <div style={{ width: '28%', backgroundColor: '#0284c7' }} title="Dining 28%"></div>
            <div style={{ width: '16%', backgroundColor: '#ea580c' }} title="Transport 16%"></div>
            <div style={{ width: '7%', backgroundColor: '#16a34a' }} title="Laundry 7%"></div>
            <div style={{ width: '4%', backgroundColor: '#8b5cf6' }} title="Recreation 4%"></div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.6875rem', color: '#475569' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span> Spa 48%</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span> Dining 28%</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span> Transport 16%</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span> Laundry 7%</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></span> Recreation 4%</span>
          </div>
        </div>

        {/* Real-time Telemetry Capacity */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>Department Real-Time Capacity</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Live operational status</div>
            </div>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
              ● TELEMETRY LIVE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Dining Expediter</div>
              <div style={{ color: '#16a34a', fontWeight: 600 }}>Normal load (8m wait)</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Spa Treatment Rooms</div>
              <div style={{ color: '#ea580c', fontWeight: 600 }}>5 / 6 Rooms Occupied</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Valet & Limousine</div>
              <div style={{ color: '#2563eb', fontWeight: 600 }}>3 En-Route, 1 Staged</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Housekeeping / Linens</div>
              <div style={{ color: '#16a34a', fontWeight: 600 }}>Express Fulfilled</div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Category Tabs */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', flex: 1, minWidth: '250px' }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search service by name, SKU, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', width: '100%', fontSize: '0.8125rem' }}
            />
          </div>

          <button style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            All Operational States <ChevronDown size={14} />
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { label: 'All Services (24)', val: 'ALL' },
            { label: 'Dining & Room Service (6)', val: 'BREAKFAST' },
            { label: 'Spa & Wellness (5)', val: 'SPA' },
            { label: 'Transport & Limousine (4)', val: 'AIRPORT' },
            { label: 'Housekeeping & Laundry (4)', val: 'LAUNDRY' },
            { label: 'Minibar & Refreshments', val: 'MINIBAR' }
          ].map(p => (
            <button
              key={p.val}
              onClick={() => setCategoryFilter(p.val)}
              style={{
                backgroundColor: categoryFilter === p.val ? '#1d4ed8' : '#ffffff',
                color: categoryFilter === p.val ? '#ffffff' : '#475569',
                border: categoryFilter === p.val ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredServices.map((s, idx) => (
          <div key={s.id || idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            {/* Header Image / Badge area */}
            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 800, fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>
                  {s.category || 'Food & Beverage'}
                </span>
                <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ● In-Service
                </span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>{s.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                {s.description || 'Artisanal breakfast spread with private suite cart delivery option, curated barista coffee, and fresh press station.'}
              </p>
            </div>

            {/* Details Footer */}
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: '#64748b' }}>Hours: <strong>06:30 - 11:30 Daily</strong></span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8' }}>
                  {formatCurrency(s.price || 350000)} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>/ guest</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="btn btn-outline" style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 700, fontSize: '0.75rem', padding: '0.375rem 0.5rem', borderRadius: '0.375rem' }}>
                  Edit Menu Rates
                </button>
                <button className="btn btn-primary" style={{ flex: 1, backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', padding: '0.375rem 0.5rem', borderRadius: '0.375rem' }}>
                  Active Orders
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add New Service Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Create New Service</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Service Name *</label>
                <input type="text" placeholder="e.g. VIP Airport Limousine" className="input-field" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Category *</label>
                <select className="input-field" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }}>
                  <option value="Breakfast">Breakfast / Dining</option>
                  <option value="Laundry">Laundry & Cleaning</option>
                  <option value="Room Service">Room Service</option>
                  <option value="Airport Transfer">Airport / Limousine Transfer</option>
                  <option value="Spa">Spa & Thalassotherapy</option>
                  <option value="Minibar">Minibar & Drinks</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Unit Price (VND) *</label>
                <input type="number" placeholder="350000" className="input-field" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} required style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                <textarea placeholder="Service details & fulfillment terms..." className="input-field" rows={3} value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '100%', padding: '0.5rem', borderRadius: '0.375rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 700 }}>Create Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
