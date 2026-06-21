package com.worksitex.controller;

import com.worksitex.model.Material;
import com.worksitex.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/materials")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MaterialController {
    
    @Autowired
    private MaterialService materialService;
    
    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(@PathVariable Long id) {
        return materialService.getMaterialById(id)
                .map(material -> ResponseEntity.ok().body(material))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Material createMaterial(@Valid @RequestBody Material material) {
        return materialService.createMaterial(material);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(@PathVariable Long id, @Valid @RequestBody Material materialDetails) {
        try {
            Material updatedMaterial = materialService.updateMaterial(id, materialDetails);
            return ResponseEntity.ok(updatedMaterial);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        try {
            materialService.deleteMaterial(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/category/{category}")
    public List<Material> getMaterialsByCategory(@PathVariable String category) {
        return materialService.getMaterialsByCategory(category);
    }
    
    @GetMapping("/search")
    public List<Material> searchMaterials(@RequestParam String keyword) {
        return materialService.searchMaterials(keyword);
    }
}
