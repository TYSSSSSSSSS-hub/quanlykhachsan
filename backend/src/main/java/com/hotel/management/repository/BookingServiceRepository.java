package com.hotel.management.repository;

import com.hotel.management.entity.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingServiceRepository extends JpaRepository<BookingService, Long> {
    List<BookingService> findByBookingId(Long bookingId);
    List<BookingService> findAllByOrderByIdDesc();
}
