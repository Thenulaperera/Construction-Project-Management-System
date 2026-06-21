package com.worksitex.service;

import com.worksitex.model.Worker;
import com.worksitex.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class WorkerService {
    
    @Autowired
    private WorkerRepository workerRepository;
    
    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }
    
    public Optional<Worker> getWorkerById(Long id) {
        return workerRepository.findById(id);
    }
    
    public Worker createWorker(Worker worker) {
        return workerRepository.save(worker);
    }
    
    public Worker updateWorker(Long id, Worker workerDetails) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found with id: " + id));
        
        worker.setName(workerDetails.getName());
        worker.setRole(workerDetails.getRole());
        worker.setStatus(workerDetails.getStatus());
        worker.setHourlyRate(workerDetails.getHourlyRate());
        worker.setPhone(workerDetails.getPhone());
        worker.setEmail(workerDetails.getEmail());
        worker.setProject(workerDetails.getProject());
        
        return workerRepository.save(worker);
    }
    
    public void deleteWorker(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found with id: " + id));
        workerRepository.delete(worker);
    }
    
    public List<Worker> getWorkersByStatus(String status) {
        return workerRepository.findByStatus(status);
    }
    
    public List<Worker> getWorkersByProject(Long projectId) {
        return workerRepository.findByProjectId(projectId);
    }
    
    public List<Worker> searchWorkers(String keyword) {
        return workerRepository.findByNameOrRoleContaining(keyword);
    }
    
    public Long getAssignedWorkersCount() {
        return workerRepository.countAssignedWorkers();
    }
}
