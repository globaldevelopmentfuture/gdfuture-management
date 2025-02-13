import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Clock, DollarSign, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import DeleteDialog from '@/components/ui/DeleteDialog';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  applicants: number;
}

const JobsSection = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      posted: '2024-02-20',
      applicants: 45
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'New York, USA',
      type: 'Full-time',
      salary: '$70,000 - $90,000',
      posted: '2024-02-18',
      applicants: 32
    }
  ]);

  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary: '',
    posted: new Date().toISOString().split('T')[0]
  });

  const handleCreateJob = () => {
    const job: Job = {
      id: jobs.length + 1,
      ...newJob,
      applicants: 0
    };
    setJobs([...jobs, job]);
    setNewJob({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      salary: '',
      posted: new Date().toISOString().split('T')[0]
    });
    setIsNewJobOpen(false);
  };

  const handleEditJob = () => {
    if (selectedJob) {
      setJobs(jobs.map(j => 
        j.id === selectedJob.id ? selectedJob : j
      ));
      setIsEditJobOpen(false);
    }
  };

  const handleDeleteJob = () => {
    if (selectedJob) {
      setJobs(jobs.filter(j => j.id !== selectedJob.id));
      setSelectedJob(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Job Listings</h1>
          <p className="text-gray-400">Manage your open positions</p>
        </div>
        
        <button
          onClick={() => setIsNewJobOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-5 h-5" />
          <span>Post Job</span>
        </button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            className="group bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {job.title}
                </h3>
                <p className="text-yellow-500 text-sm">{job.department}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-white/5 text-white rounded-full text-sm">
                  {job.applicants} applicants
                </span>
                <button 
                  onClick={() => {
                    setSelectedJob(job);
                    setIsEditJobOpen(true);
                  }}
                  className="p-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Edit job"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setIsDeleteOpen(true);
                  }}
                  className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  title="Delete job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{job.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{job.type}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{job.salary}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-400 gap-2">
              <span>Posted on {new Date(job.posted).toLocaleDateString()}</span>
              <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
                View Applications
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Job Modal */}
      <Modal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
        title="Post New Job"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter job title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Department
            </label>
            <input
              type="text"
              value={newJob.department}
              onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter department..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Location
            </label>
            <input
              type="text"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter location..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Employment Type
              </label>
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Salary Range
              </label>
              <input
                type="text"
                value={newJob.salary}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsNewJobOpen(false)}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateJob}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Post Job
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        isOpen={isEditJobOpen}
        onClose={() => setIsEditJobOpen(false)}
        title="Edit Job"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={selectedJob?.title || ''}
              onChange={(e) => setSelectedJob(selectedJob ? {
                ...selectedJob,
                title: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Department
            </label>
            <input
              type="text"
              value={selectedJob?.department || ''}
              onChange={(e) => setSelectedJob(selectedJob ? {
                ...selectedJob,
                department: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Location
            </label>
            <input
              type="text"
              value={selectedJob?.location || ''}
              onChange={(e) => setSelectedJob(selectedJob ? {
                ...selectedJob,
                location: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Employment Type
              </label>
              <select
                value={selectedJob?.type || ''}
                onChange={(e) => setSelectedJob(selectedJob ? {
                  ...selectedJob,
                  type: e.target.value
                } : null)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Salary Range
              </label>
              <input
                type="text"
                value={selectedJob?.salary || ''}
                onChange={(e) => setSelectedJob(selectedJob ? {
                  ...selectedJob,
                  salary: e.target.value
                } : null)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditJobOpen(false)}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditJob}
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
        onConfirm={handleDeleteJob}
        title="Delete Job"
        message={`Are you sure you want to delete the "${selectedJob?.title}" position? This action cannot be undone.`}
      />
    </div>
  );
};

export default JobsSection;