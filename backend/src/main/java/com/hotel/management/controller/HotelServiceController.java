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

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service service) {
        return ResponseEntity.ok(hotelServiceService.updateService(id, service));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Service> toggleServiceStatus(@PathVariable Long id) {
        return ResponseEntity.ok(hotelServiceService.toggleServiceStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        hotelServiceService.deleteService(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/order")
    public ResponseEntity<BookingService> addServiceToBooking(@RequestBody ServiceOrderRequest request) {
        return ResponseEntity.ok(hotelServiceService.addServiceToBooking(request));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingService>> getServicesByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(hotelServiceService.getServicesByBookingId(bookingId));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<BookingService>> getAllOrders() {
        return ResponseEntity.ok(hotelServiceService.getAllOrders());
    }
}
