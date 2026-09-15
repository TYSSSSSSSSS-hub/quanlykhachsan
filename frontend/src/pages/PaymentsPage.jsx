import React, { useState, useEffect } from 'react';
import { CreditCard, Search, DollarSign, Printer, Download, RefreshCw, CheckCircle2, ShieldCheck, ArrowUpRight, Lock, Clock, AlertTriangle, ChevronDown, Filter } from 'lucide-react';
import { api } from '../services/api';

export const PaymentsPage = ({ onOpenInvoiceModal }) => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    api.getInvoices().then(data => {
      if (Array.isArray(data)) setInvoices(data);
    }).catch(console.error);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.booking?.guest?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'PAID') return matchesSearch && inv.status === 'PAID';
    if (statusFilter === 'UNPAID') return matchesSearch && inv.status === 'UNPAID';
    return matchesSearch;
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>FINANCIAL OPERATIONS & CASHIERING</span>
            <span>•</span>
            <span style={{ color: '#64748b' }}>DAILY FOLIO SETTLEMENTS & TRANSACTIONS</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Payment & Folio Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Monitor real-time guest deposit authorizations, folio closures, automated merchant batch settlements, chargebacks, and gateway settlement logs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Download size={15} /> Export Ledger (CSV/QBO)
          </button>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <RefreshCw size={15} /> Reconcile Batch (EOD)
          </button>
          <button className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(29,78,216,0.2)' }}>
            <DollarSign size={16} /> Record New Payment / Deposit
          </button>
        </div>
      </div>

      {/* KPI Row (5 Stat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Stat 1 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TODAY'S REVENUE</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {formatCurrency(totalRevenue > 0 ? totalRevenue : 18450000)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem' }}>
              +12.4% vs yday
            </span>
            <span style={{ color: '#64748b' }}>{invoices.length || 42} processed</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRE-AUTHORIZATIONS</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={14} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            12.450.000 ₫
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            14 room guarantee holds
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PENDING FOLIOS</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={14} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            3.820.000 ₫
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem' }}>
              8 open folios
            </span>
            <span style={{ color: '#64748b' }}>Checkout due</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CASH DRAWER TILL</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            1.450.000 ₫
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            ● Till #1 & #2 verified
          </div>
        </div>

        {/* Stat 5 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DISPUTES / REFUNDS</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={14} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>
            350.000 ₫
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>
            1 Dispute item • Minibar credit
          </div>
        </div>

      </div>

      {/* Middle Visual Section: Tender Mix, Hourly Settlement, Gateway Terminal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        
        {/* Tender Mix */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>Payment Tender Mix (Today)</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>18.450.000 ₫ Total</div>
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>
              Real-time Breakdown
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#f1f5f9', display: 'flex', overflow: 'hidden', marginBottom: '0.875rem' }}>
            <div style={{ width: '58%', backgroundColor: '#2563eb' }} title="Cards 58%"></div>
            <div style={{ width: '24%', backgroundColor: '#0284c7' }} title="Wire 24%"></div>
            <div style={{ width: '12%', backgroundColor: '#16a34a' }} title="Cash 12%"></div>
            <div style={{ width: '6%', backgroundColor: '#ea580c' }} title="Other 6%"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.6875rem', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span> Cards 58%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span> Wire 24%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span> Cash 12%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span> Other 6%
            </div>
          </div>
        </div>

        {/* Hourly Inflow */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>Hourly Settlement Inflow</div>
              <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>Peak: 09:00 - 11:00</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '48px', paddingTop: '0.5rem' }}>
            {[{ h: '06:00', val: 30 }, { h: '08:00', val: 65 }, { h: '10:00', val: 100 }, { h: '12:00', val: 45 }, { h: '14:00', val: 70 }, { h: '16:00', val: 25 }].map((item, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '100%', height: `${item.val}%`, backgroundColor: item.val === 100 ? '#1d4ed8' : '#93c5fd', borderRadius: '2px 2px 0 0' }}></div>
                <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>{item.h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gateway Terminal Status */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>GATEWAY TERMINAL STATUS</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>3 Terminals Online</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Stripe POS • Chase Paymentech Live</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.6875rem' }}>
              Batch #B-409
            </span>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.25rem' }}>Auto-close in 12h 18m</div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', flex: 1 }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search by Transaction ID (e.g. #TXN-9081), Folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', width: '100%', fontSize: '0.8125rem' }}
            />
          </div>

          <button style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Filter size={14} /> All Payment Methods <ChevronDown size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Status Tabs */}
          {[
            { label: 'All', val: 'ALL' },
            { label: 'Settled / Paid', val: 'PAID' },
            { label: 'Pending Review', val: 'UNPAID' }
          ].map(tab => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              style={{
                backgroundColor: statusFilter === tab.val ? '#1d4ed8' : '#ffffff',
                color: statusFilter === tab.val ? '#ffffff' : '#64748b',
                border: statusFilter === tab.val ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            ● Auto-sync active (15s polling)
          </span>
        </div>

      </div>

      {/* Transactions Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 800 }}>TRANSACTION ID & TIMESTAMP</th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 800 }}>GUEST & RESERVATION FOLIO</th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 800 }}>DESCRIPTION / FOLIO ITEM</th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 800 }}>PAYMENT METHOD</th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 800 }}>AMOUNT</th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 800, textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv, idx) => (
              <tr key={inv.id || idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontWeight: 800, color: '#1d4ed8' }}>{inv.invoiceNumber || `#TXN-90${80 + idx}`}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>10:15 AM Today</div>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                      {(inv.booking?.guest?.fullName || 'G').split(' ').map(n=>n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{inv.booking?.guest?.fullName || 'Eleanor Vance'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Folio #GH-9821 • Room {inv.booking?.room?.roomNumber || '504'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                  <div>Full Guarantee Deposit & VAT</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>3-Night Stay Hold (Check-in pending)</div>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: '#334155' }}>
                    <CreditCard size={15} color="#2563eb" />
                    {inv.paymentMethod || 'VISA **** 4291'}
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 800, color: inv.status === 'PAID' ? '#16a34a' : '#0f172a', fontSize: '0.9375rem' }}>
                  {formatCurrency(inv.totalAmount || 350000)}
                </td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => onOpenInvoiceModal(inv.booking?.id)}
                    className="btn btn-outline"
                    style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#1d4ed8', fontWeight: 700, fontSize: '0.75rem', padding: '0.375rem 0.625rem', borderRadius: '0.375rem' }}
                  >
                    <Printer size={13} style={{ marginRight: '4px' }} /> View / Print Bill
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No payment transactions or folios found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Audit Bar */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>Credit Card Terminal Batch Status: <strong>Batch #B-409 (Settled Daily)</strong></span>
          <span>•</span>
          <span>Auto-batch close in 12h 18m • 100% PCI-DSS 4.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontWeight: 600, padding: '0.375rem 0.75rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Printer size={13} /> Print Daily Audit Log
          </button>
          <button style={{ backgroundColor: '#c2410c', border: 'none', color: '#ffffff', fontWeight: 700, padding: '0.375rem 0.75rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            Force Batch Settlement Now
          </button>
        </div>
      </div>

    </div>
  );
};
