import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, Calendar, FileSpreadsheet, RefreshCw, Layers, PieChart, ArrowUpRight, CheckCircle2, FileText, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [activeRange, setActiveRange] = useState('MONTH');

  useEffect(() => {
    api.getReportSummary().then(data => {
      if (data) setReport(data);
    }).catch(console.error);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handleExportCSV = () => {
    alert('Exporting Full Executive Audit Pack (PDF / CSV) successfully!');
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <span>EXECUTIVE AUDIT & BUSINESS INTELLIGENCE</span>
            <span>•</span>
            <span style={{ color: '#64748b' }}>LIVE FISCAL SYNC (FY2024)</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Reports & Financial Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Comprehensive hotel performance telemetry, RevPAR & ADR trajectories, department yield distributions, and fiscal audit reports.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handleExportCSV} className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <FileSpreadsheet size={15} /> Export Full Audit Pack (PDF/CSV)
          </button>
          <button className="btn btn-outline" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Calendar size={15} /> Schedule Automated EOD Report
          </button>
          <button className="btn btn-primary" style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(29,78,216,0.2)' }}>
            <BarChart3 size={16} /> Generate Custom Report
          </button>
        </div>
      </div>

      {/* Date Filter & Control Bar */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {[
            { label: 'Today', val: 'TODAY' },
            { label: 'This Week', val: 'WEEK' },
            { label: 'This Month (Oct 2024)', val: 'MONTH' },
            { label: 'Quarter to Date (Q4)', val: 'QTD' }
          ].map(btn => (
            <button
              key={btn.val}
              onClick={() => setActiveRange(btn.val)}
              style={{
                backgroundColor: activeRange === btn.val ? '#1d4ed8' : '#ffffff',
                color: activeRange === btn.val ? '#ffffff' : '#64748b',
                border: activeRange === btn.val ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <RefreshCw size={13} /> Synced 3m ago
          </span>
        </div>
      </div>

      {/* KPI Cards (5 Stat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Stat 1 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>GROSS HOTEL REVENUE</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {formatCurrency(report?.totalRevenue || 428650000)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.6875rem' }}>
              +16.8% vs last month
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>AVERAGE DAILY RATE (ADR)</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            2.485.000 ₫
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            +18.30 vs LY • CompSet Index 104.4
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>REVPAR</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            2.028.000 ₫
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            +13.7% MoM growth • {report?.occupancyRate || 81.6}% Avg Occupancy
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL GUESTS HOSTED</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={14} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            1,842
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            +6.6% MoM guest volume • Avg Stay 3.7 nights
          </div>
        </div>

        {/* Stat 5 */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ANCILLARY REVENUE</span>
            <div style={{ width: '24px', height: '24px', borderRadius: '0.375rem', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={14} color="#ea580c" />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {formatCurrency(report?.serviceRevenue || 114820000)}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            26.8% of Total yield contribution
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        
        {/* Monthly Revenue Chart */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Monthly Revenue vs. Budget Baseline</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>Fiscal FY2024 Actuals vs Projected Targets</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1d4ed8', fontWeight: 700 }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#1d4ed8', borderRadius: '2px' }}></span> Room Rev
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#38bdf8', fontWeight: 700 }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#38bdf8', borderRadius: '2px' }}></span> Ancillary
              </span>
            </div>
          </div>

          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingTop: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { m: 'May', room: 60, anc: 25 },
              { m: 'Jun', room: 75, anc: 30 },
              { m: 'Jul', room: 95, anc: 40 },
              { m: 'Aug', room: 90, anc: 38 },
              { m: 'Sep', room: 70, anc: 28 },
              { m: 'Oct (Now)', room: 85, anc: 35 },
              { m: 'Nov (P)', room: 65, anc: 25 },
              { m: 'Dec (P)', room: 98, anc: 45 },
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '80%', height: `${bar.room}%`, backgroundColor: '#1d4ed8', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                  <div style={{ width: '100%', height: `${bar.anc}%`, backgroundColor: '#38bdf8', borderRadius: '4px 4px 0 0', position: 'absolute', bottom: 0 }}></div>
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }}>{bar.m}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Peak Month: <strong>July (485,200.00 ₫)</strong></span>
            <span>Projected Year-End: <strong>4.920.000.000 ₫</strong></span>
          </div>
        </div>

        {/* Booking Channel Mix */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Booking Channel Mix</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>Direct vs Partner Acquisition</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem 0' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#1d4ed8 0% 48%, #0284c7 48% 74%, #ea580c 74% 92%, #16a34a 92% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>74%</span>
                <span style={{ fontSize: '0.5625rem', color: '#64748b', fontWeight: 700 }}>DIRECT & VIP</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#334155' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1d4ed8' }}></span> Direct Website & Walk-in</span>
              <strong>48%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#334155' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span> VIP Concierge & Corporate</span>
              <strong>26%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#334155' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span> OTAs (Expedia, Booking)</span>
              <strong>18%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#334155' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span> Travel Agencies & GDS</span>
              <strong>8%</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Room Performance & Department Yield Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        
        {/* Room Category Performance */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.875rem' }}>Room Category Performance Breakdown</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0' }}>ROOM CATEGORY</th>
                <th style={{ padding: '0.5rem 0' }}>INVENTORY</th>
                <th style={{ padding: '0.5rem 0' }}>OCCUPANCY %</th>
                <th style={{ padding: '0.5rem 0' }}>ADR</th>
                <th style={{ padding: '0.5rem 0' }}>REVPAR</th>
                <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>TOTAL REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Presidential Penthouse', inv: '4 Keys', occ: 94.2, adr: '7.500.000 ₫', revpar: '7.065.000 ₫', rev: '63.750.000 ₫' },
                { cat: 'Executive Ocean Suite', inv: '14 Keys', occ: 88.5, adr: '3.500.000 ₫', revpar: '3.097.000 ₫', rev: '117.600.000 ₫' },
                { cat: 'Royal Terrace Suite', inv: '16 Keys', occ: 82.0, adr: '2.800.000 ₫', revpar: '2.296.000 ₫', rev: '80.640.000 ₫' },
                { cat: 'Deluxe King', inv: '50 Keys', occ: 78.4, adr: '2.200.000 ₫', revpar: '1.724.000 ₫', rev: '112.200.000 ₫' },
                { cat: 'Standard King & Twin', inv: '36 Keys', occ: 74.0, adr: '1.750.000 ₫', revpar: '1.295.000 ₫', rev: '54.460.000 ₫' }
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.625rem 0', fontWeight: 700, color: '#0f172a' }}>{row.cat}</td>
                  <td style={{ padding: '0.625rem 0', color: '#64748b' }}>{row.inv}</td>
                  <td style={{ padding: '0.625rem 0', fontWeight: 700, color: '#16a34a' }}>{row.occ}%</td>
                  <td style={{ padding: '0.625rem 0', color: '#334155' }}>{row.adr}</td>
                  <td style={{ padding: '0.625rem 0', color: '#334155' }}>{row.revpar}</td>
                  <td style={{ padding: '0.625rem 0', textAlign: 'right', fontWeight: 800, color: '#1d4ed8' }}>{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Department Yield Breakdown */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Department Yield Breakdown</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Non-Room Revenue Contribution</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0.75rem 0' }}>
            {[
              { dept: 'Dining & Le Grand Veranda', val: '67.400.000 ₫', pct: '51%' },
              { dept: 'Thalasso Spa & Wellness', val: '31.200.000 ₫', pct: '27%' },
              { dept: 'Limousine & Chauffeur Fleet', val: '17.300.000 ₫', pct: '15%' },
              { dept: 'Housekeeping & Laundry Services', val: '8.120.000 ₫', pct: '5%' },
              { dept: 'Yacht & Snorkeling Experiences', val: '3.300.000 ₫', pct: '2%' }
            ].map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderBottom: '1px dashed #f1f5f9', paddingBottom: '0.375rem' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>{d.dept}</span>
                <span style={{ fontWeight: 800, color: '#1d4ed8' }}>{d.val} <span style={{ color: '#64748b', fontWeight: 400 }}>({d.pct})</span></span>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#eff6ff', padding: '0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>
            F&B Capture Rate: 72.5% of in-house guests dined on-property at least twice during stay.
          </div>
        </div>

      </div>

      {/* Scheduled Financial Audits & Exportable Ledgers */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Scheduled Financial Audits & Exportable Ledgers</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Audit Batch #2024-Q3-84 • <strong style={{ color: '#1d4ed8', cursor: 'pointer' }}>View Archive</strong></span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem 0' }}>Night audit closures, tax filings, and department reconciliation metrics.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          
          {/* Audit Card 1 */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>PDF PACK</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Today 04:00 AM</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem' }}>Daily Manager's Flash Report (EOD)</div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>Daily snapshot of night auditor closures, cash balances, and room rate variances across wings.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
              <span style={{ color: '#64748b' }}>Size: 2.1MB</span>
              <button style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Download size={13} /> Download PDF
              </button>
            </div>
          </div>

          {/* Audit Card 2 */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>XLSX SHEET</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Oct 20, 2024</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem' }}>Monthly RevPAR & CompSet Benchmarking</div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>STR Benchmarking comparison, market penetration index, and ADR yield index against regional luxury peers.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
              <span style={{ color: '#64748b' }}>Size: 4.1MB</span>
              <button style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Download size={13} /> Export XLSX
              </button>
            </div>
          </div>

          {/* Audit Card 3 */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>CSV DATA</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Current Q4 Ledger</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem' }}>Taxation, VAT & Tourism Levies</div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>Municipality tax collection, state hospitality VAT, and payment gateway credit card merchant fee audit.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
              <span style={{ color: '#64748b' }}>Size: 1.6MB</span>
              <button style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          {/* Audit Card 4 */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>OPERATIONAL</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Oct 22, 2024</span>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem' }}>Housekeeping & Labor Cost Efficiency</div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>Turnaround minutes per room tier, linen wash counts, room inspection scores, and staff overtime costs.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
              <span style={{ color: '#64748b' }}>Size: 920 KB</span>
              <button style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Download size={13} /> View Report
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
