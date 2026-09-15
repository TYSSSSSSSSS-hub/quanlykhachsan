package com.hotel.management.repository;

import com.hotel.management.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    Optional<Guest> findByPhone(String phone);
    Optional<Guest> findByIdCard(String idCard);
    List<Guest> findByFullNameContainingIgnoreCase(String name);
}
