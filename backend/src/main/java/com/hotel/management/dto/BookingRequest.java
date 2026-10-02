package com.hotel.management.dto;

import java.time.LocalDateTime;

public class BookingRequest {
    private Long roomId;
    private String guestName;
    private String guestPhone;
    private String guestIdCard;
    private String guestEmail;
    private String guestGender;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private Integer numGuests;
    private Double depositAmount = 0.0;
    private String notes;
    private String status;

    public BookingRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public String getGuestIdCard() { return guestIdCard; }
    public void setGuestIdCard(String guestIdCard) { this.guestIdCard = guestIdCard; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getGuestGender() { return guestGender; }
    public void setGuestGender(String guestGender) { this.guestGender = guestGender; }

    public LocalDateTime getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDateTime checkInDate) { this.checkInDate = checkInDate; }

    public LocalDateTime getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDateTime checkOutDate) { this.checkOutDate = checkOutDate; }

    public Integer getNumGuests() { return numGuests; }
    public void setNumGuests(Integer numGuests) { this.numGuests = numGuests; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
