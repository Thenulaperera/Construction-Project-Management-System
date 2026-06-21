package com.worksitex.controller;

import com.worksitex.service.ProjectService;
import com.worksitex.service.WorkerService;
import com.worksitex.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private WorkerService workerService;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Project stats
        Long activeProjects = projectService.getActiveProjectsCount();
        stats.put("activeProjects", activeProjects != null ? activeProjects : 0);
        
        // Worker stats
        Long assignedWorkers = workerService.getAssignedWorkersCount();
        stats.put("totalWorkers", assignedWorkers != null ? assignedWorkers : 0);
        
        // Financial stats
        BigDecimal totalIncome = transactionRepository.getTotalIncome();
        BigDecimal totalExpenses = transactionRepository.getTotalExpenses();
        stats.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        stats.put("totalExpenses", totalExpenses != null ? totalExpenses.abs() : BigDecimal.ZERO);
        
        // Safety incidents (mock data for now)
        stats.put("safetyIncidents", 3);
        
        return ResponseEntity.ok(stats);
    }
}
