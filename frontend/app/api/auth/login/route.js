import { NextResponse } from "next/server"

// Mock user data - replace with actual database
const users = [
  {
    id: 1,
    email: "admin@worksitex.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: 2,
    email: "client@example.com",
    password: "client123",
    name: "John Client",
    role: "client",
  },
]

export async function POST(request) {
  try {
    const { email, password, role } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password && u.role === role)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Generate simple token (use JWT in production)
    const token = `token_${user.id}_${Date.now()}`

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: "Login successful",
    })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
