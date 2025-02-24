"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  ChevronLeft,
  Settings,
  Activity,
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pathname: string;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    id: "projects",
    label: "Projects",
    icon: Building2,
    href: "/projects",
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    href: "/team",
  },
  {
    id: "services",
    label: "Services",
    icon: Briefcase,
    href: "/services",
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  setIsOpen,
  pathname,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? "20rem" : "5rem",
        }}
        className="fixed md:sticky top-0 left-0 z-30 h-screen bg-gray-900/95 backdrop-blur-lg border-r border-white/10 transition-all duration-300 ease-in-out"
      >
        {/* Adăugăm overflow-y-auto pentru a permite scroll-ul intern */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Section */}
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div
              className={`flex items-center space-x-3 ${
                !isOpen && "md:justify-center"
              }`}
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 rounded-xl rotate-45 blur-xl opacity-50" />
                <div className="relative w-full h-full bg-gray-900 rounded-xl flex items-center justify-center border border-white/20">
                  <Activity className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col"
                  >
                    <span className="text-lg font-bold text-white tracking-tight">
                      GDFUTURE
                    </span>
                    <span className="text-xs text-white/50">
                      Enterprise Dashboard
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1">
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="relative group block"
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <div
                      className={`relative flex items-center justify-between ${
                        isOpen ? "px-4" : "px-2"
                      } py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`
                          w-8 h-8 flex items-center justify-center rounded-lg
                          ${
                            isActive
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900"
                              : "bg-transparent"
                          }
                        `}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </div>
                    
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Settings & Support */}
            <div className="p-4 space-y-2">
              {/* Quick Settings */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-gradient-to-b from-white/[0.03] to-white/[0.05] backdrop-blur-xl border border-white/10"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          Quick Settings
                        </div>
                        <div className="text-xs text-white/50">
                          Customize your workspace
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                        View Profile
                      </button>
                      <button className="w-full px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                        Preferences
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
