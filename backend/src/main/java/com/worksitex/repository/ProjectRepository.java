package com.worksitex.repository;

import com.worksitex.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(String status);
    List<Project> findByManager(String manager);
    
    @Query("SELECT p FROM Project p WHERE p.name LIKE %?1% OR p.description LIKE %?1%")
    List<Project> findByNameOrDescriptionContaining(String keyword);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = 'Active'")
    Long countActiveProjects();
}
