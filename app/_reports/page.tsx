'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart as BarChartIcon, 
  Download, 
  Filter,
  Plus,
  FileText,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import Modal from '@/components/ui/Modal';

const data = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
];

const growthData = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 6000 },
  { month: 'Apr', value: 8000 },
  { month: 'May', value: 5000 },
  { month: 'Jun', value: 9000 },
];

export default function ReportsPage() {
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);

  const reports = [
    {
      id: 1,
      title: 'Q1 Financial Summary',
      type: 'Financial',
      date: '2024-03-01',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Employee Performance Review',
      type: 'HR',
      date: '2024-02-28',
      status: 'In Progress'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Reports</h1>
          <p className="text-gray-400">Analytics and business insights</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
          <button
            onClick={() => setIsNewReportOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Revenue', value: '$45,231', icon: TrendingUp, change: '+12.5%' },
          { title: 'Active Users', value: '2,543', icon: Users, change: '+8.2%' },
          { title: 'Reports Generated', value: '45', icon: FileText, change: '+23.1%' },
          { title: 'Avg. Response Time', value: '1.2s', icon: Calendar, change: '-5.4%' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Icon className="w-6 h-6 text-yellow-500" />
                </div>
                <span className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-white/60">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue vs Expenses</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="revenue" fill="#EAB308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Growth Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EAB308"
                  strokeWidth={2}
                  dot={{ fill: '#EAB308' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Reports</h3>
        <div className="space-y-4">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <BarChartIcon className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{report.title}</h4>
                  <p className="text-sm text-white/60">
                    {report.type} • {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  report.status === 'Completed'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {report.status}
                </span>
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Report Modal */}
      <Modal
        isOpen={isNewReportOpen}
        onClose={() => setIsNewReportOpen(false)}
        title="Generate New Report"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Report Type
            </label>
            <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50">
              <option value="financial">Financial Report</option>
              <option value="hr">HR Report</option>
              <option value="sales">Sales Report</option>
              <option value="performance">Performance Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date Range
            </label>
            <div className="flex space-x-3">
              <input
                type="date"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Additional Notes
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter any additional notes..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsNewReportOpen(false)}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors">
              <BarChartIcon className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}