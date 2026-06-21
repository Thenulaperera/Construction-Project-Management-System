package com.worksitex.service;

import com.worksitex.model.Material;
import com.worksitex.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {
    
    @Autowired
    private MaterialRepository materialRepository;
    
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }
    
    public Optional<Material> getMaterialById(Long id) {
        return materialRepository.findById(id);
    }
    
    public Material createMaterial(Material material) {
        return materialRepository.save(material);
    }
    
    public Material updateMaterial(Long id, Material materialDetails) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        
        material.setName(materialDetails.getName());
        material.setCategory(materialDetails.getCategory());
        material.setQuantity(materialDetails.getQuantity());
        material.setUnit(materialDetails.getUnit());
        material.setCost(materialDetails.getCost());
        material.setSupplier(materialDetails.getSupplier());
        
        return materialRepository.save(material);
    }
    
    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        materialRepository.delete(material);
    }
    
    public List<Material> getMaterialsByCategory(String category) {
        return materialRepository.findByCategory(category);
    }
    
    public List<Material> searchMaterials(String keyword) {
        return materialRepository.findByNameOrCategoryContaining(keyword);
    }
}
