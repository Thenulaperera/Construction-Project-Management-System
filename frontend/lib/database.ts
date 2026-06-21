// Simple MySQL database connection and query utilities
// This is a simplified version for demonstration purposes

interface DatabaseConfig {
  host: string
  user: string
  password: string
  database: string
  port: number
}

// Mock database configuration - in production, use environment variables
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "worksitex",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

// Mock database connection class
class Database {
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    // In a real implementation, this would connect to MySQL and execute the query
    // For now, we'll return mock data based on the query type

    console.log("[v0] Database query:", sql, params)

    // Mock responses based on query patterns
    if (sql.includes("SELECT * FROM users WHERE email")) {
      return [
        {
          id: "client_001",
          name: "John Client",
          email: params[0],
          password_hash: "$2b$10$hashedpassword",
          role: "client",
        },
      ]
    }

    if (sql.includes("SELECT * FROM projects WHERE client_id")) {
      return [
        {
          id: "PRJ-001",
          name: "Downtown Office Complex",
          status: "in-progress",
          progress: 65,
          start_date: "2024-01-15",
          expected_completion: "2024-08-15",
          budget: 2500000,
          spent: 1625000,
          location: "Downtown District",
          contractor: "BuildCorp Ltd.",
        },
        {
          id: "PRJ-002",
          name: "Residential Tower A",
          status: "planning",
          progress: 15,
          start_date: "2024-03-01",
          expected_completion: "2024-12-01",
          budget: 3200000,
          spent: 480000,
          location: "North Side",
          contractor: "Skyline Construction",
        },
      ]
    }

    if (sql.includes("SELECT * FROM project_milestones WHERE project_id")) {
      return [
        { name: "Foundation", status: "completed", target_date: "2024-02-15" },
        { name: "Structure", status: "in-progress", target_date: "2024-05-15" },
        { name: "Interior", status: "pending", target_date: "2024-07-15" },
        { name: "Finishing", status: "pending", target_date: "2024-08-15" },
      ]
    }

    if (sql.includes("SELECT * FROM transactions")) {
      return [
        {
          id: 1,
          type: "expense",
          description: "Cement and Concrete Materials",
          amount: -25000,
          category: "Materials",
          transaction_date: "2024-01-15",
          project_id: "PRJ-001",
        },
        {
          id: 2,
          type: "income",
          description: "Phase 1 Payment",
          amount: 150000,
          category: "Payment",
          transaction_date: "2024-01-10",
          project_id: "PRJ-001",
        },
      ]
    }

    // For INSERT queries, return success
    if (sql.includes("INSERT INTO")) {
      return [{ insertId: Math.floor(Math.random() * 1000) + 1 }]
    }

    return []
  }

  async close(): Promise<void> {
    console.log("[v0] Database connection closed")
  }
}

// Export singleton instance
export const db = new Database(dbConfig)

// Utility functions for common database operations
export const dbUtils = {
  // User operations
  async getUserByEmail(email: string) {
    const result = await db.query("SELECT * FROM users WHERE email = ?", [email])
    return result[0] || null
  },

  async getUserById(id: string) {
    const result = await db.query("SELECT * FROM users WHERE id = ?", [id])
    return result[0] || null
  },

  // Project operations
  async getProjectsByClientId(clientId: string) {
    return await db.query("SELECT * FROM projects WHERE client_id = ?", [clientId])
  },

  async getProjectById(projectId: string) {
    const result = await db.query("SELECT * FROM projects WHERE id = ?", [projectId])
    return result[0] || null
  },

  async getProjectMilestones(projectId: string) {
    return await db.query("SELECT * FROM project_milestones WHERE project_id = ? ORDER BY target_date", [projectId])
  },

  // Transaction operations
  async getTransactionsByProject(projectId: string) {
    return await db.query("SELECT * FROM transactions WHERE project_id = ? ORDER BY transaction_date DESC", [projectId])
  },

  async getAllTransactions() {
    return await db.query(
      "SELECT t.*, p.name as project_name FROM transactions t JOIN projects p ON t.project_id = p.id ORDER BY t.transaction_date DESC",
    )
  },

  async addTransaction(transaction: {
    project_id: string
    type: "income" | "expense"
    description: string
    amount: number
    category: string
    transaction_date: string
    created_by: string
  }) {
    const sql = `
      INSERT INTO transactions (project_id, type, description, amount, category, transaction_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      transaction.project_id,
      transaction.type,
      transaction.description,
      transaction.amount,
      transaction.category,
      transaction.transaction_date,
      transaction.created_by,
    ]
    return await db.query(sql, params)
  },
}
