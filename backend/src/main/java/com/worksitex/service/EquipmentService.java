package com.worksitex.service;

import com.worksitex.model.Equipment;
import com.worksitex.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {
    
    @Autowired
    private EquipmentRepository equipmentRepository;
    
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }
    
    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }
    
    public Equipment createEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }
    
    public Equipment updateEquipment(Long id, Equipment equipmentDetails) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));
        
        equipment.setName(equipmentDetails.getName());
        equipment.setType(equipmentDetails.getType());
        equipment.setLocation(equipmentDetails.getLocation());
        equipment.setStatus(equipmentDetails.getStatus());
        equipment.setDailyRate(equipmentDetails.getDailyRate());
        equipment.setProject(equipmentDetails.getProject());
        
        return equipmentRepository.save(equipment);
    }
    
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));
        equipmentRepository.delete(equipment);
    }
    
    public List<Equipment> getEquipmentByStatus(String status) {
        return equipmentRepository.findByStatus(status);
    }
    
    public List<Equipment> getEquipmentByProject(Long projectId) {
        return equipmentRepository.findByProjectId(projectId);
    }
    
    public List<Equipment> searchEquipment(String keyword) {
        return equipmentRepository.findByNameOrTypeContaining(keyword);
    }
}
