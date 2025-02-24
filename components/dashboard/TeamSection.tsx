"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Search,
  Filter,
  Shield,
  Users,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Image from "next/image";
import UserService from "../user/service/UserService";
import UserResponse from "../user/dto/UserResponse";
import { TeamPosition } from "../user/dto/TeamPosition";
import CreateUserRequest from "../user/dto/CreateUserRequest";
import { UserRole } from "../user/dto/UserRole";
import UpdateUserRequest from "../user/dto/UpdateUserRequest";

const TeamSection = () => {
  const userService = new UserService();
  const [team, setTeam] = useState<UserResponse[]>([]);
  const [filteredTeam, setFilteredTeam] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UserResponse | null>(null);
  
  // Form states
  const [newSkill, setNewSkill] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<TeamPosition | "ALL">("ALL");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  const [newMember, setNewMember] = useState<CreateUserRequest>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    userRole: UserRole.UTILIZATOR,
    location: "",
    experience: "",
    teamPosition: TeamPosition.JUNIOR_DEVELOPER,
    skills: []
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [team, searchQuery, positionFilter, locationFilter, experienceFilter]);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setTeam(data);
      setFilteredTeam(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch team members");
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionColor = (position: TeamPosition | undefined) => {
    switch (position) {
      case TeamPosition.SENIOR_DEVELOPER:
        return "bg-purple-500/20 text-purple-500";
      case TeamPosition.LEAD:
        return "bg-yellow-500/20 text-yellow-500";
      case TeamPosition.MANAGER:
        return "bg-blue-500/20 text-blue-500";
      case TeamPosition.INTERN:
        return "bg-green-500/20 text-green-500";
      case TeamPosition.JUNIOR_DEVELOPER:
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getPositionLabel = (position: TeamPosition) => {
    return position.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const applyFilters = () => {
    let filtered = [...team];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.fullName.toLowerCase().includes(query) ||
        member.teamPosition?.toLowerCase().includes(query) ||
        member.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (positionFilter !== "ALL") {
      filtered = filtered.filter(member => member.teamPosition === positionFilter);
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(member => member.location === locationFilter);
    }

    if (experienceFilter !== "all") {
      filtered = filtered.filter(member => {
        const years = parseInt(member.experience || "0");
        switch (experienceFilter) {
          case "junior": return years <= 2;
          case "mid": return years > 2 && years <= 5;
          case "senior": return years > 5;
          default: return true;
        }
      });
    }

    setFilteredTeam(filtered);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarFile(undefined);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddSkill = (isNew: boolean) => {
    if (!newSkill.trim()) return;
    
    if (isNew) {
      setNewMember({
        ...newMember,
        skills: [...(newMember.skills || []), newSkill.trim()],
      });
    } else if (selectedMember) {
      setSelectedMember({
        ...selectedMember,
        skills: [...(selectedMember.skills || []), newSkill.trim()],
      });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string, isNew: boolean) => {
    if (isNew) {
      setNewMember({
        ...newMember,
        skills: newMember.skills?.filter(skill => skill !== skillToRemove) || [],
      });
    } else if (selectedMember) {
      setSelectedMember({
        ...selectedMember,
        skills: selectedMember.skills?.filter(skill => skill !== skillToRemove) || [],
      });
    }
  };

  const handleCreateMember = async () => {
    try {
      const created = await userService.createUser(newMember, avatarFile);
      setTeam(prev => [...prev, created]);
      setNewMember({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        userRole: UserRole.UTILIZATOR,
        location: "",
        experience: "",
        teamPosition: TeamPosition.JUNIOR_DEVELOPER,
        skills: []
      });
      setAvatarFile(undefined);
      setImagePreview(null);
      setIsNewMemberOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create team member");
    }
  };

  const handleEditMember = async () => {
    if (!selectedMember) return;
    
    try {
      const updateRequest: UpdateUserRequest = {
        fullName: selectedMember.fullName,
        phone: selectedMember.phone,
        email: selectedMember.email,
        location: selectedMember.location,
        experience: selectedMember.experience,
        teamPosition: selectedMember.teamPosition,
        skills: selectedMember.skills
      };

      const updated = await userService.updateUser(
        selectedMember.id,
        updateRequest,
        avatarFile
      );

      setTeam(prev => prev.map(member => 
        member.id === updated.id ? updated : member
      ));
      
      setIsEditMemberOpen(false);
      setAvatarFile(undefined);
      setImagePreview(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update team member");
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    try {
      await userService.deleteUser(selectedMember.id);
      setTeam(prev => prev.filter(member => member.id !== selectedMember.id));
      setSelectedMember(null);
      setIsDeleteOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete team member");
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
                !imagePreview 
                  ? "bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center"
                  : ""
              }`}
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview || ""}
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
            {(imagePreview ) && (
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
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
                Full Name
              </label>
              <input
                type="text"
                value={member.fullName}
                onChange={(e) => {
                  if (isNew) {
                    setNewMember({ ...newMember, fullName: e.target.value });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      fullName: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="Enter full name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Team Position
              </label>
              <select
                value={member.teamPosition}
                onChange={(e) => {
                  const position = e.target.value as TeamPosition;
                  if (isNew) {
                    setNewMember({ ...newMember, teamPosition: position });
                  } else if (selectedMember) {
                    setSelectedMember({
                      ...selectedMember,
                      teamPosition: position,
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50 [&>option]:bg-gray-900"
              >
                {Object.values(TeamPosition).map((position) => (
                  <option key={position} value={position}>
                    {getPositionLabel(position)}
                  </option>
                ))}
              </select>
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
                placeholder="e.g., 5 years"
              />
            </div>

            {isNew && (
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Password
                </label>
                <input
                  type="password"
                  onChange={(e) => {
                    setNewMember({
                      ...newMember,
                      password: e.target.value,
                    });
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                  placeholder="Enter password..."
                />
              </div>
            )}
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
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-white mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-4 p-2 bg-white/5 border border-white/10 rounded-lg min-h-[50px]">
            {member.skills?.map((skill, index) => (
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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          <p className="text-gray-400 mt-2">
            {filteredTeam.length} of {team.length} members
          </p>
        </div>

        <button
          onClick={() => setIsNewMemberOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 transition-all w-full lg:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value as TeamPosition | "ALL")}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-900 focus:outline-none focus:border-yellow-500/50"
        >
          <option value="ALL">All Positions</option>
          {Object.values(TeamPosition).map(position => (
            <option key={position} value={position}>
              {getPositionLabel(position)}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-900 focus:outline-none focus:border-yellow-500/50"
        >
          <option value="all">All Locations</option>
          {Array.from(new Set(team.map(member => member.location))).map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-900 focus:outline-none focus:border-yellow-500/50"
        >
          <option value="all">All Experience</option>
          <option value="junior">Junior (0-2 years)</option>
          <option value="mid">Mid-Level (3-5 years)</option>
          <option value="senior">Senior (5+ years)</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        </div>
      ) : (
        /* Team Members Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTeam.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="p-6 flex gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5">
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={member.fullName}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white/40" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {member.fullName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPositionColor(member.teamPosition)}`}>
                          {member.teamPosition && getPositionLabel(member.teamPosition)}
                        </span>
                        {member.userRole === UserRole.ADMIN && (
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-500 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
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

                  <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/40" />
                      <span>{member.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span className="truncate">{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/40" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-white/40" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                  </div>

                  {member.skills && member.skills.length > 0 && (
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
      )}

      {/* Modals */}
      <Modal
        isOpen={isNewMemberOpen}
        onClose={() => {
          setIsNewMemberOpen(false);
          setImagePreview(null);
          setAvatarFile(undefined);
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
          setAvatarFile(undefined);
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
        message={`Are you sure you want to remove ${selectedMember?.fullName} from the team? This action cannot be undone.`}
      />
    </div>
  );
};

export default TeamSection;