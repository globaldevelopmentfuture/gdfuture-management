"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Briefcase,
  Code,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from "lucide-react";

const activityData = [
  { name: "Jan", projects: 4, services: 3 },
  { name: "Feb", projects: 6, services: 4 },
  { name: "Mar", projects: 8, services: 6 },
  { name: "Apr", projects: 5, services: 5 },
  { name: "May", projects: 7, services: 8 },
  { name: "Jun", projects: 9, services: 7 },
];

const revenueData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 6000 },
  { name: "Thu", value: 8000 },
  { name: "Fri", value: 5000 },
  { name: "Sat", value: 9000 },
  { name: "Sun", value: 7000 },
];

const stats = [
  {
    id: "1",
    title: "Active Projects",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Briefcase,
    color: "from-blue-500 to-blue-600",
    lightColor: "text-blue-500",
    description: "Projects in progress",
    details: {
      onTrack: "8",
      delayed: "2",
      completed: "2",
    },
  },
  {
    id: "2",
    title: "Services Offered",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Code,
    color: "from-emerald-500 to-emerald-600",
    lightColor: "text-emerald-500",
    description: "Active service offerings",
    details: {
      software: "5",
      marketing: "2",
      consulting: "1",
    },
  },
  {
    id: "3",
    title: "Team Members",
    value: "24",
    change: "+4",
    trend: "up",
    icon: Users,
    color: "from-yellow-500 to-yellow-600",
    lightColor: "text-yellow-500",
    description: "Active team members",
    details: {
      developers: "16",
      designers: "4",
      managers: "4",
    },
  },
  {
    id: "4",
    title: "Project Revenue",
    value: "$128.5K",
    change: "+15.2%",
    trend: "up",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600",
    lightColor: "text-purple-500",
    description: "Total project value",
    details: {
      thisMonth: "$45.2K",
      lastMonth: "$38.6K",
      projected: "$52.4K",
    },
  },
];
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-white/70">
            {entry.name}:{" "}
            <span className={index === 0 ? "text-yellow-500" : "text-blue-400"}>
              {entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardStats = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isExpanded = expandedCard === stat.id;

          return (
            <motion.div
              key={stat.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl ${
                isExpanded ? "z-10 shadow-2xl" : ""
              }`}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedCard(isExpanded ? null : stat.id)}
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`relative p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 rounded-xl blur" />
                      <Icon className="relative w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex items-center space-x-1 text-sm ${
                          stat.trend === "up"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">{stat.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.title}</div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(stat.details).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="bg-white/5 rounded-lg p-3"
                                >
                                  <div className="text-xs text-white/40 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </div>
                                  <div className="text-sm font-semibold text-white mt-1">
                                    {value}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Projects & Services Overview
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-white/60">Projects</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-white/60">Services</span>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorProjects"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorServices"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="services"
                    name="Services"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorServices)"
                  />
                  <Area
                    type="monotone"
                    dataKey="projects"
                    name="Projects"
                    stroke="#EAB308"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProjects)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Revenue Distribution
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-white/60">Revenue</span>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#EAB308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;
