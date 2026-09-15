package com.hotel.management.repository;

import com.hotel.management.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumber(String roomNumber);
    List<Room> findByStatus(String status);
    List<Room> findByFloor(Integer floor);
    List<Room> findByRoomTypeId(Long roomTypeId);
}
