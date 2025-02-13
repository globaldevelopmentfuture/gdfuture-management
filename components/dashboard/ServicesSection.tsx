"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Code, 
  Target,
  Briefcase,
  Pencil, 
  Trash2,
  Check,
  X
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import DeleteDialog from '@/components/ui/DeleteDialog';

type ServiceCategory = 'software' | 'marketing' | 'consulting';

interface Service {
  id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  startingPrice: number;
  features: string[];
  icon: typeof Code | typeof Target | typeof Briefcase;
}

const ServiceSection = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'Custom Software Development',
      description: 'End-to-end software solutions tailored to your business needs',
      category: 'software',
      startingPrice: 5000,
      icon: Code,
      features: [
        'Custom Web Applications',
        'API Development',
        'Cloud Integration',
        'Database Design'
      ]
    },
    {
      id: 2,
      name: 'Digital Marketing',
      description: 'Comprehensive digital marketing strategies to grow your business',
      category: 'marketing',
      startingPrice: 2500,
      icon: Target,
      features: [
        'SEO Optimization',
        'Social Media Marketing',
        'Content Strategy',
        'Email Marketing'
      ]
    }
  ]);

  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newFeature, setNewFeature] = useState('');
  
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    category: 'software',
    startingPrice: 0,
    icon: Code,
    features: []
  });

  const handleAddFeature = (isNew: boolean) => {
    if (newFeature.trim()) {
      if (isNew) {
        setNewService({
          ...newService,
          features: [...newService.features, newFeature.trim()]
        });
      } else if (selectedService) {
        setSelectedService({
          ...selectedService,
          features: [...selectedService.features, newFeature.trim()]
        });
      }
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string, isNew: boolean) => {
    if (isNew) {
      setNewService({
        ...newService,
        features: newService.features.filter(f => f !== featureToRemove)
      });
    } else if (selectedService) {
      setSelectedService({
        ...selectedService,
        features: selectedService.features.filter(f => f !== featureToRemove)
      });
    }
  };

  const handleCreateService = () => {
    const service: Service = {
      id: services.length + 1,
      ...newService
    };
    setServices([...services, service]);
    setNewService({
      name: '',
      description: '',
      category: 'software',
      startingPrice: 0,
      icon: Code,
      features: []
    });
    setIsNewServiceOpen(false);
  };

  const handleEditService = () => {
    if (selectedService) {
      setServices(services.map(s => 
        s.id === selectedService.id ? selectedService : s
      ));
      setIsEditServiceOpen(false);
    }
  };

  const handleDeleteService = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      setSelectedService(null);
      setIsDeleteOpen(false);
    }
  };

  const getCategoryIcon = (category: ServiceCategory) => {
    switch (category) {
      case 'software':
        return Code;
      case 'marketing':
        return Target;
      case 'consulting':
        return Briefcase;
    }
  };

  const getCategoryColor = (category: ServiceCategory) => {
    switch (category) {
      case 'software':
        return 'from-blue-500/20 to-blue-600/20 text-blue-500';
      case 'marketing':
        return 'from-emerald-500/20 to-emerald-600/20 text-emerald-500';
      case 'consulting':
        return 'from-purple-500/20 to-purple-600/20 text-purple-500';
    }
  };

  const renderServiceForm = (isNew: boolean) => {
    const service = isNew ? newService : selectedService;
    if (!service) return null;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-white mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={service.name}
              onChange={(e) => {
                if (isNew) {
                  setNewService({ ...newService, name: e.target.value });
                } else if (selectedService) {
                  setSelectedService({ ...selectedService, name: e.target.value });
                }
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter service name..."
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={service.description}
              onChange={(e) => {
                if (isNew) {
                  setNewService({ ...newService, description: e.target.value });
                } else if (selectedService) {
                  setSelectedService({ ...selectedService, description: e.target.value });
                }
              }}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 resize-none"
              placeholder="Enter service description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              value={service.category}
              onChange={(e) => {
                const category = e.target.value as ServiceCategory;
                if (isNew) {
                  setNewService({ 
                    ...newService, 
                    category,
                    icon: getCategoryIcon(category)
                  });
                } else if (selectedService) {
                  setSelectedService({ 
                    ...selectedService, 
                    category,
                    icon: getCategoryIcon(category)
                  });
                }
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
            >
              <option value="software">Software Development</option>
              <option value="marketing">Digital Marketing</option>
              <option value="consulting">Business Consulting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Starting Price ($)
            </label>
            <input
              type="number"
              value={service.startingPrice}
              onChange={(e) => {
                const startingPrice = parseInt(e.target.value);
                if (isNew) {
                  setNewService({ ...newService, startingPrice });
                } else if (selectedService) {
                  setSelectedService({ ...selectedService, startingPrice });
                }
              }}
              min="0"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Enter starting price..."
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">
              Features
            </label>
            <span className="text-xs text-white/60">
              {service.features.length} features added
            </span>
          </div>

          <div className="space-y-2">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
              >
                <div className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-white">{feature}</span>
                </div>
                <button
                  onClick={() => handleRemoveFeature(feature, isNew)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white/60 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature(isNew);
                }
              }}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Add a feature..."
            />
            <button
              onClick={() => handleAddFeature(isNew)}
              className="px-6 py-3 bg-yellow-500/20 text-yellow-500 rounded-xl hover:bg-yellow-500/30 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={() => isNew ? setIsNewServiceOpen(false) : setIsEditServiceOpen(false)}
            className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={isNew ? handleCreateService : handleEditService}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-colors font-medium"
          >
            {isNew ? 'Create Service' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Services</h1>
          <p className="text-gray-400">Manage your service offerings</p>
        </div>
        
        <button
          onClick={() => setIsNewServiceOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          const categoryColor = getCategoryColor(service.category);
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group relative bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-white/60 mt-1 mb-4">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsEditServiceOpen(true);
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsDeleteOpen(true);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                    >
                      <Check className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-white/60">Starting from</span>
                    <span className="text-2xl font-bold text-white">
                      ${service.startingPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal
        isOpen={isNewServiceOpen}
        onClose={() => setIsNewServiceOpen(false)}
        title="Add New Service"
      >
        {renderServiceForm(true)}
      </Modal>

      <Modal
        isOpen={isEditServiceOpen}
        onClose={() => setIsEditServiceOpen(false)}
        title="Edit Service"
      >
        {renderServiceForm(false)}
      </Modal>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteService}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ServiceSection;