import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  LogOut, 
  DollarSign, 
  AlertCircle, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  BedDouble, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const DashboardPage = ({ onOpenBookingModal, onNavigate }) => {
  const [stats, setStats] = useState({
    totalRooms: 120,
    availableRooms: 14,
    occupiedRooms: 98,
    reservedRooms: 8,
    cleaningRooms: 5,
    occupancyRate: 81.6,
    todayRevenue: 18450,
    todayArrivals: 24,
    todayDepartures: 19,
    unconfirmed: 7
  });

  const [movementsRoster, setMovementsRoster] = useState([
    { id: 1, guest: 'Marcus Chen', room: '#402 (Deluxe)', eta: '11:15 AM', status: 'Pre-auth OK', type: 'Check-in' },
    { id: 2, guest: 'Elena Vance', room: '#210 (King)', eta: '11:45 AM', status: 'Paid Full', type: 'Check-in' },
    { id: 3, guest: 'David Sterling', room: '#510 (Penthouse)', eta: '12:30 PM', status: 'Collect CC', type: 'Check-in' },
    { id: 4, guest: 'Amina Rahimi', room: '#309 (Twin)', eta: '01:00 PM', status: 'Paid Full', type: 'Check-in' },
  ]);

  const [bookingLedger, setBookingLedger] = useState([
    { id: 'RSH-8902', guest: 'Claire Dupont', roomType: 'Deluxe Ocean Suite', dates: 'Oct 26-28', amount: 1420, status: 'Confirmed' },
    { id: 'RSH-8901', guest: 'Robert Fox', roomType: 'Grand Palm Villa', dates: 'Oct 26-30', amount: 3890, status: 'Checked-in' },
    { id: 'RSH-8900', guest: 'Liam Gallagher', roomType: 'Executive King', dates: 'Oct 25-27', amount: 690, status: 'Confirmed' },
    { id: 'RSH-8899', guest: 'Sophia Lorenzi', roomType: 'Corner Suite Bay', dates: 'Oct 26-29', amount: 1150, status: 'Pending Dep.' },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getDashboardStats();
      if (data) {
        setStats(prev => ({
          ...prev,
          totalRooms: data.totalRooms || 120,
          availableRooms: data.availableRooms || 14,
          occupiedRooms: data.occupiedRooms || 98,
          occupancyRate: data.occupancyRate || 81.6,
          todayRevenue: data.todayRevenue || 18450
        }));
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Dashboard:', err);
    }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Operational Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
            <span style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.125rem 0.5rem', borderRadius: '1rem', fontSize: '0.6875rem', fontWeight: 700 }}>
              ● Live Staff Console
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Morning shift underway • Target Occupancy: 84.0%</span>
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Good morning, Sarah. Here's today's operational summary for Oct 24, 2024.
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onOpenBookingModal} className="btn btn-primary" style={{ height: '38px', fontWeight: 700 }}>
            <Zap size={15} /> ⚡ Quick Check-in
          </button>
          <button onClick={() => onNavigate('rooms')} className="btn btn-outline" style={{ height: '38px', fontWeight: 600 }}>
            <LayoutGrid size={15} color="#2563eb" /> Room Status Board
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid (6 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL ROOMS</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.totalRooms}</div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Physical Inventory • 98 Occ | 14 Avail</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>OCCUPANCY RATE</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>{stats.occupancyRate}%</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>↑ +4.2% vs yday • Cap: 120</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ARRIVALS</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.todayArrivals} expected</div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>16 processed • 8 Pending Arrival</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>DEPARTURES</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.todayDepartures} expected</div>
          <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>14 completed • 5 Remaining Late</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>GROSS REV. (TODAY)</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>${stats.todayRevenue.toLocaleString('en-US')}</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>↑ +12.4% vs last Thu • ADR $188</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>UNCONFIRMED</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ef4444', margin: '4px 0' }}>{stats.unconfirmed}</div>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Awaiting Deposit Proof • 3 Expiring Soon</span>
        </div>
      </div>

      {/* Middle Grid Section: Revenue Trajectory & Donut Inventory */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* RevPAR Chart Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Weekly Yield & RevPAR Trajectory</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>Daily rooms revenue against Target RevPAR baseline (Oct 18 - Oct 24)</p>
            </div>
            <select className="input-field" style={{ width: '130px', fontSize: '0.75rem' }}>
              <option>Current Week</option>
              <option>Last Week</option>
            </select>
          </div>

          {/* Bar Chart Visual Representation */}
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            {[
              { day: 'Fri 18', height: '60%', rev: '$16k' },
              { day: 'Sat 19', height: '90%', rev: '$22.4k' },
              { day: 'Sun 20', height: '75%', rev: '$19.2k' },
              { day: 'Mon 21', height: '50%', rev: '$14k' },
              { day: 'Tue 22', height: '65%', rev: '$16.5k' },
              { day: 'Wed 23', height: '70%', rev: '$17.8k' },
              { day: 'Thu 24', height: '85%', rev: '$20.1k' },
            ].map((bar, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: bar.height,
                  backgroundColor: '#2563eb',
                  borderRadius: '0.375rem 0.375rem 0 0',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                }}></div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>{bar.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Best performing day: <strong style={{ color: '#0f172a' }}>Saturday ($22,400)</strong></span>
            <span style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>Download Detailed Revenue Ledger →</span>
          </div>
        </div>

        {/* Room Inventory Donut Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Room Inventory</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>Live physical state of 120 keys</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Donut Circle representation */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'conic-gradient(#2563eb 0% 81.6%, #10b981 81.6% 93%, #f59e0b 93% 97.5%, #ef4444 97.5% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>120</span>
                <span style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 700 }}>TOTAL KEYS</span>
              </div>
            </div>

            {/* Inventory Legends */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1, fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span> Occupied
                </span>
                <strong style={{ color: '#0f172a' }}>98 rooms <span style={{ color: '#94a3b8', fontWeight: 400 }}>81.6%</span></strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> Available / Ready
                </span>
                <strong style={{ color: '#0f172a' }}>14 rooms <span style={{ color: '#94a3b8', fontWeight: 400 }}>11.6%</span></strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Dirty / Cleaning
                </span>
                <strong style={{ color: '#0f172a' }}>5 rooms <span style={{ color: '#94a3b8', fontWeight: 400 }}>4.1%</span></strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span> Out of Order / Maint.
                </span>
                <strong style={{ color: '#0f172a' }}>3 rooms <span style={{ color: '#94a3b8', fontWeight: 400 }}>2.5%</span></strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Daily Movements & Recent Booking Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        
        {/* Movements Roster Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Daily Movements Roster</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>Live arrivals and departures for Oct 24</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }} onClick={() => onNavigate('reservations')}>View All Roster →</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>GUEST</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>ROOM</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>ETA / TIME</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>BILLING</th>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {movementsRoster.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{m.guest}</td>
                  <td style={{ padding: '0.75rem', color: '#2563eb', fontWeight: 700 }}>{m.room}</td>
                  <td style={{ padding: '0.75rem', color: '#64748b' }}>{m.eta}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.6875rem' }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}>
                      Check-in
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Booking Ledger Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Booking Ledger</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>Channel manager & front desk capture stream</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }} onClick={() => onNavigate('reservations')}>Go to Central Bookings →</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>BOOKING ID</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>GUEST</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>SUITE TYPE</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>AMOUNT</th>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {bookingLedger.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 800, color: '#2563eb' }}>#{b.id}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{b.guest}</td>
                  <td style={{ padding: '0.75rem', color: '#64748b' }}>{b.roomType}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#10b981' }}>${b.amount}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <span className={`badge ${b.status === 'Checked-in' ? 'badge-occupied' : 'badge-reserved'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
