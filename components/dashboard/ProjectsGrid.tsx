"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Search,
  Filter,
  X,
  Check,
  ExternalLink,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Image from "next/image";
import { ProjectResponse } from "../projects/dto/ProjectResponse";
import { ProjectRequest } from "../projects/dto/ProjectRequest";
import ProjectService from "../projects/service/ProjectService";
import { ProjectType } from "../projects/dto/ProjectType";

interface Project extends ProjectResponse {
  image: string;
}

const ProjectsGrid: React.FC = () => {
  // Services
  const projectService = new ProjectService();

  // Core state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState<boolean>(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [newProject, setNewProject] = useState<ProjectRequest>({
    name: "",
    description: "",
    client: "",
    price: 0,
    link: "",
    deadline: new Date().toISOString().split("T")[0],
    teamSize: 1,
    type: ProjectType.WEB,
    technologies: [],
  });

  // Technology input state
  const [newTechnology, setNewTechnology] = useState<string>("");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ProjectType | "ALL">("ALL");
  const [selectedTech, setSelectedTech] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [teamSizeRange, setTeamSizeRange] = useState<[number, number]>([1, 20]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await projectService.getAllProjects();
        const projectsWithImages = response.map((project) => ({
          ...project,
          image:
            project.imageUrl ||
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
        }));
        setProjects(projectsWithImages);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Derived state
  const uniqueTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet);
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "ALL" || project.type === selectedType;
      const matchesTech =
        selectedTech === "ALL" || project.technologies.includes(selectedTech);
      const matchesPrice =
        project.price >= priceRange[0] && project.price <= priceRange[1];
      const matchesTeamSize =
        project.teamSize >= teamSizeRange[0] &&
        project.teamSize <= teamSizeRange[1];

      return (
        matchesSearch &&
        matchesType &&
        matchesTech &&
        matchesPrice &&
        matchesTeamSize
      );
    });
  }, [
    projects,
    searchQuery,
    selectedType,
    selectedTech,
    priceRange,
    teamSizeRange,
  ]);

  // Handlers
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        if (selectedProject) {
          setSelectedProject({ ...selectedProject, image: preview });
        } else {
          setNewProject({ ...newProject, image: preview } as any);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTechnology = (isNew: boolean) => {
    if (!newTechnology.trim()) return;

    if (isNew) {
      setNewProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }));
    } else if (selectedProject) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              technologies: [...prev.technologies, newTechnology.trim()],
            }
          : null
      );
    }

    setNewTechnology("");
  };

  const handleRemoveTechnology = (tech: string, isNew: boolean) => {
    if (isNew) {
      setNewProject((prev) => ({
        ...prev,
        technologies: prev.technologies.filter((t) => t !== tech),
      }));
    } else if (selectedProject) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              technologies: prev.technologies.filter((t) => t !== tech),
            }
          : null
      );
    }
  };

  const handleCreateProject = async () => {
    try {
      const file = fileInputRef.current?.files?.[0];
      const created = await projectService.createProject(newProject, file);
      const mappedProject = { ...created, image: created.imageUrl };
      setProjects((prev) => [...prev, mappedProject]);

      // Reset form
      setNewProject({
        name: "",
        description: "",
        client: "",
        price: 0,
        link: "",
        deadline: new Date().toISOString().split("T")[0],
        teamSize: 1,
        type: ProjectType.WEB,
        technologies: [],
      });
      setImagePreview("");
      setIsNewProjectOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
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
        deadline:
          typeof selectedProject.deadline === "string"
            ? selectedProject.deadline
            : selectedProject.deadline.toISOString().split("T")[0],
        teamSize: selectedProject.teamSize,
        type: selectedProject.type,
        technologies: selectedProject.technologies,
      };

      const updated = await projectService.updateProject(
        selectedProject.id,
        projectRequest,
        file
      );
      const mappedProject = { ...updated, image: updated.imageUrl };
      setProjects((prev) =>
        prev.map((p) => (p.id === mappedProject.id ? mappedProject : p))
      );
      setIsEditProjectOpen(false);
      setImagePreview("");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      await projectService.deleteProject(selectedProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setSelectedProject(null);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Render helpers
  const renderProjectForm = (isNew: boolean) => {
    const project = isNew ? newProject : selectedProject;
    if (!project) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="relative">
            <div
              className="w-full aspect-video rounded-xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview || project.link ? (
                <div className="relative w-full h-full">
                  <Image
                    src={
                      imagePreview ||
                      ("imageUrl" in project ? project.imageUrl : "")
                    }
                    alt="Project preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-sm text-white/60">
                    Click to upload project image
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Recommended: 1920x1080px
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

          {/* Basic Info */}
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
                    setSelectedProject((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    );
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
                    setSelectedProject((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    );
                  }
                }}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                placeholder="Enter project description..."
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Project Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (isNew) {
                      setNewProject({ ...newProject, type: ProjectType.WEB });
                    } else {
                      setSelectedProject((prev) =>
                        prev ? { ...prev, type: ProjectType.WEB } : null
                      );
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
                  type="button"
                  onClick={() => {
                    if (isNew) {
                      setNewProject({
                        ...newProject,
                        type: ProjectType.MOBILE,
                      });
                    } else {
                      setSelectedProject((prev) =>
                        prev ? { ...prev, type: ProjectType.MOBILE } : null
                      );
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
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Project Details */}
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
                    setSelectedProject((prev) =>
                      prev ? { ...prev, client: e.target.value } : null
                    );
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
                    setSelectedProject((prev) =>
                      prev ? { ...prev, price } : null
                    );
                  }
                }}
                min="0"
                step="0.01"
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
                        : null
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
                    setSelectedProject((prev) =>
                      prev ? { ...prev, teamSize } : null
                    );
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
                  setSelectedProject((prev) =>
                    prev ? { ...prev, link: e.target.value } : null
                  );
                }
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              placeholder="https://..."
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Technologies
            </label>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-white/5 border border-white/10 rounded-xl">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-200 border border-yellow-500/20"
                >
                  {tech}
                  <button
                    onClick={() => handleRemoveTechnology(tech, isNew)}
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
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTechnology(isNew);
                  }
                }}
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

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
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
      {/* Header with Search and Filters */}
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Projects</h1>
            <p className="text-white/60">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all font-medium group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>New Project</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative col-span-full lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as ProjectType | "ALL")
            }
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-900 focus:outline-none focus:border-yellow-500/50"
          >
            <option value="ALL">All Types</option>
            <option value={ProjectType.WEB}>Web Apps</option>
            <option value={ProjectType.MOBILE}>Mobile Apps</option>
          </select>

          {/* Technology Filter */}
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-900 focus:outline-none focus:border-yellow-500/50"
          >
            <option value="ALL">All Technologies</option>
            {uniqueTechnologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>

          {/* Price Range Filter */}
          <div className="relative">
            <button
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-white/60">Price Range</span>
                <Filter className="w-4 h-4 text-white/40" />
              </div>
              <div className="text-sm mt-1">
                ${priceRange[0].toLocaleString()} - $
                {priceRange[1].toLocaleString()}
              </div>
            </button>

            {showPriceFilter && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Min Price
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full accent-yellow-500"
                    />
                    <div className="text-sm text-white mt-1">
                      ${priceRange[0].toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Max Price
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-yellow-500"
                    />
                    <div className="text-sm text-white mt-1">
                      ${priceRange[1].toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const TypeIcon =
                project.type === ProjectType.WEB ? Globe : Smartphone;
              const typeColor =
                project.type === ProjectType.WEB
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-purple-500/20 text-purple-500";

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                  className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setIsEditProjectOpen(true);
                        }}
                        className="p-2 bg-gray-900/90 backdrop-blur-xl rounded-lg text-white hover:bg-white/20 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 bg-gray-900/90 backdrop-blur-xl rounded-lg text-rose-500 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${typeColor}`}
                      >
                        <TypeIcon className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          {project.type === ProjectType.WEB
                            ? "Web App"
                            : "Mobile App"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-white/60 mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-lg text-xs font-medium bg-white/5 text-white/80 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center text-sm text-white/60">
                        <User className="w-4 h-4 mr-2 text-white/40" />
                        <span>{project.client}</span>
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <DollarSign className="w-4 h-4 mr-2 text-white/40" />
                        Continuing exactly where we left off:
                        <span>${project.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Calendar className="w-4 h-4 mr-2 text-white/40" />
                        <span>
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Users className="w-4 h-4 mr-2 text-white/40" />
                        <span>{project.teamSize} members</span>
                      </div>
                    </div>

                    {/* View Project Link */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 hover:from-yellow-500/20 hover:to-yellow-600/20 text-yellow-500 rounded-xl transition-colors group/link"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Modals */}
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
