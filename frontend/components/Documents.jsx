"use client";

import { useEffect, useState } from "react";
import { Upload, Download, Eye, Folder, Search, Filter, Trash2, Edit, X } from "lucide-react";

// --- Edit Modal ---
const EditModal = ({ doc, onClose, onUpdate, onDelete, projects }) => {
  const [formData, setFormData] = useState({
    name: doc.name || "",
    type: doc.type || "",
    projectId: doc.project?.id || "",
    filePath: doc.filePath || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(doc.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Document Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Document Name"
              className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="drawing">Drawing</option>
              <option value="contract">Contract</option>
              <option value="permit">Permit</option>
              <option value="report">Report</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filePath" className="block text-sm font-medium text-gray-700">
              File URL / Path
            </label>
            <input
              id="filePath"
              name="filePath"
              value={formData.filePath}
              onChange={handleChange}
              placeholder="https://example.com/file.pdf"
              className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => onDelete(doc.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </button>

            <div className="flex space-x-4">
              <button onClick={onClose} type="button" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---
const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);

  const apiUrl = "http://localhost:8080/api/documents";
  const projectApi = "http://localhost:8080/api/projects";

  // Fetch documents + projects
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setDocuments)
      .catch((err) => console.error("Error fetching documents:", err));

    fetch(projectApi)
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // Create
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const doc = {
      name: data.get("name"),
      type: data.get("type"),
      filePath: data.get("filePath"),
      projectId: data.get("projectId"),
    };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });

      if (!res.ok) throw new Error("Failed to upload document");
      const newDoc = await res.json();
      setDocuments((prev) => [...prev, newDoc]);
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    }
  };

  // Update
  const handleUpdateDocument = async (id, updatedData) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update");
      const updatedDoc = await res.json();
      setDocuments((prev) => prev.map((d) => (d.id === id ? updatedDoc : d)));
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  // Delete
  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  // Filtering
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-gray-600">Manage all your project files</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Upload className="h-5 w-5 mr-2" /> Add Document
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add Document</h2>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <input name="name" placeholder="Document Name" className="w-full border px-3 py-2 rounded" required />
              <select name="type" className="w-full border px-3 py-2 rounded" required>
                <option value="">Select Type</option>
                <option value="drawing">Drawing</option>
                <option value="contract">Contract</option>
                <option value="permit">Permit</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </select>
              <select name="projectId" className="w-full border px-3 py-2 rounded" required>
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                name="filePath"
                placeholder="https://example.com/file.pdf"
                className="w-full border px-3 py-2 rounded"
                required
              />

              <div className="flex justify-end space-x-4 pt-4">
                <button onClick={() => setShowUploadModal(false)} type="button" className="text-gray-600">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && documentToEdit && (
        <EditModal
          doc={documentToEdit}
          projects={projects}
          onClose={() => {
            setShowEditModal(false);
            setDocumentToEdit(null);
          }}
          onUpdate={handleUpdateDocument}
          onDelete={handleDeleteDocument}
        />
      )}

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-blue-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" /> Filters
        </button>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">
                Type: {doc.type} • Project: {doc.project?.name || "N/A"} •{" "}
                {new Date(doc.uploadDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => { setDocumentToEdit(doc); setShowEditModal(true); }} className="p-2 text-blue-600">
                <Edit className="h-5 w-5" />
              </button>
              <a href={doc.filePath} target="_blank" rel="noreferrer" className="p-2 text-green-600">
                <Eye className="h-5 w-5" />
              </a>
              <a href={doc.filePath} download className="p-2 text-purple-600">
                <Download className="h-5 w-5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No documents found</h3>
        </div>
      )}
    </div>
  );
};

export default Documents;
