package com.hotel.management.service;

import com.hotel.management.dto.DashboardStatsDto;
import com.hotel.management.entity.Invoice;
import com.hotel.management.entity.Room;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.GuestRepository;
import com.hotel.management.repository.InvoiceRepository;
import com.hotel.management.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardService(RoomRepository roomRepository, BookingRepository bookingRepository, GuestRepository guestRepository, InvoiceRepository invoiceRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.guestRepository = guestRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        List<Room> rooms = roomRepository.findAll();
        long totalRooms = rooms.size();
        long available = rooms.stream().filter(r -> "AVAILABLE".equals(r.getStatus())).count();
        long occupied = rooms.stream().filter(r -> "OCCUPIED".equals(r.getStatus())).count();
        long reserved = rooms.stream().filter(r -> "RESERVED".equals(r.getStatus())).count();
        long cleaning = rooms.stream().filter(r -> "CLEANING".equals(r.getStatus()) || "MAINTENANCE".equals(r.getStatus())).count();

        double occupancyRate = totalRooms > 0 ? ((double) (occupied + reserved) / totalRooms) * 100.0 : 0.0;

        List<Invoice> invoices = invoiceRepository.findAll();
        double totalRevenue = invoices.stream().mapToDouble(Invoice::getTotalAmount).sum();

        long totalBookings = bookingRepository.count();
        long totalGuests = guestRepository.count();

        return new DashboardStatsDto(totalRooms, available, occupied, reserved, cleaning, Math.round(occupancyRate * 10.0) / 10.0, totalRevenue, totalBookings, totalGuests);
    }
}
