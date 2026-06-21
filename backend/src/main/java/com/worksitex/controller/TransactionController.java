package com.worksitex.controller;

import com.worksitex.model.Transaction;
import com.worksitex.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(transaction -> ResponseEntity.ok().body(transaction))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Transaction createTransaction(@Valid @RequestBody Transaction transaction) {
        return transactionService.createTransaction(transaction);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @Valid @RequestBody Transaction transactionDetails) {
        try {
            Transaction updatedTransaction = transactionService.updateTransaction(id, transactionDetails);
            return ResponseEntity.ok(updatedTransaction);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/type/{type}")
    public List<Transaction> getTransactionsByType(@PathVariable String type) {
        return transactionService.getTransactionsByType(type);
    }
    
    @GetMapping("/project/{projectId}")
    public List<Transaction> getTransactionsByProject(@PathVariable Long projectId) {
        return transactionService.getTransactionsByProject(projectId);
    }
    
    @GetMapping("/stats/income")
    public ResponseEntity<BigDecimal> getTotalIncome() {
        return ResponseEntity.ok(transactionService.getTotalIncome());
    }
    
    @GetMapping("/stats/expenses")
    public ResponseEntity<BigDecimal> getTotalExpenses() {
        return ResponseEntity.ok(transactionService.getTotalExpenses());
    }
    
    @GetMapping("/stats/expenses/project/{projectId}")
    public ResponseEntity<BigDecimal> getTotalExpensesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(transactionService.getTotalExpensesByProject(projectId));
    }
}
