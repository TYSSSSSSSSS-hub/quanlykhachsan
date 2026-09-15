package com.hotel.management.repository;

import com.hotel.management.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByPosition(String position);
    List<Staff> findByStatus(String status);
}
