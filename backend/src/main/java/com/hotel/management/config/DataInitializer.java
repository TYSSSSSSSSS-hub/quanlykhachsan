package com.hotel.management.config;

import com.hotel.management.entity.*;
import com.hotel.management.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;
    private final GuestRepository guestRepository;
    private final BookingRepository bookingRepository;
    private final BookingServiceRepository bookingServiceRepository;
    private final InvoiceRepository invoiceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, RoomTypeRepository roomTypeRepository, RoomRepository roomRepository, ServiceRepository serviceRepository, GuestRepository guestRepository, BookingRepository bookingRepository, BookingServiceRepository bookingServiceRepository, InvoiceRepository invoiceRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.roomRepository = roomRepository;
        this.serviceRepository = serviceRepository;
        this.guestRepository = guestRepository;
        this.bookingRepository = bookingRepository;
        this.bookingServiceRepository = bookingServiceRepository;
        this.invoiceRepository = invoiceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        // 1. Users
        User admin = userRepository.save(new User(null, "admin", passwordEncoder.encode("admin123"), "Sarah Jenkins", "ADMIN", "0901234567", "sarah.jenkins@hotel.com"));
        User letan = userRepository.save(new User(null, "letan01", passwordEncoder.encode("admin123"), "Trần Thị Lễ Tân", "RECEPTIONIST", "0912345678", "letan@hotel.com"));

        // 2. Room Types
        RoomType rt1 = roomTypeRepository.save(new RoomType(null, "Standard Single", "Phòng tiêu chuẩn 1 giường đơn, đầy đủ tiện nghi cơ bản, view thành phố", 450000.0, 1, "1 Giường Đơn, Wifi, TV 43 inch, Điều hòa, Vòi sen"));
        RoomType rt2 = roomTypeRepository.save(new RoomType(null, "Standard Double", "Phòng tiêu chuẩn 1 giường đôi lớn, thoải mái cho 2 người", 650000.0, 2, "1 Giường Đôi, Wifi, TV 50 inch, Điều hòa, Minibar, Vòi sen"));
        RoomType rt3 = roomTypeRepository.save(new RoomType(null, "Deluxe Ocean View", "Phòng sang trọng với cửa kính lớn hướng biển, ban công riêng", 1200000.0, 2, "1 Giường King, Wifi, TV 55 inch, Ban công, Bồn tắm, Minibar, Máy pha cà phê"));
        RoomType rt4 = roomTypeRepository.save(new RoomType(null, "VIP Executive Suite", "Căn hộ khách sạn cao cấp bao gồm phòng khách riêng, bồn tắm Jacuzzi", 2500000.0, 4, "2 Giường King, Phòng khách, Jacuzzi, Smart TV 65 inch, View panorama, Dịch vụ phòng 24/7"));

        // 3. Rooms
        Room r101 = roomRepository.save(new Room(null, "P101", rt1, 1, "AVAILABLE"));
        Room r102 = roomRepository.save(new Room(null, "P102", rt1, 1, "OCCUPIED"));
        Room r103 = roomRepository.save(new Room(null, "P103", rt2, 1, "AVAILABLE"));
        Room r104 = roomRepository.save(new Room(null, "P104", rt2, 1, "RESERVED"));
        Room r201 = roomRepository.save(new Room(null, "P201", rt2, 2, "OCCUPIED"));
        Room r202 = roomRepository.save(new Room(null, "P202", rt3, 2, "AVAILABLE"));
        Room r203 = roomRepository.save(new Room(null, "P203", rt3, 2, "CLEANING"));
        Room r204 = roomRepository.save(new Room(null, "P204", rt3, 2, "MAINTENANCE"));
        Room r301 = roomRepository.save(new Room(null, "P301", rt4, 3, "OCCUPIED"));
        Room r302 = roomRepository.save(new Room(null, "P302", rt4, 3, "AVAILABLE"));

        // 4. Services
        Service s1 = serviceRepository.save(new Service(null, "Nước suối Aquafina 500ml", 20000.0, "BEVERAGE", "Nước uống đóng chai"));
        Service s2 = serviceRepository.save(new Service(null, "Bia Heineken lon", 35000.0, "BEVERAGE", "Đồ uống có cồn"));
        Service s3 = serviceRepository.save(new Service(null, "Giặt ủi quần áo (Bộ)", 50000.0, "LAUNDRY", "Giặt sạch & ủi phẳng"));
        Service s4 = serviceRepository.save(new Service(null, "Mì ly Omachi", 25000.0, "FOOD", "Đồ ăn nhanh"));
        Service s5 = serviceRepository.save(new Service(null, "Massage Spa thư giãn (60 phút)", 350000.0, "SPA", "Dịch vụ chăm sóc sức khỏe"));
        Service s6 = serviceRepository.save(new Service(null, "Xe đưa đón sân bay", 250000.0, "TRANSPORT", "Xe 7 chỗ đưa đón tận nơi"));

        // 5. Guests
        Guest g1 = guestRepository.save(new Guest(null, "Marcus Chen", "0988776655", "012345678901", "marcus.chen@gmail.com", "Nam"));
        Guest g2 = guestRepository.save(new Guest(null, "Elena Vance", "0977665544", "098765432109", "elena.vance@gmail.com", "Nữ"));
        Guest g3 = guestRepository.save(new Guest(null, "David Sterling", "+12025550192", "PASSPORT-US9988", "david.sterling@email.com", "Nam"));

        // 6. Bookings
        Booking b1 = bookingRepository.save(new Booking(null, "BK-20260915-102", g1, r102, LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(1), "CHECKED_IN", 900000.0, 2, "Khách cần thêm gối"));
        Booking b2 = bookingRepository.save(new Booking(null, "BK-20260915-201", g2, r201, LocalDateTime.now(), LocalDateTime.now().plusDays(3), "CHECKED_IN", 1950000.0, 3, "Yêu cầu phòng tầng cao"));
        Booking b3 = bookingRepository.save(new Booking(null, "BK-20260915-301", g3, r301, LocalDateTime.now().minusDays(2), LocalDateTime.now(), "CHECKED_IN", 5000000.0, 2, "Khách VIP quốc tế"));

        // 7. Booking Services
        bookingServiceRepository.save(new BookingService(null, b1, s1, 4, 80000.0, LocalDateTime.now()));
        bookingServiceRepository.save(new BookingService(null, b1, s2, 2, 70000.0, LocalDateTime.now()));
        bookingServiceRepository.save(new BookingService(null, b2, s5, 1, 350000.0, LocalDateTime.now()));

        // 8. Invoices
        invoiceRepository.save(new Invoice(null, "INV-20260915-001", b1, 900000.0, 150000.0, 105000.0, 1155000.0, "PAID", "CASH", LocalDateTime.now(), "Thanh toán tiền mặt tại lễ tân"));
    }
}
