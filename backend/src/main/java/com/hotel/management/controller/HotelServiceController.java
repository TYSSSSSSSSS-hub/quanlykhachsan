package com.hotel.management.controller;

import com.hotel.management.dto.ServiceOrderRequest;
import com.hotel.management.entity.BookingService;
import com.hotel.management.entity.Service;
import com.hotel.management.service.HotelServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class HotelServiceController {

    private final HotelServiceService hotelServiceService;

    public HotelServiceController(HotelServiceService hotelServiceService) {
        this.hotelServiceService = hotelServiceService;
    }

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(hotelServiceService.getAllServices());
    }

    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return ResponseEntity.ok(hotelServiceService.saveService(service));
    }

    @PostMapping("/order")
    public ResponseEntity<BookingService> addServiceToBooking(@RequestBody ServiceOrderRequest request) {
        return ResponseEntity.ok(hotelServiceService.addServiceToBooking(request));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingService>> getServicesByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(hotelServiceService.getServicesByBookingId(bookingId));
    }
}
