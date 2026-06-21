package com.worksitex.controller;

import com.worksitex.model.Worker;
import com.worksitex.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/workers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WorkerController {
    
    @Autowired
    private WorkerService workerService;
    
    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerService.getAllWorkers();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable Long id) {
        return workerService.getWorkerById(id)
                .map(worker -> ResponseEntity.ok().body(worker))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Worker createWorker(@Valid @RequestBody Worker worker) {
        return workerService.createWorker(worker);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(@PathVariable Long id, @Valid @RequestBody Worker workerDetails) {
        try {
            Worker updatedWorker = workerService.updateWorker(id, workerDetails);
            return ResponseEntity.ok(updatedWorker);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorker(@PathVariable Long id) {
        try {
            workerService.deleteWorker(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public List<Worker> getWorkersByStatus(@PathVariable String status) {
        return workerService.getWorkersByStatus(status);
    }
    
    @GetMapping("/project/{projectId}")
    public List<Worker> getWorkersByProject(@PathVariable Long projectId) {
        return workerService.getWorkersByProject(projectId);
    }
    
    @GetMapping("/search")
    public List<Worker> searchWorkers(@RequestParam String keyword) {
        return workerService.searchWorkers(keyword);
    }
    
    @GetMapping("/stats/assigned-count")
    public ResponseEntity<Long> getAssignedWorkersCount() {
        return ResponseEntity.ok(workerService.getAssignedWorkersCount());
    }
}
