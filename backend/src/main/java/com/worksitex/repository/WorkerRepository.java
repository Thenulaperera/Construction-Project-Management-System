package com.worksitex.repository;

import com.worksitex.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByStatus(String status);
    List<Worker> findByRole(String role);
    List<Worker> findByProjectId(Long projectId);
    
    @Query("SELECT COUNT(w) FROM Worker w WHERE w.status = 'Assigned'")
    Long countAssignedWorkers();
    
    @Query("SELECT w FROM Worker w WHERE w.name LIKE %?1% OR w.role LIKE %?1%")
    List<Worker> findByNameOrRoleContaining(String keyword);
}
