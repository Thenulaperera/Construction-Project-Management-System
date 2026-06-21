"use client"

import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Projects from "./components/Projects"
import Resources from "./components/Resources"
import Documents from "./components/Documents"
import Finance from "./components/Finance"
import Reports from "./components/Reports"
import Communication from "./components/Communication"
import Login from "./components/Login"
import ClientDashboard from "./components/ClientDashboard"

function App() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ✅ Check if user is already logged in
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        if (parsedUser.role === "client") {
          setActiveSection("client-dashboard")
        }
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    setIsLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.role === "client") {
      setActiveSection("client-dashboard")
    } else {
      setActiveSection("dashboard")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setActiveSection("dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    )
  }

  // ✅ Not logged in → show Login page
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // ✅ Client role → show ClientDashboard only
  if (user.role === "client") {
    return <ClientDashboard user={user} onLogout={handleLogout} />
  }

  // ✅ Admin role → show Sidebar and sections
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "projects":
        return <Projects />
      case "resources":
        return <Resources />
      case "documents":
        return <Documents />
      case "finance":
        return <Finance />
      case "reports":
        return <Reports />
      case "communication":
        return <Communication />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex-1 p-4">{renderContent()}</div>
    </div>
  )
}

export default App
