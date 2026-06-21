"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

const Projects = () => {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      console.error(e);
      alert("Could not fetch projects. Please check backend.");
    }
  };

  //validate
  const validateForm = (payload) => {
    const today = new Date();
    const startDate = new Date(payload.startDate);

    if (payload.budget <= 0) {
      alert("Budget must be a positive number.");
      return false;
    }

    if (payload.workers < 1) {
      alert("Worker count must be at least 1.");
      return false;
    }

    if (startDate < today.setHours(0, 0, 0, 0)) {
      alert("Start date cannot be in the past.");
      return false;
    }

    return true;
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      description: fd.get("description"),
      location: fd.get("location"),
      startDate: fd.get("startDate"),
      endDate: fd.get("endDate"),
      budget: Number(fd.get("budget")),
      manager: fd.get("manager"),
      workers: Number(fd.get("workers")),
      status: "Planning",
      progress: 0,
    };

    if (!validateForm(payload)) return;

    try {
      const res = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const newProject = await res.json();
      setProjects((prev) => [...prev, newProject]);
      setShowNewProjectForm(false);
      e.currentTarget.reset();
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      description: fd.get("description"),
      location: fd.get("location"),
      startDate: fd.get("startDate"),
      endDate: fd.get("endDate"),
      budget: Number(fd.get("budget")),
      manager: fd.get("manager"),
      workers: Number(fd.get("workers")),
      status: editProject.status,
      progress: editProject.progress,
    };

    if (!validateForm(payload)) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/projects/${editProject.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to update project");
      await res.json();
      setEditProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      fetchProjects();
      setSelectedProject(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Planning":
        return "bg-gray-100 text-gray-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and track your construction projects</p>
        </div>
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> New Project
        </button>
      </div>

      {/* ✅ View Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
            <p className="text-gray-600 mb-4">{selectedProject.description}</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <MapPin className="h-4 w-4 mr-2" /> {selectedProject.location}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(selectedProject.startDate).toLocaleDateString()} -{" "}
                {new Date(selectedProject.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Users className="h-4 w-4 mr-2" /> {selectedProject.workers} workers
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <DollarSign className="h-4 w-4 mr-2" /> ${selectedProject.budget.toLocaleString()}
              </div>
              <p className="text-sm text-gray-700">Manager: {selectedProject.manager}</p>
              <p className="text-sm text-gray-700">Status: {selectedProject.status}</p>
              <p className="text-sm text-gray-700">Progress: {selectedProject.progress}%</p>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setEditProject(selectedProject);
                  setSelectedProject(null);
                }}
                className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDeleteProject(selectedProject.id)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Form Modal */}
      {showNewProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <input name="name" placeholder="Project Name" className="w-full border px-3 py-2 rounded" required />
              <input name="description" placeholder="Description" className="w-full border px-3 py-2 rounded" required />
              <input name="location" placeholder="Location" className="w-full border px-3 py-2 rounded" required />
              <input type="date" name="startDate" className="w-full border px-3 py-2 rounded" required />
              <input type="date" name="endDate" className="w-full border px-3 py-2 rounded" required />
              <input type="number" name="budget" placeholder="Budget (e.g. 10000)" className="w-full border px-3 py-2 rounded" required />
              <input name="manager" placeholder="Manager" className="w-full border px-3 py-2 rounded" required />
              <input type="number" name="workers" placeholder="Workers (e.g. 5)" className="w-full border px-3 py-2 rounded" required />
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setShowNewProjectForm(false)} className="px-4 py-2 text-gray-600">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <input name="name" defaultValue={editProject.name} className="w-full border px-3 py-2 rounded" required />
              <input name="description" defaultValue={editProject.description} className="w-full border px-3 py-2 rounded" required />
              <input name="location" defaultValue={editProject.location} className="w-full border px-3 py-2 rounded" required />
              <input type="date" name="startDate" defaultValue={editProject.startDate?.split("T")[0]} className="w-full border px-3 py-2 rounded" required />
              <input type="date" name="endDate" defaultValue={editProject.endDate?.split("T")[0]} className="w-full border px-3 py-2 rounded" required />
              <input type="number" name="budget" defaultValue={editProject.budget} className="w-full border px-3 py-2 rounded" required />
              <input name="manager" defaultValue={editProject.manager} className="w-full border px-3 py-2 rounded" required />
              <input type="number" name="workers" defaultValue={editProject.workers} className="w-full border px-3 py-2 rounded" required />
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setEditProject(null)} className="px-4 py-2 text-gray-600">
                  Cancel
                </button>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Manager: {project.manager}</span>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
