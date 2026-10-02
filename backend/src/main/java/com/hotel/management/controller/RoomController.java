package com.hotel.management.controller;

import com.hotel.management.entity.Room;
import com.hotel.management.entity.RoomType;
import com.hotel.management.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(roomService.updateRoomStatus(id, status));
    }

    @PostMapping("/{id}/report-incident")
    public ResponseEntity<Room> reportIncident(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String report = body.get("incidentReport");
        return ResponseEntity.ok(roomService.reportIncident(id, report));
    }

    @PostMapping("/{id}/clear-incident")
    public ResponseEntity<Room> clearIncident(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.clearIncident(id));
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.saveRoom(room));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.updateRoom(id, room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/types")
    public ResponseEntity<List<RoomType>> getAllRoomTypes() {
        return ResponseEntity.ok(roomService.getAllRoomTypes());
    }

    @PostMapping("/types")
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType) {
        return ResponseEntity.ok(roomService.saveRoomType(roomType));
    }

    @PutMapping("/types/{id}")
    public ResponseEntity<RoomType> updateRoomType(@PathVariable Long id, @RequestBody RoomType roomType) {
        return ResponseEntity.ok(roomService.updateRoomType(id, roomType));
    }

    @PatchMapping("/types/{id}/toggle-status")
    public ResponseEntity<RoomType> toggleRoomTypeStatus(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.toggleRoomTypeStatus(id));
    }

    @DeleteMapping("/types/{id}")
    public ResponseEntity<?> deleteRoomType(@PathVariable Long id) {
        roomService.deleteRoomType(id);
        return ResponseEntity.ok().build();
    }
}
