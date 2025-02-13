"use client";

import React, { useState } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  icon?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Project Assigned',
      message: 'You have been assigned to the E-Commerce Platform project',
      time: '5 minutes ago',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Meeting Reminder',
      message: 'Team standup meeting in 15 minutes',
      time: '10 minutes ago',
      read: false,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Task Completed',
      message: 'Frontend development phase completed successfully',
      time: '1 hour ago',
      read: true,
      type: 'success'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="h-16 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between max-w-[2000px] mx-auto">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white/80" />
          </button>
          
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-white placeholder-white/30 w-64 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 hover:bg-white/5 rounded-lg relative group"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-500 rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-96 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-white/[0.02]' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 mt-2 rounded-full ${getNotificationColor(notification.type)}`} />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-white/60 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg transition-colors group"
            >
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white group-hover:text-white/90">John Doe</div>
                <div className="text-xs text-white/50">Administrator</div>
              </div>
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg rotate-45 blur opacity-40" />
                <div className="relative w-full h-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-white/60" />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;