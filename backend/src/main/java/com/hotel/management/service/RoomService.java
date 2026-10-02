package com.hotel.management.service;

import com.hotel.management.entity.Room;
import com.hotel.management.entity.RoomType;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    public RoomService(RoomRepository roomRepository, RoomTypeRepository roomTypeRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + id));
    }

    public Room updateRoomStatus(Long id, String status) {
        Room room = getRoomById(id);
        room.setStatus(status);
        return roomRepository.save(room);
    }

    public Room reportIncident(Long id, String incidentReport) {
        Room room = getRoomById(id);
        room.setStatus("MAINTENANCE");
        room.setIncidentReport(incidentReport);
        return roomRepository.save(room);
    }

    public Room clearIncident(Long id) {
        Room room = getRoomById(id);
        room.setStatus("AVAILABLE");
        room.setIncidentReport(null);
        return roomRepository.save(room);
    }

    public Room saveRoom(Room room) {
        if (room.getRoomType() != null && room.getRoomType().getId() != null) {
            RoomType rt = roomTypeRepository.findById(room.getRoomType().getId())
                    .orElse(room.getRoomType());
            room.setRoomType(rt);
        }
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updated) {
        Room existing = getRoomById(id);
        existing.setRoomNumber(updated.getRoomNumber());
        existing.setFloor(updated.getFloor());
        if (updated.getStatus() != null) {
            existing.setStatus(updated.getStatus());
        }
        if (updated.getRoomType() != null && updated.getRoomType().getId() != null) {
            RoomType rt = roomTypeRepository.findById(updated.getRoomType().getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng: " + updated.getRoomType().getId()));
            existing.setRoomType(rt);
        }
        return roomRepository.save(existing);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    public RoomType getRoomTypeById(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng: " + id));
    }

    public RoomType saveRoomType(RoomType roomType) {
        if (roomType.getIsActive() == null) {
            roomType.setIsActive(true);
        }
        return roomTypeRepository.save(roomType);
    }

    public RoomType updateRoomType(Long id, RoomType updated) {
        RoomType existing = getRoomTypeById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        if (updated.getBasePrice() != null) {
            existing.setBasePrice(updated.getBasePrice());
        }
        if (updated.getCapacity() != null) {
            existing.setCapacity(updated.getCapacity());
        }
        if (updated.getAmenities() != null) {
            existing.setAmenities(updated.getAmenities());
        }
        if (updated.getIsActive() != null) {
            existing.setIsActive(updated.getIsActive());
        }
        return roomTypeRepository.save(existing);
    }

    public RoomType toggleRoomTypeStatus(Long id) {
        RoomType existing = getRoomTypeById(id);
        existing.setIsActive(!existing.getIsActive());
        return roomTypeRepository.save(existing);
    }

    public void deleteRoomType(Long id) {
        roomTypeRepository.deleteById(id);
    }
}
