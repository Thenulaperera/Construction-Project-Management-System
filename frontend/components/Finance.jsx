"use client"

import { useState, useEffect } from "react"

const Finance = () => {
  const [activeTab, setActiveTab] = useState("budget")
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "Materials",
    date: new Date().toISOString().split("T")[0],
  })

  const budgetData = [
    { project: "Office Complex", allocated: 500000, spent: 320000, remaining: 180000 },
    { project: "Residential Tower", allocated: 750000, spent: 450000, remaining: 300000 },
    { project: "Shopping Mall", allocated: 1200000, spent: 800000, remaining: 400000 },
  ]

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/transactions")
        if (!res.ok) throw new Error("Failed to fetch transactions")
        const data = await res.json()
        setTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      }
    }
    fetchTransactions()
  }, [])

  // Add or update transaction
  const handleSubmitTransaction = async (e) => {
    e.preventDefault()
    const transactionData = {
      ...newTransaction,
      amount:
        Number.parseFloat(newTransaction.amount) *
        (newTransaction.type === "expense" ? -1 : 1),
    }

    try {
      let url = "http://localhost:8080/api/transactions"
      let method = "POST"

      if (editingTransaction) {
        url = `http://localhost:8080/api/transactions/${editingTransaction.id}`
        method = "PUT"
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      })

      if (!res.ok) throw new Error("Failed to save transaction")
      const savedTransaction = await res.json()

      if (editingTransaction) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === savedTransaction.id ? savedTransaction : t))
        )
      } else {
        setTransactions((prev) => [savedTransaction, ...prev])
      }

      handleCloseModal()
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  // Delete transaction
  const handleDeleteTransaction = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return
    try {
      const res = await fetch(`http://localhost:8080/api/transactions/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete transaction")
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  // Open edit modal safely
  const handleEditTransaction = (transaction) => {
    const safeDate =
      transaction.date && transaction.date.includes("T")
        ? transaction.date.split("T")[0]
        : new Date().toISOString().split("T")[0]

    setEditingTransaction(transaction)
    setNewTransaction({
      description: transaction.description || "",
      amount: Math.abs(transaction.amount || 0),
      type: transaction.amount > 0 ? "income" : "expense",
      category: transaction.category || "Materials",
      date: safeDate,
    })
    setShowTransactionModal(true)
  }

  // Reset form & close modal
  const handleCloseModal = () => {
    setShowTransactionModal(false)
    setEditingTransaction(null)
    setNewTransaction({
      description: "",
      amount: "",
      type: "expense",
      category: "Materials",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTransaction((prev) => ({ ...prev, [name]: value }))
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)

  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const netProfit = totalIncome - totalExpenses

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Finance Management</h1>
        <button
          onClick={() => setShowTransactionModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div
          className={`p-6 rounded-lg border ${
            netProfit >= 0
              ? "bg-blue-50 border-blue-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${
              netProfit >= 0 ? "text-blue-800" : "text-orange-800"
            }`}
          >
            Net Profit
          </h3>
          <p
            className={`text-2xl font-bold ${
              netProfit >= 0 ? "text-blue-600" : "text-orange-600"
            }`}
          >
            {formatCurrency(netProfit)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("budget")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "budget"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Budget Overview
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "transactions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Transactions
          </button>
        </nav>
      </div>

      {/* Budget Overview */}
      {activeTab === "budget" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Allocated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Remaining
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetData.map((b, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-sm text-gray-900">{b.project}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(b.allocated)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(b.spent)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(b.remaining)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transactions Table */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((t) => (
                <tr key={t.id}>
                  
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {t.category}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${
                      t.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(t.amount))}
                  </td>
                  <td>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        t.amount > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.amount > 0 ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditTransaction(t)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(t.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </h3>
            <form onSubmit={handleSubmitTransaction}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={newTransaction.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Materials">Materials</option>
                  <option value="Labor">Labor</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Payment">Payment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingTransaction ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Finance
