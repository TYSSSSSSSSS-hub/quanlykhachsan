package com.hotel.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String invoiceNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    private Double roomCharge;
    private Double serviceCharge;
    private Double taxAmount;
    private Double damageCharge = 0.0;
    private String damageDescription;
    private Double depositAmount = 0.0;
    private Double totalAmount;

    @Column(nullable = false)
    private String status; // DRAFT, PAID, CANCELLED

    private String paymentMethod; // CASH, CREDIT_CARD, BANK_TRANSFER
    private LocalDateTime createdAt;
    private String notes;

    public Invoice() {}

    public Invoice(Long id, String invoiceNumber, Booking booking, Double roomCharge, Double serviceCharge, Double taxAmount, Double damageCharge, String damageDescription, Double depositAmount, Double totalAmount, String status, String paymentMethod, LocalDateTime createdAt, String notes) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.booking = booking;
        this.roomCharge = roomCharge;
        this.serviceCharge = serviceCharge;
        this.taxAmount = taxAmount;
        this.damageCharge = damageCharge;
        this.damageDescription = damageDescription;
        this.depositAmount = depositAmount;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.createdAt = createdAt;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Double getRoomCharge() { return roomCharge; }
    public void setRoomCharge(Double roomCharge) { this.roomCharge = roomCharge; }

    public Double getServiceCharge() { return serviceCharge; }
    public void setServiceCharge(Double serviceCharge) { this.serviceCharge = serviceCharge; }

    public Double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(Double taxAmount) { this.taxAmount = taxAmount; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Double getDamageCharge() { return damageCharge; }
    public void setDamageCharge(Double damageCharge) { this.damageCharge = damageCharge; }

    public String getDamageDescription() { return damageDescription; }
    public void setDamageDescription(String damageDescription) { this.damageDescription = damageDescription; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
