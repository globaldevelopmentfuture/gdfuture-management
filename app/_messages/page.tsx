'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import DeleteDialog from '@/components/ui/DeleteDialog';

interface Message {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  unread?: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      content: 'Hey, can we discuss the new project requirements?',
      timestamp: '2024-03-10T10:30:00',
      unread: true
    },
    {
      id: 2,
      sender: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
      content: 'The latest designs are ready for review.',
      timestamp: '2024-03-10T09:15:00'
    }
  ]);

  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [isEditMessageOpen, setIsEditMessageOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({
    sender: '',
    avatar: '',
    content: ''
  });

  const handleCreateMessage = () => {
    const message: Message = {
      id: messages.length + 1,
      ...newMessage,
      timestamp: new Date().toISOString(),
      unread: true
    };
    setMessages([...messages, message]);
    setNewMessage({
      sender: '',
      avatar: '',
      content: ''
    });
    setIsNewMessageOpen(false);
  };

  const handleEditMessage = () => {
    if (selectedMessage) {
      setMessages(messages.map(m => 
        m.id === selectedMessage.id ? selectedMessage : m
      ));
      setIsEditMessageOpen(false);
    }
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      setMessages(messages.filter(m => m.id !== selectedMessage.id));
      setSelectedMessage(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-400">Communicate with your team</p>
        </div>
        
        <button
          onClick={() => setIsNewMessageOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-5 h-5" />
          <span>New Message</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50"
        />
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className="group bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-4 hover:border-yellow-500/50 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start space-x-4">
              <img
                src={message.avatar}
                alt={message.sender}
                className="w-10 h-10 rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium flex items-center">
                      {message.sender}
                      {message.unread && (
                        <span className="ml-2 w-2 h-2 bg-yellow-500 rounded-full" />
                      )}
                    </h3>
                    <p className="text-sm text-white/60">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        setIsEditMessageOpen(true);
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                      title="Edit message"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        setIsDeleteOpen(true);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-white/80">{message.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Message Modal */}
      <Modal
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        title="New Message"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Sender Name
            </label>
            <input
              type="text"
              value={newMessage.sender}
              onChange={(e) => setNewMessage({ ...newMessage, sender: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter your name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={newMessage.avatar}
              onChange={(e) => setNewMessage({ ...newMessage, avatar: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter avatar URL..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Message
            </label>
            <textarea
              rows={4}
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Type your message..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsNewMessageOpen(false)}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateMessage}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Message Modal */}
      <Modal
        isOpen={isEditMessageOpen}
        onClose={() => setIsEditMessageOpen(false)}
        title="Edit Message"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Sender Name
            </label>
            <input
              type="text"
              value={selectedMessage?.sender || ''}
              onChange={(e) => setSelectedMessage(selectedMessage ? {
                ...selectedMessage,
                sender: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={selectedMessage?.avatar || ''}
              onChange={(e) => setSelectedMessage(selectedMessage ? {
                ...selectedMessage,
                avatar: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Message
            </label>
            <textarea
              rows={4}
              value={selectedMessage?.content || ''}
              onChange={(e) => setSelectedMessage(selectedMessage ? {
                ...selectedMessage,
                content: e.target.value
              } : null)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsEditMessageOpen(false)}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditMessage}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteMessage}
        title="Delete Message"
        message={`Are you sure you want to delete this message from ${selectedMessage?.sender}? This action cannot be undone.`}
      />
    </div>
  );
}