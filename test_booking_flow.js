const API_BASE = 'http://localhost:8080/api';

async function runTests() {
  console.log('========================================================================');
  console.log('🚀 BẮT ĐẦU TEST TOÀN DIỆN: TẤT CẢ VALIDATIONS & TOÀN BỘ FLOW ĐẶT PHÒNG');
  console.log('========================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failedTests++;
    }
  }

  // 1. Staff Login
  console.log('--- 1. ĐĂNG NHẬP NHÂN VIÊN/QUẢN TRỊ (ADMIN) ---');
  let token = '';
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token, `Đăng nhập thành công, nhận JWT Token (Vai trò: ${loginData.role})`);
    token = loginData.token;
  } catch (err) {
    console.error('Lỗi đăng nhập:', err.message);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. Lấy danh sách phòng
  console.log('\n--- 2. LẤY DANH SÁCH PHÒNG TỪ HỆ THỐNG ---');
  let rooms = [];
  let testRoom = null;
  try {
    const roomRes = await fetch(`${API_BASE}/rooms`, { headers: authHeaders });
    rooms = await roomRes.json();
    assert(Array.isArray(rooms) && rooms.length > 0, `Đã tải thành công ${rooms.length} phòng`);

    const allBookingsRes = await fetch(`${API_BASE}/bookings`, { headers: authHeaders });
    const allBookings = await allBookingsRes.json();
    const busyRoomIds = new Set(
      allBookings
        .filter(b => ['CHECKED_IN', 'Checked-in', 'CONFIRMED', 'BOOKED'].includes(b.status))
        .map(b => b.room?.id)
    );

    testRoom = rooms.find(r => r.status?.toUpperCase() === 'AVAILABLE' && !busyRoomIds.has(r.id)) 
      || rooms.find(r => !busyRoomIds.has(r.id)) 
      || rooms[rooms.length - 1];
  } catch (err) {
    console.error('Lỗi tải danh sách phòng:', err.message);
  }

  console.log(`-> Phòng được chọn thử nghiệm: ${testRoom.roomNumber} (ID: ${testRoom.id}, Loại: ${testRoom.roomType?.name}, Sức chứa: ${testRoom.roomType?.capacity || 2} người, Giá: ${testRoom.roomType?.basePrice?.toLocaleString()} đ)`);

  // 3. Test tất cả các trường hợp Validation
  console.log('\n--- 3. TEST CÁC RÀNG BUỘC VALIDATION NGHIÊM NGẶT ---');

  // Test 3.1: Số điện thoại không hợp lệ (< 9 số)
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        roomId: testRoom.id,
        guestName: 'Nguyễn Văn Test',
        guestPhone: '0912', // Quá ngắn
        guestEmail: 'test@example.com',
        checkInDate: '2026-11-01T14:00:00',
        checkOutDate: '2026-11-03T12:00:00',
        numGuests: 1
      })
    });
    const err = await res.json();
    assert(res.status === 400 && (err.message || '').toLowerCase().includes('số điện thoại'), 
      `Validate SĐT không hợp lệ: "${err.message}"`);
  } catch (e) {
    console.error(e);
  }

  // Test 3.2: Email sai định dạng (không có @ / domain)
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        roomId: testRoom.id,
        guestName: 'Nguyễn Văn Test',
        guestPhone: '0987654321',
        guestEmail: 'dinh_dang_email_sai', // Sai định dạng
        checkInDate: '2026-11-01T14:00:00',
        checkOutDate: '2026-11-03T12:00:00',
        numGuests: 1
      })
    });
    const err = await res.json();
    assert(res.status === 400 && (err.message || '').toLowerCase().includes('email'), 
      `Validate Email sai định dạng: "${err.message}"`);
  } catch (e) {
    console.error(e);
  }

  // Test 3.3: Ngày trả phòng trước hoặc bằng ngày nhận phòng
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        roomId: testRoom.id,
        guestName: 'Nguyễn Văn Test',
        guestPhone: '0987654321',
        guestEmail: 'test@gmail.com',
        checkInDate: '2026-11-05T14:00:00',
        checkOutDate: '2026-11-03T12:00:00', // Ngày trả trước ngày nhận
        numGuests: 1
      })
    });
    const err = await res.json();
    assert(res.status === 400 && (err.message || '').toLowerCase().includes('trả phòng'), 
      `Validate Ngày trả phòng trước ngày nhận: "${err.message}"`);
  } catch (e) {
    console.error(e);
  }

  // Test 3.4: Số khách vượt quá sức chứa tối đa của phòng
  try {
    const capacity = testRoom.roomType?.capacity || 2;
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        roomId: testRoom.id,
        guestName: 'Nguyễn Văn Test',
        guestPhone: '0987654321',
        guestEmail: 'test@gmail.com',
        checkInDate: '2026-11-10T14:00:00',
        checkOutDate: '2026-11-12T12:00:00',
        numGuests: capacity + 5 // Vượt sức chứa
      })
    });
    const err = await res.json();
    assert(res.status === 400 && (err.message || '').toLowerCase().includes('sức chứa'), 
      `Validate số khách vượt sức chứa: "${err.message}"`);
  } catch (e) {
    console.error(e);
  }

  // Test 3.5: Ngày nhận phòng trong quá khứ
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        roomId: testRoom.id,
        guestName: 'Nguyễn Văn Test',
        guestPhone: '0987654321',
        guestEmail: 'test@gmail.com',
        checkInDate: '2020-01-01T14:00:00', // Quá khứ
        checkOutDate: '2020-01-03T12:00:00',
        numGuests: 1
      })
    });
    const err = await res.json();
    assert(res.status === 400 && (err.message || '').toLowerCase().includes('quá khứ'), 
      `Validate thời gian nhận phòng ở quá khứ: "${err.message}"`);
  } catch (e) {
    console.error(e);
  }

  // 4. Test toàn bộ flow nghiệp vụ
  console.log('\n--- 4. BẮT ĐẦU CHẠY FLOW ĐẶT PHÒNG KHÁCH SẠN THỰC TẾ ---');

  let bookingId = null;
  const inDate = '2026-12-10T14:00:00';
  const outDate = '2026-12-12T12:00:00';

  // [BƯỚC 1]: Client đặt phòng trực tuyến (Client Booking)
  console.log('\n[Bước 1]: Khách hàng tạo đơn đặt phòng trực tuyến (Client Booking)...');
  try {
    const clientBookingRes = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        roomId: testRoom.id,
        guestName: 'Hoàng Minh Quân',
        guestPhone: '0988665544',
        guestEmail: 'minhquan@gmail.com',
        guestIdCard: '079201009988',
        guestGender: 'Nam',
        checkInDate: inDate,
        checkOutDate: outDate,
        numGuests: testRoom.roomType?.capacity || 2,
        status: 'PENDING',
        notes: 'Khách đặt online qua cổng Client Portal - Cần phòng tầng cao'
      })
    });

    const bookingData = await clientBookingRes.json();
    assert(clientBookingRes.status === 200 || clientBookingRes.status === 201, 
      `Tạo đơn thành công! Mã đơn: ${bookingData.bookingCode}, Khách: ${bookingData.guest?.fullName}`);
    assert(bookingData.status === 'PENDING', 
      `Trạng thái khởi tạo đúng chuẩn: PENDING (hiện tại = ${bookingData.status})`);
    bookingId = bookingData.id;
  } catch (e) {
    console.error('Lỗi bước 1:', e);
  }

  // [BƯỚC 1.1]: Kiểm tra validation phòng đã có người đặt (Trùng lịch)
  console.log('\n[Validate chống trùng lịch]: Khách khác cố đặt trùng thời gian phòng này...');
  try {
    const dupRes = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        roomId: testRoom.id,
        guestName: 'Người Cố Trùng Lịch',
        guestPhone: '0977112233',
        guestEmail: 'trung@gmail.com',
        checkInDate: '2026-12-10T16:00:00', // Trùng khoảng ngày
        checkOutDate: '2026-12-11T10:00:00',
        numGuests: 1
      })
    });
    const dupErr = await dupRes.json();
    assert(dupRes.status === 400 && (dupErr.message || '').toLowerCase().includes('đã có đơn đặt'), 
      `Chặn trùng lịch thành công: "${dupErr.message}"`);
  } catch (e) {
    console.error(e);
  }

  // [BƯỚC 2]: Nhân viên lễ tân xác nhận đặt phòng (CONFIRMED)
  console.log('\n[Bước 2]: Nhân viên lễ tân kiểm tra và xác nhận đơn đặt phòng...');
  try {
    const confirmRes = await fetch(`${API_BASE}/bookings/${bookingId}/confirm`, {
      method: 'POST',
      headers: authHeaders
    });
    const confirmedData = await confirmRes.json();
    assert(confirmRes.status === 200, `Gọi API xác nhận đặt phòng thành công (HTTP 200)`);
    assert(confirmedData.status === 'CONFIRMED', 
      `Trạng thái đơn chuyển sang CONFIRMED: ${confirmedData.status}`);
  } catch (e) {
    console.error('Lỗi bước 2:', e);
  }

  // [BƯỚC 3]: Khách đến khách sạn và làm thủ tục nhận phòng (Check-in)
  console.log('\n[Bước 3]: Khách đến làm thủ tục Check-in nhận chìa khóa phòng...');
  try {
    const checkInRes = await fetch(`${API_BASE}/bookings/${bookingId}/check-in`, {
      method: 'POST',
      headers: authHeaders
    });
    const checkInData = await checkInRes.json();
    assert(checkInRes.status === 200, `Thực hiện check-in thành công`);
    assert(checkInData.status === 'CHECKED_IN', `Trạng thái đơn đặt phòng đổi thành CHECKED_IN`);

    // Kiểm tra trạng thái phòng phải là OCCUPIED
    const roomCheck = await fetch(`${API_BASE}/rooms/${testRoom.id}`, { headers: authHeaders });
    const roomState = await roomCheck.json();
    assert(roomState.status === 'OCCUPIED', 
      `Trạng thái phòng chuyển sang OCCUPIED (Đang có khách lưu trú): ${roomState.status}`);
  } catch (e) {
    console.error('Lỗi bước 3:', e);
  }

  // [BƯỚC 4]: Khách gọi dịch vụ phòng (Order Services)
  console.log('\n[Bước 4]: Khách sử dụng dịch vụ tại khách sạn (nước uống, giặt ủi, đồ ăn)...');
  try {
    const sRes = await fetch(`${API_BASE}/services`, { headers: authHeaders });
    const services = await sRes.json();
    assert(Array.isArray(services) && services.length > 0, `Hệ thống có ${services.length} dịch vụ khả dụng`);

    const s1 = services[0];
    const s2 = services[1] || services[0];

    // Validate dịch vụ: số lượng <= 0
    const invalidServiceRes = await fetch(`${API_BASE}/services/order`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        bookingId: bookingId,
        serviceId: s1.id,
        quantity: 0
      })
    });
    const invalidServiceErr = await invalidServiceRes.json();
    assert(invalidServiceRes.status === 400 && (invalidServiceErr.message || '').toLowerCase().includes('số lượng'), 
      `Validate số lượng dịch vụ <= 0 chặn đúng: "${invalidServiceErr.message}"`);

    // Order service 1: quantity = 3
    const oRes1 = await fetch(`${API_BASE}/services/order`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        bookingId: bookingId,
        serviceId: s1.id,
        quantity: 3
      })
    });
    const oData1 = await oRes1.json();
    assert(oRes1.status === 200 && oData1.id, 
      `Order dịch vụ 1: "${s1.name}" x 3 = ${oData1.totalPrice?.toLocaleString()} đ`);

    // Order service 2: quantity = 2
    const oRes2 = await fetch(`${API_BASE}/services/order`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        bookingId: bookingId,
        serviceId: s2.id,
        quantity: 2
      })
    });
    const oData2 = await oRes2.json();
    assert(oRes2.status === 200 && oData2.id, 
      `Order dịch vụ 2: "${s2.name}" x 2 = ${oData2.totalPrice?.toLocaleString()} đ`);

    // Kiểm tra danh sách dịch vụ của booking
    const bServiceRes = await fetch(`${API_BASE}/services/booking/${bookingId}`, { headers: authHeaders });
    const bServices = await bServiceRes.json();
    assert(Array.isArray(bServices) && bServices.length >= 2, 
      `Booking đã ghi nhận ${bServices.length} món dịch vụ phát sinh trong quá trình lưu trú`);
  } catch (e) {
    console.error('Lỗi bước 4:', e);
  }

  // [BƯỚC 5]: Khách làm thủ tục trả phòng (Check-out)
  console.log('\n[Bước 5]: Khách làm thủ tục Check-out trả phòng...');
  try {
    const checkOutRes = await fetch(`${API_BASE}/bookings/${bookingId}/check-out`, {
      method: 'POST',
      headers: authHeaders
    });
    const checkOutBooking = await checkOutRes.json();
    assert(checkOutRes.status === 200, `Gọi API Check-out thành công (HTTP 200)`);
    assert(checkOutBooking.status === 'CHECKED_OUT', 
      `Trạng thái booking chuyển sang: ${checkOutBooking.status}`);

    // Kiểm tra trạng thái phòng tự động chuyển sang CLEANING để dọn phòng
    const roomCheckAfter = await fetch(`${API_BASE}/rooms/${testRoom.id}`, { headers: authHeaders });
    const roomStateAfter = await roomCheckAfter.json();
    assert(roomStateAfter.status === 'CLEANING', 
      `Trạng thái phòng tự động chuyển sang CLEANING (Chờ dọn dẹp vệ sinh): ${roomStateAfter.status}`);
  } catch (e) {
    console.error('Lỗi bước 5:', e);
  }

  // [BƯỚC 6]: Kiểm tra Hóa đơn (Invoice) và đối soát thanh toán
  console.log('\n[Bước 6]: Kiểm tra Hóa đơn (Invoice) tự động sinh và đối soát chi phí...');
  try {
    const invRes = await fetch(`${API_BASE}/invoices/booking/${bookingId}`, { headers: authHeaders });
    const invoice = await invRes.json();
    assert(invRes.status === 200 && invoice.id, 
      `Đã tìm thấy hóa đơn: Mã ${invoice.invoiceNumber}`);
    assert(invoice.status === 'PAID', 
      `Trạng thái thanh toán của hóa đơn: ${invoice.status}`);
    assert(invoice.roomCharge > 0, 
      `Tiền phòng: ${invoice.roomCharge?.toLocaleString()} đ`);
    assert(invoice.serviceCharge > 0, 
      `Tiền dịch vụ: ${invoice.serviceCharge?.toLocaleString()} đ`);

    const expectedSubtotal = invoice.roomCharge + invoice.serviceCharge;
    const expectedTax = expectedSubtotal * 0.1;
    const expectedTotal = expectedSubtotal + expectedTax;

    assert(Math.abs(invoice.totalAmount - expectedTotal) < 1, 
      `Tổng tiền hóa đơn chính xác: ${invoice.totalAmount?.toLocaleString()} đ (Tiền phòng: ${invoice.roomCharge?.toLocaleString()} đ + Dịch vụ: ${invoice.serviceCharge?.toLocaleString()} đ + VAT 10%: ${invoice.taxAmount?.toLocaleString()} đ)`);
  } catch (e) {
    console.error('Lỗi bước 6:', e);
  }

  console.log('\n========================================================================');
  console.log(`🎉 KẾT QUẢ TEST: ✅ ${passedTests} passed | ❌ ${failedTests} failed`);
  console.log('========================================================================');
}

runTests();
