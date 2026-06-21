package com.worksitex.controller;

import com.worksitex.model.Equipment;
import com.worksitex.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/equipment")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EquipmentController {
    
    @Autowired
    private EquipmentService equipmentService;
    
    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentService.getAllEquipment();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id)
                .map(equipment -> ResponseEntity.ok().body(equipment))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Equipment createEquipment(@Valid @RequestBody Equipment equipment) {
        return equipmentService.createEquipment(equipment);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Long id, @Valid @RequestBody Equipment equipmentDetails) {
        try {
            Equipment updatedEquipment = equipmentService.updateEquipment(id, equipmentDetails);
            return ResponseEntity.ok(updatedEquipment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(@PathVariable Long id) {
        try {
            equipmentService.deleteEquipment(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public List<Equipment> getEquipmentByStatus(@PathVariable String status) {
        return equipmentService.getEquipmentByStatus(status);
    }
    
    @GetMapping("/project/{projectId}")
    public List<Equipment> getEquipmentByProject(@PathVariable Long projectId) {
        return equipmentService.getEquipmentByProject(projectId);
    }
    
    @GetMapping("/search")
    public List<Equipment> searchEquipment(@RequestParam String keyword) {
        return equipmentService.searchEquipment(keyword);
    }
}
