"use client"

const Sidebar = ({ activeSection, setActiveSection, user, onLogout }) => {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "projects", name: "Projects", icon: "🏗️" },
    { id: "resources", name: "Resources", icon: "👥" },
    { id: "documents", name: "Documents", icon: "📄" },
    { id: "finance", name: "Finance", icon: "💰" },
    { id: "reports", name: "Reports", icon: "📈" },
    { id: "communication", name: "Communication", icon: "💬" },
  ]

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">WorksiteX</h1>
        <p className="text-gray-400 text-sm">Construction Management</p>
        {user && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        )}
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${activeSection === item.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      {user && (
        <div className="mt-8 pt-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full text-left p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar
