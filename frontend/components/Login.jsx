"use client"

import { useState } from "react"
import ClientDashboard from "./ClientDashboard"

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (isRegister && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const endpoint = isRegister
        ? "http://localhost:8080/api/auth/register"
        : "http://localhost:8080/api/auth/login"

      const payload = isRegister
        ? {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            role: [formData.role], // backend expects Set<String>
          }
        : {
            username: formData.username || formData.email,
            password: formData.password,
          }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        const user = isRegister
          ? {
              username: formData.username,
              email: formData.email,
              role: formData.role,
              id: data.id || null,
            }
          : data

        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", data.token || "")
        setLoggedInUser(user)
        onLogin(user)
        
      } else {
        setError(data.message || `${isRegister ? "Registration" : "Login"} failed`)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setError("")
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "client",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      phone: "",
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setLoggedInUser(null)
  }

  // ✅ If logged in and user role is client → render Client Dashboard
  if (loggedInUser && loggedInUser.role === "client") {
    return <ClientDashboard user={loggedInUser} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isRegister ? "Create Account" : "WorksiteX Login"}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Username"
                  className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
                  value={formData.username}
                  onChange={handleChange}
                />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="First Name"
                  className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Last Name"
                  className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Phone (optional)"
                  className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </>
            )}
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
              value={formData.password}
              onChange={handleChange}
            />
            {isRegister && (
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
            <select
              id="role"
              name="role"
              className="block w-full px-3 py-2 border border-gray-300 sm:text-sm"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {isLoading
              ? isRegister
                ? "Creating account..."
                : "Signing in..."
              : isRegister
              ? "Create Account"
              : "Sign in"}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-500 w-full text-center"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Don't have an account? Register"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
