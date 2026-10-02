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

    /**
     * Customer-portal endpoint: returns only the bookings that belong to the
     * guest identified by the provided phone and/or email query parameters.
     * Example: GET /api/bookings/my?phone=0988776655&email=user@example.com
     */
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email) {
        return ResponseEntity.ok(bookingService.getBookingsByGuestContact(phone, email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        String status = (request != null && request.getStatus() != null && !request.getStatus().trim().isEmpty())
                ? request.getStatus().trim().toUpperCase() : "PENDING";
        return ResponseEntity.ok(bookingService.createBooking(request, status));
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

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, @RequestBody(required = false) java.util.Map<String, Object> body) {
        String reason = body != null && body.containsKey("reason") ? (String) body.get("reason") : "Hủy theo yêu cầu";
        Double refundAmount = 0.0;
        if (body != null && body.containsKey("refundAmount")) {
            Object r = body.get("refundAmount");
            if (r instanceof Number) {
                refundAmount = ((Number) r).doubleValue();
            }
        }
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason, refundAmount));
    }

    @PostMapping("/{id}/no-show")
    public ResponseEntity<Booking> noShowBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.noShowBooking(id));
    }

    @PostMapping("/{id}/update-duration")
    public ResponseEntity<Booking> updateStayDuration(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        java.time.LocalDateTime checkIn = body.containsKey("checkInDate") && body.get("checkInDate") != null 
                ? java.time.LocalDateTime.parse(body.get("checkInDate")) : null;
        java.time.LocalDateTime checkOut = body.containsKey("checkOutDate") && body.get("checkOutDate") != null 
                ? java.time.LocalDateTime.parse(body.get("checkOutDate")) : null;
        return ResponseEntity.ok(bookingService.updateStayDuration(id, checkIn, checkOut));
    }

    @PostMapping("/{id}/transfer-room")
    public ResponseEntity<Booking> transferRoom(@PathVariable Long id, @RequestBody com.hotel.management.dto.RoomTransferRequest request) {
        return ResponseEntity.ok(bookingService.transferRoom(id, request));
    }
}
