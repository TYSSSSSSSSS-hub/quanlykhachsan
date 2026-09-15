package com.hotel.management.dto;

public class RoomTransferRequest {
    private Long oldRoomId;
    private Long newRoomId;
    private Integer newNumGuests;
    private String reason;
    private String notes;

    public RoomTransferRequest() {}

    public RoomTransferRequest(Long oldRoomId, Long newRoomId, Integer newNumGuests, String reason, String notes) {
        this.oldRoomId = oldRoomId;
        this.newRoomId = newRoomId;
        this.newNumGuests = newNumGuests;
        this.reason = reason;
        this.notes = notes;
    }

    public Long getOldRoomId() { return oldRoomId; }
    public void setOldRoomId(Long oldRoomId) { this.oldRoomId = oldRoomId; }

    public Long getNewRoomId() { return newRoomId; }
    public void setNewRoomId(Long newRoomId) { this.newRoomId = newRoomId; }

    public Integer getNewNumGuests() { return newNumGuests; }
    public void setNewNumGuests(Integer newNumGuests) { this.newNumGuests = newNumGuests; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
