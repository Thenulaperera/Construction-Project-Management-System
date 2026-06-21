package com.worksitex.repository;

import com.worksitex.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCategory(String category);
    List<Material> findBySupplier(String supplier);
    
    @Query("SELECT m FROM Material m WHERE m.name LIKE %?1% OR m.category LIKE %?1%")
    List<Material> findByNameOrCategoryContaining(String keyword);
}
