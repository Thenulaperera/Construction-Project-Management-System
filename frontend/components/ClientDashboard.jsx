"use client"

import { useState, useEffect } from "react"

const ClientDashboard = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchId, setSearchId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchClientProjects()
  }, [])

  const fetchClientProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/projects/client/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setProjects(data)
      } else {
        setError(data.message || "Failed to fetch projects")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const searchProjectById = async () => {
    if (!searchId.trim()) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${searchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setSelectedProject(data)
      } else {
        setError(data.message || "Project not found")
        setSelectedProject(null)
      }
    } catch (err) {
      setError("Network error. Please try again.")
      setSelectedProject(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "in progress":
        return "text-blue-600 bg-blue-100"
      case "on hold":
        return "text-yellow-600 bg-yellow-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name || user.username}</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Project by ID</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Project ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchProjectById}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {/* Selected Project Details */}
        {selectedProject && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Project Details</h3>
                <p><strong>ID:</strong> {selectedProject.id}</p>
                <p><strong>Location:</strong> {selectedProject.location}</p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Budget</h3>
                <p><strong>Total:</strong> {formatCurrency(selectedProject.budget)}</p>
                <p><strong>Spent:</strong> {formatCurrency(selectedProject.spent || 0)}</p>
                <p><strong>Remaining:</strong> {formatCurrency((selectedProject.budget || 0) - (selectedProject.spent || 0))}</p>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(((selectedProject.spent || 0) / (selectedProject.budget || 1)) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round(((selectedProject.spent || 0) / (selectedProject.budget || 1)) * 100)}% spent
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Progress</h3>
                <div className="bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: `${selectedProject.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{selectedProject.progress || 0}% Complete</p>
                <p className="mt-2"><strong>Manager:</strong> {selectedProject.manager || "Not assigned"}</p>
              </div>
            </div>

            {selectedProject.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedProject.description}</p>
              </div>
            )}
          </div>
        )}

        {/* My Projects List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Projects</h2>
          {loading && !selectedProject ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-600">No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                  <p className="text-gray-600 mb-2">{project.location}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="text-sm text-gray-600">{project.progress || 0}% complete</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">Budget: {formatCurrency(project.budget)}</p>
                  <button
                    onClick={() => {
                      setSearchId(project.id.toString())
                      setSelectedProject(project)
                    }}
                    className="mt-2 w-full bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
