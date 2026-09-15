-- Extended MySQL Schema for Hotel Management System (Grand Horizon Edition)

CREATE DATABASE IF NOT EXISTS hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_db;

-- 1. Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    permissions TEXT -- Comma separated permissions
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'RECEPTIONIST',
    phone VARCHAR(20),
    email VARCHAR(100),
    is_locked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Staff
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL, -- Admin, Manager, Receptionist, Accountant, Housekeeping
    department VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Room Types
CREATE TABLE IF NOT EXISTS room_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DOUBLE NOT NULL,
    capacity INT DEFAULT 2,
    amenities TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    room_type_id BIGINT NOT NULL,
    floor INT DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- Available, Reserved, Occupied, Cleaning, Maintenance
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Guests
CREATE TABLE IF NOT EXISTS guests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    id_card VARCHAR(30),
    email VARCHAR(100),
    gender VARCHAR(10),
    address VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Reservations / Bookings
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    guest_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATETIME NOT NULL,
    check_out_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED', -- Pending, Confirmed, Checked-in, Checked-out, Cancelled
    payment_status VARCHAR(20) DEFAULT 'UNPAID', -- Unpaid, Deposit, Paid, Refunded
    total_amount DOUBLE NOT NULL,
    num_guests INT DEFAULT 1,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Services
CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DOUBLE NOT NULL,
    category VARCHAR(30), -- Breakfast, Laundry, Room Service, Airport Transfer, Spa, Minibar
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Service Usage
CREATE TABLE IF NOT EXISTS service_usages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price DOUBLE NOT NULL,
    ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Payments / Invoices
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_code VARCHAR(30) NOT NULL UNIQUE,
    reservation_id BIGINT NOT NULL,
    room_charge DOUBLE NOT NULL,
    service_charge DOUBLE DEFAULT 0,
    tax_amount DOUBLE DEFAULT 0,
    total_amount DOUBLE NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- Cash, Bank Transfer, Credit Card
    status VARCHAR(20) DEFAULT 'PAID', -- Pending, Paid, Refunded
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Hotel Settings
CREATE TABLE IF NOT EXISTS hotel_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(30),
    email VARCHAR(100),
    tax_rate DOUBLE DEFAULT 10.0,
    currency VARCHAR(10) DEFAULT 'VND'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data
INSERT INTO roles (id, name, description, permissions) VALUES
(1, 'Admin', 'Quản trị viên toàn hệ thống', 'ALL'),
(2, 'Receptionist', 'Nhân viên lễ tân khách sạn', 'MANAGE_BOOKINGS,CHECKIN_CHECKOUT,MANAGE_GUESTS,SERVICING'),
(3, 'Staff', 'Nhân viên buồng phòng & dịch vụ', 'UPDATE_ROOM_STATUS,EXECUTE_SERVICES'),
(4, 'Customer', 'Khách hàng đặt phòng trực tuyến', 'VIEW_ROOMS,ONLINE_BOOKING,MY_BOOKINGS')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (id, username, password, full_name, role, phone, email, is_locked) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9tqO7uX5R0LwVti', 'Sarah Jenkins (Admin)', 'Admin', '0901234567', 'admin@hotel.com', false),
(2, 'letan01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9tqO7uX5R0LwVti', 'Trần Thị Lễ Tân', 'Receptionist', '0912345678', 'letan@hotel.com', false),
(3, 'staff01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9tqO7uX5R0LwVti', 'Nguyễn Văn Staff (Buồng Phòng)', 'Staff', '0933445566', 'staff@hotel.com', false),
(4, 'khach01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9tqO7uX5R0LwVti', 'Lê Hoàng Khách (VVIP)', 'Customer', '0988776655', 'khachhang@gmail.com', false)
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO staff (id, user_id, full_name, position, department, phone, email, status) VALUES
(1, 1, 'Sarah Jenkins', 'System Admin', 'Management', '0901234567', 'admin@hotel.com', 'ACTIVE'),
(2, 2, 'Trần Thị Lễ Tân', 'Front Desk Officer', 'Front Desk', '0912345678', 'letan@hotel.com', 'ACTIVE'),
(3, 3, 'Nguyễn Văn Staff', 'Housekeeping Specialist', 'Housekeeping', '0933445566', 'staff@hotel.com', 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name=full_name;

INSERT INTO room_types (id, name, description, base_price, capacity, amenities) VALUES
(1, 'Standard Single', 'Phòng tiêu chuẩn 1 giường đơn', 450000.0, 1, 'Wifi, TV 43", AirCon'),
(2, 'Standard Double', 'Phòng tiêu chuẩn 1 giường đôi lớn', 650000.0, 2, 'Wifi, TV 50", Minibar, AirCon'),
(3, 'Deluxe Ocean View', 'Phòng sang trọng view biển, ban công', 1200000.0, 2, 'King Bed, Ocean View, Jacuzzi, Smart TV'),
(4, 'VIP Executive Suite', 'Căn hộ khách sạn VIP phòng khách riêng', 2500000.0, 4, '2 King Beds, Living Room, Jacuzzi, Balcony')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO rooms (id, room_number, room_type_id, floor, status) VALUES
(101, 'P101', 1, 1, 'Available'),
(102, 'P102', 1, 1, 'Occupied'),
(103, 'P103', 2, 1, 'Available'),
(104, 'P104', 2, 1, 'Reserved'),
(201, 'P201', 2, 2, 'Occupied'),
(202, 'P202', 3, 2, 'Available'),
(203, 'P203', 3, 2, 'Cleaning'),
(204, 'P204', 3, 2, 'Maintenance'),
(301, 'P301', 4, 3, 'Occupied'),
(302, 'P302', 4, 3, 'Available')
ON DUPLICATE KEY UPDATE room_number=room_number;

INSERT INTO guests (id, full_name, phone, id_card, email, gender, address) VALUES
(1, 'Marcus Chen', '0988776655', '012345678901', 'marcus.chen@gmail.com', 'Nam', 'Hà Nội'),
(2, 'Elena Vance', '0977665544', '098765432109', 'elena.vance@gmail.com', 'Nữ', 'Đà Nẵng'),
(3, 'David Sterling', '+12025550192', 'PASSPORT-US9988', 'david.sterling@email.com', 'Nam', 'USA')
ON DUPLICATE KEY UPDATE full_name=full_name;

INSERT INTO reservations (id, booking_code, guest_id, room_id, check_in_date, check_out_date, status, payment_status, total_amount, num_guests, notes) VALUES
(1, 'RSH-8902', 1, 102, '2026-09-15 14:00:00', '2026-09-17 12:00:00', 'Checked-in', 'Paid', 900000.0, 2, 'Khách VIP Tier 2'),
(2, 'RSH-8901', 2, 201, '2026-09-15 12:00:00', '2026-09-18 12:00:00', 'Checked-in', 'Paid', 1950000.0, 2, 'Khách cần đưa đón'),
(3, 'RSH-8900', 3, 301, '2026-09-14 10:00:00', '2026-09-16 12:00:00', 'Checked-in', 'Deposit', 5000000.0, 3, 'Phòng Penthouse Executive')
ON DUPLICATE KEY UPDATE booking_code=booking_code;

INSERT INTO services (id, name, price, category, description, is_active) VALUES
(1, 'Bữa sáng buffet sang trọng', 150000.0, 'Breakfast', 'Buffet Á - Âu hơn 50 món', true),
(2, 'Giặt ủi quần áo cao cấp', 50000.0, 'Laundry', 'Giặt sạch & hấp ủi thơm', true),
(3, 'Phục vụ ăn uống tại phòng (Room Service)', 200000.0, 'Room Service', 'Set ăn tối tại phòng', true),
(4, 'Xe đưa đón sân bay (7 chỗ)', 250000.0, 'Airport Transfer', 'Xe đón tận sảnh sân bay', true),
(5, 'Massage Spa thảo dược (60 phút)', 350000.0, 'Spa', 'Thư giãn toàn thân', true),
(6, 'Nước ngọt & Minibar tủ lạnh', 30000.0, 'Minibar', 'Nước ép & đồ uống nhẹ', true)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO service_usages (id, reservation_id, service_id, quantity, total_price, ordered_at) VALUES
(1, 1, 1, 2, 300000.0, '2026-09-15 08:00:00'),
(2, 1, 6, 4, 120000.0, '2026-09-15 19:30:00'),
(3, 2, 5, 1, 350000.0, '2026-09-15 16:00:00')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO payments (id, payment_code, reservation_id, room_charge, service_charge, tax_amount, total_amount, payment_method, status, created_at, notes) VALUES
(1, 'PAY-8902', 1, 900000.0, 420000.0, 132000.0, 1452000.0, 'Credit Card', 'Paid', '2026-09-15 18:00:00', 'Thanh toán qua thẻ VISA')
ON DUPLICATE KEY UPDATE payment_code=payment_code;

INSERT INTO hotel_settings (id, hotel_name, address, phone, email, tax_rate, currency) VALUES
(1, 'Grand Horizon Resort & Spa (Main Wing)', '123 Ocean Boulevard, Da Nang, Vietnam', '+84 236 399 9999', 'info@grandhorizonresort.com', 10.0, 'VND')
ON DUPLICATE KEY UPDATE hotel_name=hotel_name;
