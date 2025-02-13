"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, Users, Calendar, DollarSign, User, Globe, Smartphone } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import DeleteDialog from '@/components/ui/DeleteDialog';
import Image from 'next/image';

type ProjectType = 'web' | 'mobile';

interface Technology {
  name: string;
  color: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  client: string;
  price: number;
  link: string;
  deadline: string;
  teamSize: number;
  type: ProjectType;
  technologies: Technology[];
}

const ProjectsGrid = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Modern online shopping experience with AI recommendations',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      client: 'TechCorp Inc.',
      price: 15000,
      link: 'https://example.com/project1',
      deadline: '2024-04-15',
      teamSize: 8,
      type: 'web',
      technologies: [
        { name: 'React', color: 'bg-blue-500' },
        { name: 'Node.js', color: 'bg-green-500' },
        { name: 'MongoDB', color: 'bg-emerald-500' }
      ]
    }
  ]);

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTechnology, setNewTechnology] = useState({ name: '', color: 'bg-blue-500' });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    image: '',
    client: '',
    price: 0,
    link: '',
    deadline: '',
    teamSize: 1,
    type: 'web' as ProjectType,
    technologies: [] as Technology[]
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        if (selectedProject) {
          setSelectedProject({ ...selectedProject, image: preview });
        } else {
          setNewProject({ ...newProject, image: preview });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTechnology = (isNew: boolean) => {
    if (newTechnology.name) {
      if (isNew) {
        setNewProject({
          ...newProject,
          technologies: [...newProject.technologies, { ...newTechnology }]
        });
      } else if (selectedProject) {
        setSelectedProject({
          ...selectedProject,
          technologies: [...selectedProject.technologies, { ...newTechnology }]
        });
      }
      setNewTechnology({ name: '', color: 'bg-blue-500' });
    }
  };

  const handleRemoveTechnology = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewProject({
        ...newProject,
        technologies: newProject.technologies.filter((_, i) => i !== index)
      });
    } else if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        technologies: selectedProject.technologies.filter((_, i) => i !== index)
      });
    }
  };

  const handleCreateProject = () => {
    const project: Project = {
      id: projects.length + 1,
      ...newProject
    };
    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      image: '',
      client: '',
      price: 0,
      link: '',
      deadline: '',
      teamSize: 1,
      type: 'web',
      technologies: []
    });
    setImagePreview('');
    setIsNewProjectOpen(false);
  };

  const handleEditProject = () => {
    if (selectedProject) {
      setProjects(projects.map(p => p.id === selectedProject.id ? selectedProject : p));
      setIsEditProjectOpen(false);
      setImagePreview('');
    }
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setSelectedProject(null);
      setIsDeleteOpen(false);
    }
  };

  const getProjectTypeIcon = (type: ProjectType) => {
    return type === 'web' ? Globe : Smartphone;
  };

  const getProjectTypeColor = (type: ProjectType) => {
    return type === 'web' 
      ? 'bg-blue-500/20 text-blue-500'
      : 'bg-purple-500/20 text-purple-500';
  };

  const renderProjectForm = (isNew: boolean) => {
    const project = isNew ? newProject : selectedProject;
    if (!project) return null;

    return (
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="relative">
            <div
              className="w-full aspect-video rounded-xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {(imagePreview || project.image) ? (
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
                  <p className="text-sm text-white/60">Click to upload project image</p>
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
              <label className="block text-sm font-medium text-white mb-1">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({ ...newProject, name: e.target.value });
                  } else if (selectedProject) {
                    setSelectedProject({ ...selectedProject, name: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                placeholder="Enter project name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({ ...newProject, description: e.target.value });
                  } else if (selectedProject) {
                    setSelectedProject({ ...selectedProject, description: e.target.value });
                  }
                }}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                placeholder="Enter project description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Project Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (isNew) {
                      setNewProject({ ...newProject, type: 'web' });
                    } else if (selectedProject) {
                      setSelectedProject({ ...selectedProject, type: 'web' });
                    }
                  }}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-colors ${
                    project.type === 'web'
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-500'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span>Web App</span>
                </button>
                <button
                  onClick={() => {
                    if (isNew) {
                      setNewProject({ ...newProject, type: 'mobile' });
                    } else if (selectedProject) {
                      setSelectedProject({ ...selectedProject, type: 'mobile' });
                    }
                  }}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-colors ${
                    project.type === 'mobile'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-500'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile App</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-white/5 border border-white/10 rounded-xl">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-200 border border-yellow-500/20"
                  >
                    {tech.name}
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
                  onChange={(e) => setNewTechnology({ ...newTechnology, name: e.target.value })}
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

        {/* Right Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Client</label>
              <input
                type="text"
                value={project.client}
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({ ...newProject, client: e.target.value });
                  } else if (selectedProject) {
                    setSelectedProject({ ...selectedProject, client: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                placeholder="Enter client name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Project Price ($)</label>
              <input
                type="number"
                value={project.price}
                onChange={(e) => {
                  const price = parseInt(e.target.value);
                  if (isNew) {
                    setNewProject({ ...newProject, price });
                  } else if (selectedProject) {
                    setSelectedProject({ ...selectedProject, price });
                  }
                }}
                min="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Deadline</label>
              <input
                type="date"
                value={project.deadline}
                onChange={(e) => {
                  if (isNew) {
                    setNewProject({ ...newProject, deadline: e.target.value });
                  } else if (selectedProject) {
                    setSelectedProject({ ...selectedProject, deadline: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Team Size</label>
              <input
                type="number"
                value={project.teamSize}
                onChange={(e) => {
                  const teamSize = parseInt(e.target.value);
                  if (isNew) {
                    setNewProject({ ...newProject, teamSize });
                  } else if (selectedProject) {
                    setSelectedProject({ ...selectedProject, teamSize });
                  }
                }}
                min="1"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Project Link</label>
            <input
              type="url"
              value={project.link}
              onChange={(e) => {
                if (isNew) {
                  setNewProject({ ...newProject, link: e.target.value });
                } else if (selectedProject) {
                  setSelectedProject({ ...selectedProject, link: e.target.value });
                }
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-8">
            <button
              onClick={() => isNew ? setIsNewProjectOpen(false) : setIsEditProjectOpen(false)}
              className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isNew ? handleCreateProject : handleEditProject}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-colors font-medium"
            >
              {isNew ? 'Create Project' : 'Save Changes'}
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
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg ${typeColor}`}>
                    <TypeIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {project.type === 'web' ? 'Web App' : 'Mobile App'}
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
                <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-white/10"
                    >
                      {tech.name}
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
                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
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