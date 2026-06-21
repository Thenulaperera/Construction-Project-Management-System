package com.worksitex.service;

import com.worksitex.model.Transaction;
import com.worksitex.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }
    
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    
    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        
        transaction.setType(transactionDetails.getType());
        transaction.setDescription(transactionDetails.getDescription());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setTransactionDate(transactionDetails.getTransactionDate());
        transaction.setProject(transactionDetails.getProject());
        
        return transactionRepository.save(transaction);
    }
    
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        transactionRepository.delete(transaction);
    }
    
    public List<Transaction> getTransactionsByType(String type) {
        return transactionRepository.findByType(type);
    }
    
    public List<Transaction> getTransactionsByProject(Long projectId) {
        return transactionRepository.findByProjectId(projectId);
    }
    
    public BigDecimal getTotalIncome() {
        return transactionRepository.getTotalIncome();
    }
    
    public BigDecimal getTotalExpenses() {
        return transactionRepository.getTotalExpenses();
    }
    
    public BigDecimal getTotalExpensesByProject(Long projectId) {
        return transactionRepository.getTotalExpensesByProject(projectId);
    }
}
