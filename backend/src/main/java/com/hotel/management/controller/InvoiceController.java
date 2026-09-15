package com.hotel.management.controller;

import com.hotel.management.entity.Invoice;
import com.hotel.management.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Invoice> getInvoiceByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByBookingId(bookingId));
    }

    @PostMapping("/generate/{bookingId}")
    public ResponseEntity<Invoice> generateInvoice(@PathVariable Long bookingId) {
        return ResponseEntity.ok(invoiceService.generateInvoiceForBooking(bookingId));
    }
}
