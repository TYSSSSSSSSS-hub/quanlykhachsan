-- Initial data for Hotel Management System (Clean UTF-8)

MERGE INTO users (id, username, password, full_name, role, phone, email) KEY (id) VALUES 
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9tqO7uX5R0LwVti', 'Sarah Jenkins', 'ADMIN', '0901234567', 'sarah.jenkins@hotel.com'),
(2, 'letan01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9tqO7uX5R0LwVti', 'Trần Thị Lễ Tân', 'RECEPTIONIST', '0912345678', 'letan@hotel.com');

MERGE INTO room_types (id, name, description, base_price, capacity, amenities) KEY (id) VALUES
(1, 'Standard Single', 'Phòng tiêu chuẩn 1 giường đơn, đầy đủ tiện nghi cơ bản, view thành phố', 450000.0, 1, '1 Giường Đơn, Wifi, TV 43 inch, Điều hòa, Vòi sen'),
(2, 'Standard Double', 'Phòng tiêu chuẩn 1 giường đôi lớn, thoải mái cho 2 người', 650000.0, 2, '1 Giường Đôi, Wifi, TV 50 inch, Điều hòa, Minibar, Vòi sen'),
(3, 'Deluxe Ocean View', 'Phòng sang trọng với cửa kính lớn hướng biển, ban công riêng', 1200000.0, 2, '1 Giường King, Wifi, TV 55 inch, Ban công, Bồn tắm, Minibar, Máy pha cà phê'),
(4, 'VIP Executive Suite', 'Căn hộ khách sạn cao cấp bao gồm phòng khách riêng, bồn tắm Jacuzzi', 2500000.0, 4, '2 Giường King, Phòng khách, Jacuzzi, Smart TV 65 inch, View panorama, Dịch vụ phòng 24/7');

MERGE INTO rooms (id, room_number, room_type_id, floor, status) KEY (id) VALUES
(101, 'P101', 1, 1, 'AVAILABLE'),
(102, 'P102', 1, 1, 'OCCUPIED'),
(103, 'P103', 2, 1, 'AVAILABLE'),
(104, 'P104', 2, 1, 'RESERVED'),
(201, 'P201', 2, 2, 'OCCUPIED'),
(202, 'P202', 3, 2, 'AVAILABLE'),
(203, 'P203', 3, 2, 'CLEANING'),
(204, 'P204', 3, 2, 'MAINTENANCE'),
(301, 'P301', 4, 3, 'OCCUPIED'),
(302, 'P302', 4, 3, 'AVAILABLE');

MERGE INTO services (id, name, price, category, description) KEY (id) VALUES
(1, 'Nước suối Aquafina 500ml', 20000.0, 'BEVERAGE', 'Nước uống đóng chai'),
(2, 'Bia Heineken lon', 35000.0, 'BEVERAGE', 'Đồ uống có cồn'),
(3, 'Giặt ủi quần áo (Bộ)', 50000.0, 'LAUNDRY', 'Giặt sạch & ủi phẳng'),
(4, 'Mì ly Omachi', 25000.0, 'FOOD', 'Đồ ăn nhanh'),
(5, 'Massage Spa thư giãn (60 phút)', 35000.0, 'SPA', 'Dịch vụ chăm sóc sức khỏe'),
(6, 'Xe đưa đón sân bay', 250000.0, 'TRANSPORT', 'Xe 7 chỗ đưa đón tận nơi');

MERGE INTO guests (id, full_name, phone, id_card, email, gender) KEY (id) VALUES
(1, 'Marcus Chen', '0988776655', '012345678901', 'marcus.chen@gmail.com', 'Nam'),
(2, 'Elena Vance', '0977665544', '098765432109', 'elena.vance@gmail.com', 'Nữ'),
(3, 'David Sterling', '+12025550192', 'PASSPORT-US9988', 'david.sterling@email.com', 'Nam');

MERGE INTO bookings (id, booking_code, guest_id, room_id, check_in_date, check_out_date, status, total_amount, num_guests, notes) KEY (id) VALUES
(1, 'BK-20260915-102', 1, 102, '2026-09-15 14:00:00', '2026-09-17 12:00:00', 'CHECKED_IN', 900000.0, 2, 'Khách cần thêm gối'),
(2, 'BK-20260915-201', 2, 201, '2026-09-15 12:00:00', '2026-09-18 12:00:00', 'CHECKED_IN', 1950000.0, 3, 'Yêu cầu phòng tầng cao'),
(3, 'BK-20260915-301', 3, 301, '2026-09-14 10:00:00', '2026-09-16 12:00:00', 'CHECKED_IN', 5000000.0, 2, 'Khách VIP quốc tế');

MERGE INTO booking_services (id, booking_id, service_id, quantity, total_price, ordered_at) KEY (id) VALUES
(1, 1, 1, 4, 80000.0, '2026-09-15 15:00:00'),
(2, 1, 2, 2, 70000.0, '2026-09-15 19:30:00'),
(3, 2, 5, 1, 350000.0, '2026-09-15 16:00:00');

MERGE INTO invoices (id, invoice_number, booking_id, room_charge, service_charge, tax_amount, total_amount, status, payment_method, created_at, notes) KEY (id) VALUES
(1, 'INV-20260915-001', 1, 900000.0, 150000.0, 105000.0, 1155000.0, 'PAID', 'CASH', '2026-09-15 18:00:00', 'Thanh toán tiền mặt tại lễ tân');
