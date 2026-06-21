import { NextResponse } from "next/server"

// Mock transactions storage
const transactions = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Material Purchase - Steel",
    amount: -15000,
    type: "expense",
    category: "Materials",
  },
  {
    id: 2,
    date: "2024-01-10",
    description: "Client Payment - Project Alpha",
    amount: 50000,
    type: "income",
    category: "Payment",
  },
  { id: 3, date: "2024-01-08", description: "Equipment Rental", amount: -8000, type: "expense", category: "Equipment" },
  {
    id: 4,
    date: "2024-01-05",
    description: "Labor Costs - Week 1",
    amount: -12000,
    type: "expense",
    category: "Labor",
  },
]

export async function GET() {
  try {
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const transactionData = await request.json()

    const newTransaction = {
      ...transactionData,
      id: Date.now(), // Simple ID generation
    }

    transactions.unshift(newTransaction)

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
