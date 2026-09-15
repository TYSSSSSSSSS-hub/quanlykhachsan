package com.hotel.management.service;

import com.hotel.management.dto.ServiceOrderRequest;
import com.hotel.management.entity.Booking;
import com.hotel.management.entity.BookingService;
import com.hotel.management.entity.Service;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.BookingServiceRepository;
import com.hotel.management.repository.ServiceRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class HotelServiceService {

    private final ServiceRepository serviceRepository;
    private final BookingServiceRepository bookingServiceRepository;
    private final BookingRepository bookingRepository;

    public HotelServiceService(ServiceRepository serviceRepository, BookingServiceRepository bookingServiceRepository, BookingRepository bookingRepository) {
        this.serviceRepository = serviceRepository;
        this.bookingServiceRepository = bookingServiceRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public Service saveService(Service service) {
        return serviceRepository.save(service);
    }

    public BookingService addServiceToBooking(ServiceOrderRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt phòng"));
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

        int qty = request.getQuantity() != null ? request.getQuantity() : 1;
        double totalPrice = service.getPrice() * qty;

        BookingService bookingService = new BookingService();
        bookingService.setBooking(booking);
        bookingService.setService(service);
        bookingService.setQuantity(qty);
        bookingService.setTotalPrice(totalPrice);
        bookingService.setOrderedAt(LocalDateTime.now());

        return bookingServiceRepository.save(bookingService);
    }

    public List<BookingService> getServicesByBookingId(Long bookingId) {
        return bookingServiceRepository.findByBookingId(bookingId);
    }
}
