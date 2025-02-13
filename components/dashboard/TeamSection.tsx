"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  Clock,
  Upload,
  User,
  X,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  avatar: string | null;
  experience: string;
  skills: string[];
  projects: number;
}

const TeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Developer",
      email: "sarah@example.com",
      phone: "+1 234 567 890",
      location: "New York, USA",
      avatar: null,
      experience: "8 years",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      projects: 24,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "UI/UX Designer",
      email: "michael@example.com",
      phone: "+1 234 567 891",
      location: "San Francisco, USA",
      avatar: null,
      experience: "5 years",
      skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
      projects: 18,
    },
  ]);

  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newMember, setNewMember] = useState<Omit<TeamMember, "id">>({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    avatar: null,
    experience: "",
    skills: [],
    projects: 0,
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    isNew: boolean
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        if (isNew) {
          setNewMember({ ...newMember, avatar: preview });
        } else if (selectedMember) {
          setSelectedMember({ ...selectedMember, avatar: preview });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (isNew: boolean) => {
    if (isNew) {
      setNewMember({ ...newMember, avatar: null });
    } else if (selectedMember) {
      setSelectedMember({ ...selectedMember, avatar: null });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddSkill = (isNew: boolean) => {
    if (newSkill.trim()) {
      if (isNew) {
        setNewMember({
          ...newMember,
          skills: [...newMember.skills, newSkill.trim()],
        });
      } else if (selectedMember) {
        setSelectedMember({
          ...selectedMember,
          skills: [...selectedMember.skills, newSkill.trim()],
        });
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string, isNew: boolean) => {
    if (isNew) {
      setNewMember({
        ...newMember,
        skills: newMember.skills.filter((skill) => skill !== skillToRemove),
      });
    } else if (selectedMember) {
      setSelectedMember({
        ...selectedMember,
        skills: selectedMember.skills.filter(
          (skill) => skill !== skillToRemove
        ),
      });
    }
  };

  const handleCreateMember = () => {
    const member: TeamMember = {
      id: team.length + 1,
      ...newMember,
    };
    setTeam([...team, member]);
    setNewMember({
      name: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      avatar: null,
      experience: "",
      skills: [],
      projects: 0,
    });
    setImagePreview(null);
    setIsNewMemberOpen(false);
  };

  const handleEditMember = () => {
    if (selectedMember) {
      setTeam(
        team.map((m) => (m.id === selectedMember.id ? selectedMember : m))
      );
      setIsEditMemberOpen(false);
      setImagePreview(null);
    }
  };

  const handleDeleteMember = () => {
    if (selectedMember) {
      setTeam(team.filter((m) => m.id !== selectedMember.id));
      setSelectedMember(null);
      setIsDeleteOpen(false);
    }
  };

  const renderMemberForm = (isNew: boolean) => {
    const member = isNew ? newMember : selectedMember;
    if (!member) return null;

    return (
      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-white mb-2">Avatar</label>
          <div className="relative">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-full overflow-hidden cursor-pointer ${
                !member.avatar
                  ? "bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center"
                  : ""
              }`}
            >
              {member.avatar ? (
                <>
                  <Image
                    src={member.avatar}
                    alt="Avatar preview"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <User className="w-8 h-8 text-white/40 mb-2" />
                  <span className="text-xs text-white/40">Click to upload</span>
                </div>
              )}
            </div>
            {member.avatar && (
              <button
                onClick={() => handleRemoveImage(isNew)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, isNew)}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Name
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => {
                  if (isNew) {
                    setNewMember({ ...newMember, name: e.target.value });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      name: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="Enter name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Role
              </label>
              <input
                type="text"
                value={member.role}
                onChange={(e) => {
                  if (isNew) {
                    setNewMember({ ...newMember, role: e.target.value });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      role: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="Enter role..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Experience
              </label>
              <input
                type="text"
                value={member.experience}
                onChange={(e) => {
                  if (isNew) {
                    setNewMember({
                      ...newMember,
                      experience: e.target.value,
                    });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      experience: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="e.g., 8 years"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                value={member.email}
                onChange={(e) => {
                  if (isNew) {
                    setNewMember({ ...newMember, email: e.target.value });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      email: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="Enter email..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={member.phone}
                onChange={(e) => {
                  if (isNew) {
                    setNewMember({ ...newMember, phone: e.target.value });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      phone: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="Enter phone number..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Location
              </label>
              <input
                type="text"
                value={member.location}
                onChange={(e) => {
                  if (isNew) {
                    setNewMember({ ...newMember, location: e.target.value });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      location: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="Enter location..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Projects Completed
              </label>
              <input
                type="number"
                value={member.projects}
                onChange={(e) => {
                  const projects = parseInt(e.target.value);
                  if (isNew) {
                    setNewMember({ ...newMember, projects });
                  } else if (selectedMember) {
                    setSelectedMember({ ...selectedMember, projects });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-white mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-4 p-2 bg-white/5 border border-white/10 rounded-lg">
            {member.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-200 border border-yellow-500/20"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill, isNew)}
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
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(isNew);
                }
              }}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Add a skill..."
            />
            <button
              onClick={() => handleAddSkill(isNew)}
              className="px-6 py-3 bg-yellow-500/20 text-yellow-200 rounded-lg hover:bg-yellow-500/30 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            onClick={() =>
              isNew ? setIsNewMemberOpen(false) : setIsEditMemberOpen(false)
            }
            className="px-6 py-3 bg-gray-700/70 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={isNew ? handleCreateMember : handleEditMember}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors font-medium"
          >
            {isNew ? "Add Member" : "Save Changes"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          <p className="text-gray-400">
            Manage your team and their roles efficiently.
          </p>
        </div>

        <button
          onClick={() => setIsNewMemberOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {team.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6 flex gap-4">
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-32 h-32 rounded-full overflow-hidden cursor-pointer ${
                    !imagePreview && !member.avatar
                      ? "bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center"
                      : ""
                  }`}
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Avatar preview"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt="Avatar preview"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <User className="w-8 h-8 text-white/40 mb-2" />
                      <span className="text-xs text-white/40">
                        Click to upload
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {member.name}
                    </h3>
                    <p className="text-yellow-500">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setImagePreview(member.avatar);
                        setIsEditMemberOpen(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setIsDeleteOpen(true);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{member.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>
                {member.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/5 text-white/80 text-xs rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isNewMemberOpen}
        onClose={() => {
          setIsNewMemberOpen(false);
          setImagePreview(null);
        }}
        title="Add Team Member"
      >
        {renderMemberForm(true)}
      </Modal>

      <Modal
        isOpen={isEditMemberOpen}
        onClose={() => {
          setIsEditMemberOpen(false);
          setImagePreview(null);
        }}
        title="Edit Team Member"
      >
        {renderMemberForm(false)}
      </Modal>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteMember}
        title="Delete Team Member"
        message={`Are you sure you want to remove ${selectedMember?.name} from the team? This action cannot be undone.`}
      />
    </div>
  );
};

export default TeamSection;
