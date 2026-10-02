package com.hotel.management.repository;

import com.hotel.management.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findByStatus(String status);
    List<Booking> findByRoomIdAndStatus(Long roomId, String status);
    Optional<Booking> findFirstByRoomIdAndStatusInOrderByIdDesc(Long roomId, List<String> statuses);
    List<Booking> findByGuestId(Long guestId);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status IN :activeStatuses AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookings(@Param("roomId") Long roomId, 
                                         @Param("checkInDate") LocalDateTime checkInDate, 
                                         @Param("checkOutDate") LocalDateTime checkOutDate, 
                                         @Param("activeStatuses") List<String> activeStatuses);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.id <> :excludeBookingId AND b.status IN :activeStatuses AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookingsExcludingId(@Param("roomId") Long roomId, 
                                                   @Param("excludeBookingId") Long excludeBookingId, 
                                                   @Param("checkInDate") LocalDateTime checkInDate, 
                                                   @Param("checkOutDate") LocalDateTime checkOutDate, 
                                                   @Param("activeStatuses") List<String> activeStatuses);
}

