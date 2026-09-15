package com.hotel.management.service;

import com.hotel.management.entity.Booking;
import com.hotel.management.entity.BookingService;
import com.hotel.management.entity.Invoice;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.BookingServiceRepository;
import com.hotel.management.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final BookingServiceRepository bookingServiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, BookingRepository bookingRepository, BookingServiceRepository bookingServiceRepository) {
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
        this.bookingServiceRepository = bookingServiceRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceByBookingId(Long bookingId) {
        return invoiceRepository.findByBookingId(bookingId)
                .orElseGet(() -> generateInvoiceForBooking(bookingId));
    }

    public Invoice generateInvoiceForBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt phòng: " + bookingId));

        double roomCharge = booking.getTotalAmount() != null ? booking.getTotalAmount() : 0.0;

        List<BookingService> services = bookingServiceRepository.findByBookingId(bookingId);
        double serviceCharge = services.stream().mapToDouble(BookingService::getTotalPrice).sum();

        double subtotal = roomCharge + serviceCharge;
        double taxAmount = subtotal * 0.1; // 10% VAT
        double grandTotal = subtotal + taxAmount;

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
        invoice.setBooking(booking);
        invoice.setRoomCharge(roomCharge);
        invoice.setServiceCharge(serviceCharge);
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalAmount(grandTotal);
        invoice.setStatus("PAID");
        invoice.setPaymentMethod("CASH");
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setNotes("Hóa đơn đã thanh toán đầy đủ");

        return invoiceRepository.save(invoice);
    }
}
