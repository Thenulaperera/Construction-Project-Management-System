import { NextResponse } from "next/server"

// Mock project data
const projects = [
  {
    id: 1,
    name: "Office Complex Alpha",
    location: "123 Business District",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    status: "In Progress",
    budget: 500000,
    spent: 320000,
    progress: 65,
    contractor: "ABC Construction",
    clientId: 2,
    description: "Modern office complex with 5 floors and underground parking.",
  },
  {
    id: 2,
    name: "Residential Tower Beta",
    location: "456 Downtown Ave",
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    status: "In Progress",
    budget: 750000,
    spent: 450000,
    progress: 45,
    contractor: "XYZ Builders",
    clientId: 2,
    description: "20-story residential tower with luxury amenities.",
  },
]

export async function GET(request, { params }) {
  try {
    const { id } = params
    const project = projects.find((p) => p.id === Number.parseInt(id))

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
