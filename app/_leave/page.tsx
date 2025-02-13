"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import { useState } from "react";

interface LeaveRequest {
  id: number;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Approved" | "Declined";
  avatar: string;
}

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employee: "Sarah Johnson",
      type: "Vacation",
      startDate: "2024-03-15",
      endDate: "2024-03-22",
      status: "Pending",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      employee: "Michael Chen",
      type: "Sick Leave",
      startDate: "2024-03-10",
      endDate: "2024-03-11",
      status: "Approved",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    },
  ]);

  const [isNewLeaveOpen, setIsNewLeaveOpen] = useState(false);
  const [isEditLeaveOpen, setIsEditLeaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [newLeave, setNewLeave] = useState({
    employee: "",
    type: "Vacation",
    startDate: "",
    endDate: "",
    avatar: "",
  });

  const handleCreateLeave = () => {
    const leave: LeaveRequest = {
      id: leaveRequests.length + 1,
      ...newLeave,
      status: "Pending",
    };
    setLeaveRequests([...leaveRequests, leave]);
    setNewLeave({
      employee: "",
      type: "Vacation",
      startDate: "",
      endDate: "",
      avatar: "",
    });
    setIsNewLeaveOpen(false);
  };

  const handleEditLeave = () => {
    if (selectedLeave) {
      setLeaveRequests(
        leaveRequests.map((l) =>
          l.id === selectedLeave.id ? selectedLeave : l
        )
      );
      setIsEditLeaveOpen(false);
    }
  };

  const handleDeleteLeave = () => {
    if (selectedLeave) {
      setLeaveRequests(leaveRequests.filter((l) => l.id !== selectedLeave.id));
      setSelectedLeave(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Leave Management
          </h1>
          <p className="text-gray-400">
            Track and manage employee leave requests
          </p>
        </div>

        <button
          onClick={() => setIsNewLeaveOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-5 h-5" />
          <span>Request Leave</span>
        </button>
      </div>

      <div className="grid gap-6">
        {leaveRequests.map((request) => (
          <motion.div
            key={request.id}
            className="group bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                src={request.avatar}
                alt={request.employee}
                className="w-12 h-12 rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {request.employee}
                    </h3>
                    <p className="text-yellow-500">{request.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        request.status === "Approved"
                          ? "bg-green-500/10 text-green-500"
                          : request.status === "Declined"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {request.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedLeave(request);
                        setIsEditLeaveOpen(true);
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                      title="Edit request"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLeave(request);
                        setIsDeleteOpen(true);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                      title="Delete request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      {Math.ceil(
                        (new Date(request.endDate).getTime() -
                          new Date(request.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Leave Request Modal */}
      <Modal
        isOpen={isNewLeaveOpen}
        onClose={() => setIsNewLeaveOpen(false)}
        title="Request Leave"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Employee Name
            </label>
            <input
              type="text"
              value={newLeave.employee}
              onChange={(e) =>
                setNewLeave({ ...newLeave, employee: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter your name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Leave Type
            </label>
            <select
              value={newLeave.type}
              onChange={(e) =>
                setNewLeave({ ...newLeave, type: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            >
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={newLeave.startDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, startDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                End Date
              </label>
              <input
                type="date"
                value={newLeave.endDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, endDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={newLeave.avatar}
              onChange={(e) =>
                setNewLeave({ ...newLeave, avatar: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter avatar URL..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsNewLeaveOpen(false)}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateLeave}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Leave Request Modal */}
      <Modal
        isOpen={isEditLeaveOpen}
        onClose={() => setIsEditLeaveOpen(false)}
        title="Edit Leave Request"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Employee Name
            </label>
            <input
              type="text"
              value={selectedLeave?.employee || ""}
              onChange={(e) =>
                setSelectedLeave(
                  selectedLeave
                    ? {
                        ...selectedLeave,
                        employee: e.target.value,
                      }
                    : null
                )
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Leave Type
            </label>
            <select
              value={selectedLeave?.type || ""}
              onChange={(e) =>
                setSelectedLeave(
                  selectedLeave
                    ? {
                        ...selectedLeave,
                        type: e.target.value,
                      }
                    : null
                )
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            >
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={selectedLeave?.startDate || ""}
                onChange={(e) =>
                  setSelectedLeave(
                    selectedLeave
                      ? {
                          ...selectedLeave,
                          startDate: e.target.value,
                        }
                      : null
                  )
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                End Date
              </label>
              <input
                type="date"
                value={selectedLeave?.endDate || ""}
                onChange={(e) =>
                  setSelectedLeave(
                    selectedLeave
                      ? {
                          ...selectedLeave,
                          endDate: e.target.value,
                        }
                      : null
                  )
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Status
            </label>
            <select
              value={selectedLeave?.status || ""}
              onChange={(e) =>
                setSelectedLeave(
                  selectedLeave
                    ? {
                        ...selectedLeave,
                        status: e.target.value as
                          | "Pending"
                          | "Approved"
                          | "Declined",
                      }
                    : null
                )
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={selectedLeave?.avatar || ""}
              onChange={(e) =>
                setSelectedLeave(
                  selectedLeave
                    ? {
                        ...selectedLeave,
                        avatar: e.target.value,
                      }
                    : null
                )
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditLeaveOpen(false)}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditLeave}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteLeave}
        title="Delete Leave Request"
        message={`Are you sure you want to delete ${selectedLeave?.employee}'s leave request? This action cannot be undone.`}
      />
    </div>
  );
}
