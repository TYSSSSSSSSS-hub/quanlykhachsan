package com.hotel.management.repository;

import com.hotel.management.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findByStatus(String status);
    List<Booking> findByRoomIdAndStatus(Long roomId, String status);
    Optional<Booking> findFirstByRoomIdAndStatusInOrderByIdDesc(Long roomId, List<String> statuses);
    List<Booking> findByGuestId(Long guestId);
}
