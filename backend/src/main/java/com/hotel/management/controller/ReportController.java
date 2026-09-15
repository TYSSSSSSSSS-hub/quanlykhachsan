package com.hotel.management.controller;

import com.hotel.management.entity.Invoice;
import com.hotel.management.entity.Room;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.InvoiceRepository;
import com.hotel.management.repository.RoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final InvoiceRepository invoiceRepository;

    public ReportController(RoomRepository roomRepository, BookingRepository bookingRepository, InvoiceRepository invoiceRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getReportSummary() {
        Map<String, Object> report = new HashMap<>();

        List<Room> rooms = roomRepository.findAll();
        long totalRooms = rooms.size();
        long occupied = rooms.stream().filter(r -> "Occupied".equalsIgnoreCase(r.getStatus()) || "OCCUPIED".equalsIgnoreCase(r.getStatus())).count();
        long available = rooms.stream().filter(r -> "Available".equalsIgnoreCase(r.getStatus()) || "AVAILABLE".equalsIgnoreCase(r.getStatus())).count();
        long cleaning = rooms.stream().filter(r -> "Cleaning".equalsIgnoreCase(r.getStatus()) || "CLEANING".equalsIgnoreCase(r.getStatus())).count();
        long maintenance = rooms.stream().filter(r -> "Maintenance".equalsIgnoreCase(r.getStatus()) || "MAINTENANCE".equalsIgnoreCase(r.getStatus())).count();

        double occupancyRate = totalRooms > 0 ? ((double) occupied / totalRooms) * 100.0 : 0.0;

        List<Invoice> invoices = invoiceRepository.findAll();
        double totalRevenue = invoices.stream().mapToDouble(Invoice::getTotalAmount).sum();
        double roomRevenue = invoices.stream().mapToDouble(Invoice::getRoomCharge).sum();
        double serviceRevenue = invoices.stream().mapToDouble(Invoice::getServiceCharge).sum();

        report.put("totalRooms", totalRooms);
        report.put("occupied", occupied);
        report.put("available", available);
        report.put("cleaning", cleaning);
        report.put("maintenance", maintenance);
        report.put("occupancyRate", Math.round(occupancyRate * 10.0) / 10.0);
        report.put("totalRevenue", totalRevenue);
        report.put("roomRevenue", roomRevenue);
        report.put("serviceRevenue", serviceRevenue);
        report.put("totalBookings", bookingRepository.count());

        // Weekly revenue mock trajectory matching UI
        report.put("weeklyRevenue", List.of(
            Map.<String, Object>of("day", "T2", "revenue", 12500000L),
            Map.<String, Object>of("day", "T3", "revenue", 14200000L),
            Map.<String, Object>of("day", "T4", "revenue", 18500000L),
            Map.<String, Object>of("day", "T5", "revenue", 11000000L),
            Map.<String, Object>of("day", "T6", "revenue", 16800000L),
            Map.<String, Object>of("day", "T7", "revenue", 22400000L),
            Map.<String, Object>of("day", "CN", "revenue", 19200000L)
        ));

        return ResponseEntity.ok(report);
    }
}
