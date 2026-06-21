"use client"

import { useState, useEffect } from "react"
import { Wrench, Package, Plus, Search, Edit, Trash2, X } from "lucide-react"

const Resources = () => {
  const [activeTab, setActiveTab] = useState("equipment")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [equipment, setEquipment] = useState([])
  const [materials, setMaterials] = useState([])
  const [editData, setEditData] = useState(null)

  const fetchResources = async () => {
    try {
      const [equipmentRes, materialsRes] = await Promise.all([
        fetch("http://localhost:8080/api/equipment"),
        fetch("http://localhost:8080/api/materials"),
      ])
      const equipmentData = await equipmentRes.json()
      const materialsData = await materialsRes.json()
      setEquipment(equipmentData)
      setMaterials(materialsData)
    } catch (err) {
      console.error("Failed to fetch resources:", err)
    }
  }

  useEffect(() => {
    fetchResources()
    const interval = setInterval(fetchResources, 2000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Assigned":
      case "In Use":
        return "bg-blue-100 text-blue-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const tabs = [
    { id: "equipment", label: "Equipment", icon: Wrench, count: equipment.length },
    { id: "materials", label: "Materials", icon: Package, count: materials.length },
  ]

  const filteredEquipment = equipment.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddResource = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    let payload = {}
    let url = ""

    if (activeTab === "equipment") {
      const dailyRate = Number(fd.get("dailyRate"))
      if (isNaN(dailyRate) || dailyRate <= 0) {
        alert("Please enter a valid Daily Rate greater than 0.")
        return
      }

      payload = {
        name: fd.get("name"),
        type: fd.get("type"),
        location: fd.get("location"),
        status: "Available",
        dailyRate,
      }
      url = "http://localhost:8080/api/equipment"
    } else {
      const quantity = Number(fd.get("quantity"))
      const cost = Number(fd.get("cost"))
      const unit = fd.get("unit").trim()

      if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid Quantity greater than 0.")
        return
      }
      if (!unit) {
        alert("Please enter a Unit for the material.")
        return
      }
      if (isNaN(cost) || cost <= 0) {
        alert("Please enter a valid Cost greater than 0.")
        return
      }

      payload = {
        name: fd.get("name"),
        category: fd.get("category"),
        quantity,
        unit,
        cost,
        supplier: fd.get("supplier"),
      }
      url = "http://localhost:8080/api/materials"
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setShowAddModal(false)
      e.currentTarget.reset()
      fetchResources()
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?")
    if (!confirmDelete) return

    const url =
      activeTab === "equipment"
        ? `http://localhost:8080/api/equipment/${id}`
        : `http://localhost:8080/api/materials/${id}`

    const res = await fetch(url, { method: "DELETE" })
    if (res.ok) {
      if (activeTab === "equipment")
        setEquipment((prev) => prev.filter((e) => e.id !== id))
      else setMaterials((prev) => prev.filter((m) => m.id !== id))
    }
  }

  const handleEdit = (item) => {
    setEditData(item)
    setShowEditModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    let payload = {}
    let url = ""

    if (activeTab === "equipment") {
      const dailyRate = Number(fd.get("dailyRate"))
      if (isNaN(dailyRate) || dailyRate <= 0) {
        alert("Please enter a valid Daily Rate greater than 0.")
        return
      }

      payload = {
        name: fd.get("name"),
        type: fd.get("type"),
        location: fd.get("location"),
        status: fd.get("status"),
        dailyRate,
      }
      url = `http://localhost:8080/api/equipment/${editData.id}`
    } else {
      const quantity = Number(fd.get("quantity"))
      const cost = Number(fd.get("cost"))
      const unit = fd.get("unit").trim()

      if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid Quantity greater than 0.")
        return
      }
      if (!unit) {
        alert("Please enter a Unit for the material.")
        return
      }
      if (isNaN(cost) || cost <= 0) {
        alert("Please enter a valid Cost greater than 0.")
        return
      }

      payload = {
        name: fd.get("name"),
        category: fd.get("category"),
        quantity,
        unit,
        cost,
        supplier: fd.get("supplier"),
      }
      url = `http://localhost:8080/api/materials/${editData.id}`
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setShowEditModal(false)
      setEditData(null)
      fetchResources()
    }
  }

  const renderEquipment = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEquipment.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{e.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{e.type}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{e.location}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(e.status)}`}>
                  {e.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">${e.dailyRate?.toFixed(2)}</td>
              <td className="px-6 py-4 text-right space-x-3">
                <button onClick={() => handleEdit(e)} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderMaterials = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredMaterials.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{m.category}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {m.quantity} {m.unit}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">${m.cost?.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{m.supplier}</td>
              <td className="px-6 py-4 text-right space-x-3">
                <button onClick={() => handleEdit(m)} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderContent = () => (activeTab === "equipment" ? renderEquipment() : renderMaterials())

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-gray-600">Manage equipment and materials</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Resource
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex space-x-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-2 font-medium text-sm flex items-center ${
                activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {renderContent()}

      {/* Add Modal */}
      {showAddModal && (
        <Modal title={`Add ${activeTab.slice(0, -1)}`} onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddResource} className="space-y-4">
            {activeTab === "equipment" ? (
              <>
                <input name="name" placeholder="Name" className="w-full border px-3 py-2 rounded" required />
                <input name="type" placeholder="Type" className="w-full border px-3 py-2 rounded" required />
                <input name="location" placeholder="Location" className="w-full border px-3 py-2 rounded" />
                <input name="dailyRate" placeholder="Daily Rate" type="number" className="w-full border px-3 py-2 rounded" required />
              </>
            ) : (
              <>
                <input name="name" placeholder="Name" className="w-full border px-3 py-2 rounded" required />
                <input name="category" placeholder="Category" className="w-full border px-3 py-2 rounded" />
                <input name="quantity" placeholder="Quantity" type="number" className="w-full border px-3 py-2 rounded" required />
                <input name="unit" placeholder="Unit" className="w-full border px-3 py-2 rounded" required />
                <input name="cost" placeholder="Cost" type="number" className="w-full border px-3 py-2 rounded" required />
                <input name="supplier" placeholder="Supplier" className="w-full border px-3 py-2 rounded" />
              </>
            )}
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && editData && (
        <Modal title={`Edit ${activeTab.slice(0, -1)}`} onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            {activeTab === "equipment" ? (
              <>
                <input name="name" defaultValue={editData.name} className="w-full border px-3 py-2 rounded" required />
                <input name="type" defaultValue={editData.type} className="w-full border px-3 py-2 rounded" required />
                <input name="location" defaultValue={editData.location} className="w-full border px-3 py-2 rounded" />
                <input name="status" defaultValue={editData.status} className="w-full border px-3 py-2 rounded" />
                <input name="dailyRate" defaultValue={editData.dailyRate} type="number" className="w-full border px-3 py-2 rounded" required />
              </>
            ) : (
              <>
                <input name="name" defaultValue={editData.name} className="w-full border px-3 py-2 rounded" required />
                <input name="category" defaultValue={editData.category} className="w-full border px-3 py-2 rounded" />
                <input name="quantity" defaultValue={editData.quantity} type="number" className="w-full border px-3 py-2 rounded" required />
                <input name="unit" defaultValue={editData.unit} className="w-full border px-3 py-2 rounded" required />
                <input name="cost" defaultValue={editData.cost} type="number" className="w-full border px-3 py-2 rounded" required />
                <input name="supplier" defaultValue={editData.supplier} className="w-full border px-3 py-2 rounded" />
              </>
            )}
            <div className="flex justify-end">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                Update
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
        <X size={20} />
      </button>
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {children}
    </div>
  </div>
)

export default Resources
