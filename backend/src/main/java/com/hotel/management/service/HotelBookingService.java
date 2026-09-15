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
import java.util.UUID;

@Service
public class HotelBookingService {

    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;

    public HotelBookingService(BookingRepository bookingRepository, GuestRepository guestRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt phòng: " + id));
    }

    public Booking createBooking(BookingRequest request, String initialStatus) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại: " + request.getRoomId()));

        Guest guest = guestRepository.findByPhone(request.getGuestPhone())
                .orElseGet(() -> {
                    Guest newGuest = new Guest();
                    newGuest.setFullName(request.getGuestName());
                    newGuest.setPhone(request.getGuestPhone());
                    newGuest.setIdCard(request.getGuestIdCard());
                    newGuest.setEmail(request.getGuestEmail());
                    newGuest.setGender(request.getGuestGender() != null ? request.getGuestGender() : "Khác");
                    return guestRepository.save(newGuest);
                });

        LocalDateTime checkIn = request.getCheckInDate() != null ? request.getCheckInDate() : LocalDateTime.now();
        LocalDateTime checkOut = request.getCheckOutDate() != null ? request.getCheckOutDate() : checkIn.plusDays(1);

        long days = ChronoUnit.DAYS.between(checkIn.toLocalDate(), checkOut.toLocalDate());
        if (days <= 0) days = 1;

        Double totalAmount = room.getRoomType().getBasePrice() * days;

        Booking booking = new Booking();
        booking.setBookingCode("BK-" + System.currentTimeMillis() % 1000000);
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        booking.setStatus(initialStatus != null ? initialStatus : "BOOKED");
        booking.setTotalAmount(totalAmount);
        booking.setNumGuests(request.getNumGuests() != null ? request.getNumGuests() : 1);
        booking.setNotes(request.getNotes());

        // Update room status
        if ("CHECKED_IN".equals(initialStatus)) {
            room.setStatus("OCCUPIED");
        } else if ("BOOKED".equals(initialStatus)) {
            room.setStatus("RESERVED");
        }
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    public Booking checkIn(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus("CHECKED_IN");
        booking.getRoom().setStatus("OCCUPIED");
        roomRepository.save(booking.getRoom());
        return bookingRepository.save(booking);
    }

    public Booking checkOut(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus("CHECKED_OUT");
        booking.getRoom().setStatus("CLEANING");
        roomRepository.save(booking.getRoom());
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
