package com.worksitex.repository;

import com.worksitex.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByStatus(String status);
    List<Equipment> findByType(String type);
    List<Equipment> findByLocation(String location);
    List<Equipment> findByProjectId(Long projectId);
    
    @Query("SELECT e FROM Equipment e WHERE e.name LIKE %?1% OR e.type LIKE %?1%")
    List<Equipment> findByNameOrTypeContaining(String keyword);
}
