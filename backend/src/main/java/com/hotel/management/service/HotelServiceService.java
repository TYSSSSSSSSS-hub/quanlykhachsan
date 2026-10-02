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
        if (service.getIsActive() == null) {
            service.setIsActive(true);
        }
        return serviceRepository.save(service);
    }

    public Service updateService(Long id, Service updated) {
        Service existing = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ: " + id));
        existing.setName(updated.getName());
        if (updated.getPrice() != null) {
            existing.setPrice(updated.getPrice());
        }
        if (updated.getCategory() != null) {
            existing.setCategory(updated.getCategory());
        }
        existing.setDescription(updated.getDescription());
        if (updated.getIsActive() != null) {
            existing.setIsActive(updated.getIsActive());
        }
        return serviceRepository.save(existing);
    }

    public Service toggleServiceStatus(Long id) {
        Service existing = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ: " + id));
        existing.setIsActive(!existing.getIsActive());
        return serviceRepository.save(existing);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    public BookingService addServiceToBooking(ServiceOrderRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Thông tin đặt dịch vụ không được để trống.");
        }
        if (request.getBookingId() == null) {
            throw new IllegalArgumentException("Mã đơn đặt phòng không được để trống.");
        }
        if (request.getServiceId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn dịch vụ cần đặt.");
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt phòng: " + request.getBookingId()));

        if (!"CHECKED_IN".equalsIgnoreCase(booking.getStatus()) && !"Checked-in".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException("Chỉ có thể gọi dịch vụ cho phòng đang có khách ở (Trạng thái: CHECKED_IN). Trạng thái hiện tại: " + booking.getStatus());
        }

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ: " + request.getServiceId()));

        if (service.getIsActive() != null && !service.getIsActive()) {
            throw new IllegalStateException("Dịch vụ '" + service.getName() + "' hiện đang tạm ngưng phục vụ.");
        }

        int qty = request.getQuantity() != null ? request.getQuantity() : 1;
        if (qty <= 0) {
            throw new IllegalArgumentException("Số lượng dịch vụ phải lớn hơn 0.");
        }

        double price = service.getPrice() != null ? service.getPrice() : 0.0;
        double totalPrice = price * qty;

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

    public List<BookingService> getAllOrders() {
        return bookingServiceRepository.findAllByOrderByIdDesc();
    }
}
