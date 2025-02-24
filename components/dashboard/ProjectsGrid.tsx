"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Users,
  Calendar,
  DollarSign,
  User,
  Globe,
  Smartphone,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Image from "next/image";
import { ProjectResponse } from "../projects/dto/ProjectResponse";
import { ProjectRequest } from "../projects/dto/ProjectRequest";
import ProjectService from "../projects/service/ProjectService";
import { ProjectType } from "../projects/dto/ProjectType";

interface Technology {
  name: string;
  color: string;
}

/**
 * Extindem modelul primit de la backend (ProjectResponse) cu câteva câmpuri suplimentare pentru UI.
 * Dacă backend-ul furnizează imageUrl, putem mapa acest câmp la "image" pentru ușurința afișării.
 */
interface Project extends ProjectResponse {
  image: string;
}

const ProjectsGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState<boolean>(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTechnology, setNewTechnology] = useState<{
    name: string;
    color: string;
  }>({
    name: "",
    color: "bg-blue-500",
  });
  const productService = new ProjectService();
  // Pentru proiectele noi, folosim tipul ProjectRequest conform DTO-ului definit
  const [newProject, setNewProject] = useState<ProjectRequest>({
    name: "",
    description: "",
    client: "",
    price: 0,
    link: "",
    deadline: "",
    teamSize: 1,
    type: ProjectType.WEB,
    technologies: [],
  });

  // Se efectuează fetch pentru proiecte la montarea componentei
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getAllProjects();
        // Mapează imageUrl din backend la câmpul "image" pentru UI
        const mapped = response.map((project) => ({
          ...project,
          image: project.imageUrl,
        }));
        setProjects(mapped);
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Gestionează uploadul imaginii și afișează preview-ul
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        // Actualizează proiectul curent (dacă se editează) sau proiectul nou
        if (selectedProject) {
          setSelectedProject({ ...selectedProject, image: preview });
        } else {
          setNewProject({ ...newProject, image: preview } as any);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Adaugă o tehnologie în lista corespunzătoare
  const handleAddTechnology = (isNew: boolean) => {
    if (newTechnology.name.trim() !== "") {
      if (isNew) {
        setNewProject({
          ...newProject,
          technologies: [...newProject.technologies, newTechnology.name],
        });
      } else if (selectedProject) {
        setSelectedProject({
          ...selectedProject,
          technologies: [...selectedProject.technologies, newTechnology.name],
        });
      }
      setNewTechnology({ name: "", color: "bg-blue-500" });
    }
  };

  // Elimină o tehnologie din listă
  const handleRemoveTechnology = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewProject({
        ...newProject,
        technologies: newProject.technologies.filter((_, i) => i !== index),
      });
    } else if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        technologies: selectedProject.technologies.filter(
          (_, i) => i !== index
        ),
      });
    }
  };

  // Creează un proiect nou folosind serviciul API
  const handleCreateProject = async () => {
    try {
      // Dacă există fișier selectat, îl trimitem ca parametru
      const file = fileInputRef.current?.files?.[0];
      const created = await productService.createProject(newProject, file);
      // Mapează imageUrl la câmpul "image" pentru UI
      const mappedProject: Project = { ...created, image: created.imageUrl };
      setProjects([...projects, mappedProject]);
      // Resetăm formularul
      setNewProject({
        name: "",
        description: "",
        client: "",
        price: 0,
        link: "",
        deadline: "",
        teamSize: 1,
        type: ProjectType.WEB,
        technologies: [],
      });
      setImagePreview("");
      setIsNewProjectOpen(false);
    } catch (error) {
      console.error("Error creating project", error);
    }
  };

  const handleEditProject = async () => {
    if (!selectedProject) return;
    try {
      const file = fileInputRef.current?.files?.[0];
  
      const projectRequest = {
        name: selectedProject.name,
        description: selectedProject.description,
        client: selectedProject.client,
        price: selectedProject.price,
        link: selectedProject.link,
        deadline: typeof selectedProject.deadline === 'string'
          ? selectedProject.deadline
          : selectedProject.deadline.toISOString().split('T')[0],
        teamSize: selectedProject.teamSize,
        type: selectedProject.type,
        technologies: selectedProject.technologies,
      };
  
      const updated = await productService.updateProject(
        selectedProject.id,
        projectRequest,
        file
      );
      const mappedProject: Project = { ...updated, image: updated.imageUrl };
      setProjects(projects.map(p => (p.id === mappedProject.id ? mappedProject : p)));
      setIsEditProjectOpen(false);
      setImagePreview("");
    } catch (error) {
      console.error("Error updating project", error);
    }
  };
  

  // Șterge proiectul selectat
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
      await productService.deleteProject(selectedProject.id);
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
      setSelectedProject(null);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  // Returnează iconița corespunzătoare tipului proiectului
  const getProjectTypeIcon = (type: ProjectType): React.ElementType => {
    return type === ProjectType.WEB ? Globe : Smartphone;
  };

  // Returnează culoarea asociată tipului proiectului
  const getProjectTypeColor = (type: ProjectType): string => {
    return type === ProjectType.WEB
      ? "bg-blue-500/20 text-blue-500"
      : "bg-purple-500/20 text-purple-500";
  };

  // Renderizarea formularului de creare/actualizare proiect
  const renderProjectForm = (isNew: boolean) => {
    const project = isNew ? newProject : (selectedProject as any);
    if (!project) return null;

    return (
      <div className="grid grid-cols-2 gap-8">
        {/* Coloana stângă */}
        <div className="space-y-6">
          <div className="relative">
            <div
              className="w-full aspect-video rounded-xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview || project.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imagePreview || project.image}
                    alt="Project preview"
                    fill
                    sizes="(min-width: 640px) 640px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-sm text-white/60">
                    Click to upload project image
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({ ...newProject, name: e.target.value });
                  } else {
                    setSelectedProject({
                      ...selectedProject!,
                      name: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                placeholder="Enter project name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    });
                  } else {
                    setSelectedProject({
                      ...selectedProject!,
                      description: e.target.value,
                    });
                  }
                }}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                placeholder="Enter project description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Project Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (isNew) {
                      setNewProject({ ...newProject, type: ProjectType.WEB });
                    } else {
                      setSelectedProject({
                        ...selectedProject!,
                        type: ProjectType.WEB,
                      });
                    }
                  }}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-colors ${
                    project.type === ProjectType.WEB
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-500"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span>Web App</span>
                </button>
                <button
                  onClick={() => {
                    if (isNew) {
                      setNewProject({
                        ...newProject,
                        type: ProjectType.MOBILE,
                      });
                    } else {
                      setSelectedProject({
                        ...selectedProject!,
                        type: ProjectType.MOBILE,
                      });
                    }
                  }}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-colors ${
                    project.type === ProjectType.MOBILE
                      ? "bg-purple-500/20 border-purple-500/50 text-purple-500"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile App</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-white/5 border border-white/10 rounded-xl">
                {project.technologies.map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-200 border border-yellow-500/20"
                  >
                    {tech}
                    <button
                      onClick={() => handleRemoveTechnology(index, isNew)}
                      className="ml-2 text-yellow-200/60 hover:text-yellow-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechnology.name}
                  onChange={(e) =>
                    setNewTechnology({ ...newTechnology, name: e.target.value })
                  }
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                  placeholder="Add technology..."
                />
                <button
                  onClick={() => handleAddTechnology(isNew)}
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-200 rounded-xl hover:bg-yellow-500/30 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coloana dreaptă */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Client
              </label>
              <input
                type="text"
                value={project.client}
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({ ...newProject, client: e.target.value });
                  } else {
                    setSelectedProject({
                      ...selectedProject!,
                      client: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                placeholder="Enter client name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Project Price ($)
              </label>
              <input
                type="number"
                value={project.price}
                onChange={(e) => {
                  const price = parseFloat(e.target.value);
                  if (isNew) {
                    setNewProject({ ...newProject, price });
                  } else {
                    setSelectedProject({ ...selectedProject!, price });
                  }
                }}
                min="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Deadline
              </label>
              <input
                type="date"
                // Convertim deadline-ul din Date în string (format YYYY-MM-DD)
                value={
                  typeof project.deadline === "string"
                    ? project.deadline
                    : project.deadline.toISOString().split("T")[0]
                }
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({ ...newProject, deadline: e.target.value });
                  } else {
                    setSelectedProject((prev) =>
                      prev
                        ? { ...prev, deadline: new Date(e.target.value) }
                        : prev
                    );
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Team Size
              </label>
              <input
                type="number"
                value={project.teamSize}
                onChange={(e) => {
                  const teamSize = parseInt(e.target.value, 10);
                  if (isNew) {
                    setNewProject({ ...newProject, teamSize });
                  } else {
                    setSelectedProject({ ...selectedProject!, teamSize });
                  }
                }}
                min="1"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Project Link
            </label>
            <input
              type="url"
              value={project.link}
              onChange={(e) => {
                if (isNew) {
                  setNewProject({ ...newProject, link: e.target.value });
                } else {
                  setSelectedProject({
                    ...selectedProject!,
                    link: e.target.value,
                  });
                }
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-8">
            <button
              onClick={() =>
                isNew ? setIsNewProjectOpen(false) : setIsEditProjectOpen(false)
              }
              className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isNew ? handleCreateProject : handleEditProject}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-colors font-medium"
            >
              {isNew ? "Create Project" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your project portfolio</p>
        </div>
        <button
          onClick={() => setIsNewProjectOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {isLoading ? (
        <p className="text-white">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const TypeIcon = getProjectTypeIcon(project.type);
            const typeColor = getProjectTypeColor(project.type);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group relative bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div
                      className={`flex items-center space-x-2 px-2 py-1 rounded-lg ${typeColor}`}
                    >
                      <TypeIcon className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {project.type === ProjectType.WEB
                          ? "Web App"
                          : "Mobile App"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setIsEditProjectOpen(true);
                      }}
                      className="p-2 bg-gray-900/90 backdrop-blur-xl rounded-lg text-white hover:bg-gray-800 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setIsDeleteOpen(true);
                      }}
                      className="p-2 bg-gray-900/90 backdrop-blur-xl rounded-lg text-rose-500 hover:bg-gray-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-md text-xs font-medium bg-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      <span>{project.client}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>${project.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{project.teamSize} team members</span>
                    </div>
                  </div>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                  >
                    View Project
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        title="Create New Project"
      >
        {renderProjectForm(true)}
      </Modal>

      <Modal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        title="Edit Project"
      >
        {renderProjectForm(false)}
      </Modal>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProjectsGrid;
