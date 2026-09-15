package com.hotel.management.dto;

public class DashboardStatsDto {
    private Long totalRooms;
    private Long availableRooms;
    private Long occupiedRooms;
    private Long reservedRooms;
    private Long cleaningRooms;
    private Double occupancyRate;
    private Double totalRevenue;
    private Long totalBookings;
    private Long totalGuests;

    public DashboardStatsDto() {}

    public DashboardStatsDto(Long totalRooms, Long availableRooms, Long occupiedRooms, Long reservedRooms, Long cleaningRooms, Double occupancyRate, Double totalRevenue, Long totalBookings, Long totalGuests) {
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.occupiedRooms = occupiedRooms;
        this.reservedRooms = reservedRooms;
        this.cleaningRooms = cleaningRooms;
        this.occupancyRate = occupancyRate;
        this.totalRevenue = totalRevenue;
        this.totalBookings = totalBookings;
        this.totalGuests = totalGuests;
    }

    public Long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Long totalRooms) { this.totalRooms = totalRooms; }

    public Long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(Long availableRooms) { this.availableRooms = availableRooms; }

    public Long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(Long occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public Long getReservedRooms() { return reservedRooms; }
    public void setReservedRooms(Long reservedRooms) { this.reservedRooms = reservedRooms; }

    public Long getCleaningRooms() { return cleaningRooms; }
    public void setCleaningRooms(Long cleaningRooms) { this.cleaningRooms = cleaningRooms; }

    public Double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Double occupancyRate) { this.occupancyRate = occupancyRate; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public Long getTotalGuests() { return totalGuests; }
    public void setTotalGuests(Long totalGuests) { this.totalGuests = totalGuests; }
}
