package com.hotel.management.controller;

import com.hotel.management.dto.BookingRequest;
import com.hotel.management.entity.Booking;
import com.hotel.management.service.HotelBookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final HotelBookingService bookingService;

    public BookingController(HotelBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request, "BOOKED"));
    }

    @PostMapping("/walk-in")
    public ResponseEntity<Booking> walkInCheckIn(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request, "CHECKED_IN"));
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<Booking> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkIn(id));
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<Booking> checkOut(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkOut(id));
    }

    @PostMapping("/{id}/transfer-room")
    public ResponseEntity<Booking> transferRoom(@PathVariable Long id, @RequestBody com.hotel.management.dto.RoomTransferRequest request) {
        return ResponseEntity.ok(bookingService.transferRoom(id, request));
    }
}
