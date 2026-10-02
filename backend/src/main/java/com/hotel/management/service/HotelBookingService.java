package com.hotel.management.service;

import com.hotel.management.dto.BookingRequest;
import com.hotel.management.entity.Booking;
import com.hotel.management.entity.Guest;
import com.hotel.management.entity.Room;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.GuestRepository;
import com.hotel.management.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class HotelBookingService {

    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final InvoiceService invoiceService;

    public HotelBookingService(BookingRepository bookingRepository, GuestRepository guestRepository, RoomRepository roomRepository, InvoiceService invoiceService) {
        this.bookingRepository = bookingRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.invoiceService = invoiceService;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Returns all bookings belonging to a guest identified by phone or email.
     * Used by the customer portal to show only the logged-in user's bookings.
     */
    public List<Booking> getBookingsByGuestContact(String phone, String email) {
        java.util.Set<Long> guestIds = new java.util.HashSet<>();
        if (phone != null && !phone.isBlank()) {
            guestRepository.findByPhone(phone.trim()).ifPresent(g -> guestIds.add(g.getId()));
        }
        if (email != null && !email.isBlank()) {
            guestRepository.findByEmail(email.trim().toLowerCase()).ifPresent(g -> guestIds.add(g.getId()));
        }
        if (guestIds.isEmpty()) return java.util.Collections.emptyList();
        List<Booking> result = new java.util.ArrayList<>();
        for (Long gId : guestIds) {
            result.addAll(bookingRepository.findByGuestId(gId));
        }
        result.sort((a, b) -> b.getId().compareTo(a.getId()));
        return result;
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt phòng: " + id));
    }

    public Booking createBooking(BookingRequest request, String initialStatus) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu đặt phòng không được để trống.");
        }
        if (request.getRoomId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn phòng cần đặt.");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Phòng không tồn tại: " + request.getRoomId()));

        if ("MAINTENANCE".equalsIgnoreCase(room.getStatus()) || "OUT_OF_SERVICE".equalsIgnoreCase(room.getStatus())) {
            throw new IllegalStateException("Phòng " + room.getRoomNumber() + " hiện đang bảo trì hoặc ngừng phục vụ, không thể đặt.");
        }

        // Validate guest information
        if (request.getGuestName() == null || request.getGuestName().trim().isEmpty()) {
            throw new IllegalArgumentException("Họ và tên khách hàng không được để trống.");
        }
        if (request.getGuestPhone() == null || !request.getGuestPhone().trim().matches("^[0-9+]{9,15}$")) {
            throw new IllegalArgumentException("Số điện thoại khách hàng không hợp lệ (từ 9 đến 15 chữ số).");
        }
        if (request.getGuestEmail() != null && !request.getGuestEmail().trim().isEmpty() 
                && !request.getGuestEmail().trim().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Địa chỉ email không đúng định dạng.");
        }

        // Validate check-in / check-out dates
        LocalDateTime checkIn = request.getCheckInDate() != null ? request.getCheckInDate() : LocalDateTime.now();
        LocalDateTime checkOut = request.getCheckOutDate() != null ? request.getCheckOutDate() : checkIn.plusDays(1);

        if (checkIn.isBefore(LocalDateTime.now().minusHours(2))) {
            throw new IllegalArgumentException("Thời gian nhận phòng không thể ở trong quá khứ.");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Thời gian trả phòng phải sau thời gian nhận phòng.");
        }

        // Validate guest count
        int numGuests = request.getNumGuests() != null ? request.getNumGuests() : 1;
        if (numGuests <= 0) {
            throw new IllegalArgumentException("Số lượng khách lưu trú phải lớn hơn 0.");
        }
        if (room.getRoomType() != null && room.getRoomType().getCapacity() != null && numGuests > room.getRoomType().getCapacity()) {
            throw new IllegalArgumentException("Số lượng khách (" + numGuests + ") vượt quá sức chứa tối đa của phòng " + room.getRoomNumber() + " (" + room.getRoomType().getCapacity() + " người).");
        }

        // Validate deposit amount
        if (request.getDepositAmount() != null && request.getDepositAmount() < 0) {
            throw new IllegalArgumentException("Số tiền đặt cọc không được là số âm.");
        }

        // Validate overlap booking for the room
        List<String> activeStatuses = List.of("PENDING", "Pending", "BOOKED", "CONFIRMED", "CHECKED_IN", "Checked-in");
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(room.getId(), checkIn, checkOut, activeStatuses);
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Phòng " + room.getRoomNumber() + " đã có đơn đặt trong khoảng thời gian này (Mã: " + overlapping.get(0).getBookingCode() + "). Vui lòng chọn phòng hoặc thời gian khác.");
        }

        Guest guest = guestRepository.findByPhone(request.getGuestPhone().trim())
                .orElseGet(() -> {
                    Guest newGuest = new Guest();
                    newGuest.setFullName(request.getGuestName().trim());
                    newGuest.setPhone(request.getGuestPhone().trim());
                    newGuest.setIdCard(request.getGuestIdCard() != null ? request.getGuestIdCard().trim() : null);
                    newGuest.setEmail(request.getGuestEmail() != null ? request.getGuestEmail().trim() : null);
                    newGuest.setGender(request.getGuestGender() != null ? request.getGuestGender() : "Khác");
                    return guestRepository.save(newGuest);
                });

        long days = ChronoUnit.DAYS.between(checkIn.toLocalDate(), checkOut.toLocalDate());
        if (days <= 0) days = 1;

        Double basePrice = (room.getRoomType() != null && room.getRoomType().getBasePrice() != null) 
                ? room.getRoomType().getBasePrice() : 500000.0;
        Double totalAmount = basePrice * days;

        Booking booking = new Booking();
        booking.setBookingCode("BK-" + System.currentTimeMillis() % 1000000);
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        booking.setStatus(initialStatus != null ? initialStatus : "PENDING");
        booking.setTotalAmount(totalAmount);
        booking.setDepositAmount(request.getDepositAmount() != null ? request.getDepositAmount() : 0.0);
        booking.setNumGuests(numGuests);
        booking.setNotes(request.getNotes());

        // Update room status
        if ("CHECKED_IN".equalsIgnoreCase(initialStatus)) {
            room.setStatus("OCCUPIED");
        } else if ("BOOKED".equalsIgnoreCase(initialStatus) || "CONFIRMED".equalsIgnoreCase(initialStatus) || "PENDING".equalsIgnoreCase(initialStatus)) {
            room.setStatus("RESERVED");
        }
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    public Booking confirmBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        if ("CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            return booking;
        }
        if (!"BOOKED".equalsIgnoreCase(booking.getStatus()) && !"PENDING".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException("Chỉ có thể xác nhận đơn đặt phòng ở trạng thái BOOKED hoặc PENDING. Trạng thái hiện tại: " + booking.getStatus());
        }

        booking.setStatus("CONFIRMED");
        if (booking.getRoom() != null && "AVAILABLE".equalsIgnoreCase(booking.getRoom().getStatus())) {
            booking.getRoom().setStatus("RESERVED");
            roomRepository.save(booking.getRoom());
        }
        return bookingRepository.save(booking);
    }

    public Booking checkIn(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        if ("CHECKED_IN".equalsIgnoreCase(booking.getStatus())) {
            return booking;
        }
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus()) || "NO_SHOW".equalsIgnoreCase(booking.getStatus()) || "CHECKED_OUT".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException("Không thể Check-in cho đơn đặt phòng có trạng thái: " + booking.getStatus());
        }

        // Check if room is currently occupied by another booking
        Optional<Booking> currentOccupant = bookingRepository.findFirstByRoomIdAndStatusInOrderByIdDesc(
                booking.getRoom().getId(), List.of("CHECKED_IN", "Checked-in"));
        if (currentOccupant.isPresent() && !currentOccupant.get().getId().equals(booking.getId())) {
            throw new IllegalStateException("Phòng " + booking.getRoom().getRoomNumber() + " hiện đang có khách lưu trú (" + currentOccupant.get().getBookingCode() + "). Không thể check-in phòng này.");
        }

        booking.setStatus("CHECKED_IN");
        booking.getRoom().setStatus("OCCUPIED");
        roomRepository.save(booking.getRoom());
        return bookingRepository.save(booking);
    }

    public Booking checkOut(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        if ("CHECKED_OUT".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException("Đơn đặt phòng này đã hoàn tất Check-out trước đó.");
        }
        if (!"CHECKED_IN".equalsIgnoreCase(booking.getStatus()) && !"Checked-in".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException("Đơn đặt phòng chưa Check-in (Trạng thái: " + booking.getStatus() + "), không thể thực hiện Check-out.");
        }

        // Ensure invoice is generated and linked with all ordered services
        invoiceService.generateInvoiceForBooking(bookingId);

        booking.setStatus("CHECKED_OUT");
        if (booking.getRoom() != null) {
            booking.getRoom().setStatus("CLEANING");
            roomRepository.save(booking.getRoom());
        }
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long bookingId, String reason, Double refundAmount) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus("CANCELLED");
        
        // Release room back to AVAILABLE if it was reserved or occupied
        if (booking.getRoom() != null) {
            booking.getRoom().setStatus("AVAILABLE");
            roomRepository.save(booking.getRoom());
        }

        String cancelNote = String.format(" [Đã hủy booking. Lý do: %s. Hoàn tiền: %s]",
                reason != null ? reason : "Khách yêu cầu hủy",
                refundAmount != null && refundAmount > 0 ? String.format("%,.0f VNĐ", refundAmount) : "Không hoàn tiền");
        booking.setNotes((booking.getNotes() != null ? booking.getNotes() : "") + cancelNote);

        return bookingRepository.save(booking);
    }

    public Booking noShowBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus("NO_SHOW");

        // Release room back to AVAILABLE
        if (booking.getRoom() != null) {
            booking.getRoom().setStatus("AVAILABLE");
            roomRepository.save(booking.getRoom());
        }

        String noShowNote = " [Khách vắng mặt không nhận phòng - No-Show. Đã thu phí phạt giữ cọc theo quy định]";
        booking.setNotes((booking.getNotes() != null ? booking.getNotes() : "") + noShowNote);

        return bookingRepository.save(booking);
    }

    public Booking updateStayDuration(Long bookingId, LocalDateTime newCheckIn, LocalDateTime newCheckOut) {
        Booking booking = getBookingById(bookingId);
        if (newCheckIn != null) booking.setCheckInDate(newCheckIn);
        if (newCheckOut != null) booking.setCheckOutDate(newCheckOut);

        LocalDateTime checkIn = booking.getCheckInDate() != null ? booking.getCheckInDate() : LocalDateTime.now();
        LocalDateTime checkOut = booking.getCheckOutDate() != null ? booking.getCheckOutDate() : checkIn.plusDays(1);
        long days = ChronoUnit.DAYS.between(checkIn.toLocalDate(), checkOut.toLocalDate());
        if (days <= 0) days = 1;

        Double basePrice = booking.getRoom() != null && booking.getRoom().getRoomType() != null 
                ? booking.getRoom().getRoomType().getBasePrice() : 500000.0;
        booking.setTotalAmount(basePrice * days);

        String note = String.format(" [Điều chỉnh thời gian lưu trú: %d đêm (tới %s)]", days, checkOut.toLocalDate());
        booking.setNotes((booking.getNotes() != null ? booking.getNotes() : "") + note);

        return bookingRepository.save(booking);
    }

    public Booking transferRoom(Long bookingId, com.hotel.management.dto.RoomTransferRequest request) {
        Booking booking = null;

        // 1. Try finding by bookingId if valid
        if (bookingId != null && bookingId > 0) {
            booking = bookingRepository.findById(bookingId).orElse(null);
        }

        // 2. If not found, try finding active booking by oldRoomId
        if (booking == null && request.getOldRoomId() != null) {
            booking = bookingRepository.findFirstByRoomIdAndStatusInOrderByIdDesc(
                    request.getOldRoomId(), List.of("CHECKED_IN", "BOOKED", "CONFIRMED", "Checked-in")
            ).orElse(null);
        }

        // Target new room
        Room newRoom = roomRepository.findById(request.getNewRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng mới với ID: " + request.getNewRoomId()));

        Room oldRoom = null;

        // 3. Fallback: If still no booking found in DB, find oldRoom by oldRoomId or create fallback booking
        if (booking == null) {
            if (request.getOldRoomId() != null) {
                oldRoom = roomRepository.findById(request.getOldRoomId()).orElse(null);
            }

            Guest guest = guestRepository.findAll().stream().findFirst().orElseGet(() -> {
                Guest g = new Guest();
                g.setFullName("Khách Lưu Trú");
                g.setPhone("0900000000");
                return guestRepository.save(g);
            });

            booking = new Booking();
            booking.setBookingCode("BK-TR-" + System.currentTimeMillis() % 1000000);
            booking.setGuest(guest);
            booking.setRoom(newRoom);
            booking.setCheckInDate(LocalDateTime.now());
            booking.setCheckOutDate(LocalDateTime.now().plusDays(1));
            booking.setStatus("CHECKED_IN");
            booking.setNumGuests(request.getNewNumGuests() != null ? request.getNewNumGuests() : 2);
            booking.setTotalAmount(newRoom.getRoomType().getBasePrice());
        } else {
            oldRoom = booking.getRoom();
        }

        // Free up old room -> set to CLEANING
        if (oldRoom != null) {
            oldRoom.setStatus("CLEANING");
            roomRepository.save(oldRoom);
        }

        // Occupy new room -> set to OCCUPIED
        if (booking.getStatus() != null && booking.getStatus().toUpperCase().contains("CHECK")) {
            newRoom.setStatus("OCCUPIED");
        } else {
            newRoom.setStatus("RESERVED");
        }
        roomRepository.save(newRoom);

        // Recalculate duration and total
        LocalDateTime checkIn = booking.getCheckInDate() != null ? booking.getCheckInDate() : LocalDateTime.now();
        LocalDateTime checkOut = booking.getCheckOutDate() != null ? booking.getCheckOutDate() : checkIn.plusDays(1);
        long days = ChronoUnit.DAYS.between(checkIn.toLocalDate(), checkOut.toLocalDate());
        if (days <= 0) days = 1;

        Double newTotalAmount = newRoom.getRoomType().getBasePrice() * days;

        booking.setRoom(newRoom);
        if (request.getNewNumGuests() != null) {
            booking.setNumGuests(request.getNewNumGuests());
        }
        booking.setTotalAmount(newTotalAmount);

        String oldRoomNumber = oldRoom != null ? oldRoom.getRoomNumber() : "Cũ";
        String currentNotes = booking.getNotes() != null ? booking.getNotes() : "";
        String transferNote = String.format(" [Chuyển từ phòng %s sang %s. Lý do: %s. Số khách mới: %d người]",
                oldRoomNumber, newRoom.getRoomNumber(),
                request.getReason() != null ? request.getReason() : "Phát sinh thêm người",
                booking.getNumGuests());
        booking.setNotes(currentNotes + transferNote);

        return bookingRepository.save(booking);
    }
}
