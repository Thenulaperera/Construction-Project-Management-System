"use client"

import { useEffect, useState } from "react"
import {
  Building2,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Active Projects", value: "12", icon: Building2, color: "bg-blue-500" },
    { label: "Total Workers", value: "148", icon: Users, color: "bg-green-500" },
    { label: "Monthly Budget", value: "LKR2.4M", icon: DollarSign, color: "bg-purple-500" },
    { label: "Safety Incidents", value: "3", icon: AlertTriangle, color: "bg-red-500" },
  ])

  const [recentProjects, setRecentProjects] = useState([
    { id: 1, name: "Downtown Office Complex", progress: 75, status: "On Track", dueDate: "2024-08-15" },
    { id: 2, name: "Residential Tower A", progress: 45, status: "Delayed", dueDate: "2024-09-30" },
    { id: 3, name: "Shopping Center Phase 2", progress: 90, status: "On Track", dueDate: "2024-07-10" },
    { id: 4, name: "Highway Bridge Repair", progress: 60, status: "On Track", dueDate: "2024-08-25" },
  ])

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/users")
        if (!response.ok) throw new Error("Failed to fetch users")
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleEditUser = (user) => {
    alert(`Edit user: ${user.firstName} ${user.lastName}`)
    // TODO: open modal for editing user info
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      const response = await fetch(`http://localhost:8080/api/auth/users/${userId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete user")
      setUsers(users.filter((u) => u.id !== userId))
    } catch (err) {
      alert(err.message)
    }
  }

  const getStatusIcon = (status) => (status === "On Track" ? CheckCircle2 : XCircle)
  const getStatusColor = (status) => (status === "On Track" ? "text-green-500" : "text-red-500")

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects and Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentProjects.map(({ id, name, progress, status, dueDate }) => {
              const StatusIcon = getStatusIcon(status)
              return (
                <div key={id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{name}</h3>
                    <div className="flex items-center">
                      <StatusIcon className={`h-4 w-4 mr-1 ${getStatusColor(status)}`} />
                      <span className={`text-sm ${getStatusColor(status)}`}>{status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500">{progress}% complete</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Users</h2>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
