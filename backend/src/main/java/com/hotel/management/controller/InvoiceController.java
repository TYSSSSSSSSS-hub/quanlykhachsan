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
    public ResponseEntity<Invoice> generateInvoice(@PathVariable Long bookingId, @RequestBody(required = false) java.util.Map<String, Object> body) {
        Double damageCharge = 0.0;
        String damageDescription = null;
        String paymentMethod = "CASH";
        Double depositAmount = 0.0;

        if (body != null) {
            if (body.containsKey("damageCharge") && body.get("damageCharge") instanceof Number) {
                damageCharge = ((Number) body.get("damageCharge")).doubleValue();
            }
            if (body.containsKey("damageDescription")) {
                damageDescription = (String) body.get("damageDescription");
            }
            if (body.containsKey("paymentMethod") && body.get("paymentMethod") != null) {
                paymentMethod = (String) body.get("paymentMethod");
            }
            if (body.containsKey("depositAmount") && body.get("depositAmount") instanceof Number) {
                depositAmount = ((Number) body.get("depositAmount")).doubleValue();
            }
        }

        return ResponseEntity.ok(invoiceService.generateInvoiceForBookingWithDetails(bookingId, damageCharge, damageDescription, paymentMethod, depositAmount));
    }
}
