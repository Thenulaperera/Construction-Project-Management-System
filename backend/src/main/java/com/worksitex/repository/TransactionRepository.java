package com.worksitex.repository;

import com.worksitex.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByType(String type);
    List<Transaction> findByCategory(String category);
    List<Transaction> findByProjectId(Long projectId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'income'")
    BigDecimal getTotalIncome();
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'expense'")
    BigDecimal getTotalExpenses();
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.project.id = ?1 AND t.type = 'expense'")
    BigDecimal getTotalExpensesByProject(Long projectId);
}
