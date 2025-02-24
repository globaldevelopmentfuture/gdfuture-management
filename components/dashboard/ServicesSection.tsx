"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import OffersService from "../offers/services/OffersService";
import { OfferRequest } from "../offers/dto/OfferRequest";
import { OfferResponse } from "../offers/dto/OfferResponse";
import { OfferType } from "../offers/dto/OfferType";

const ServiceSection: React.FC = () => {
  const offersService = new OffersService();

  // State
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(
    null
  );
  const [newFeature, setNewFeature] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<OfferType | "ALL">("ALL");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const [newOffer, setNewOffer] = useState<OfferRequest>({
    name: "",
    description: "",
    type: OfferType.IT_SOLUTIONS,
    startingPrice: 0,
    icon: "Code",
    features: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await offersService.getAllOffers();
        setOffers(data);
        // Update price range based on actual data
        if (data.length > 0) {
          const prices = data.map((o) => o.startingPrice);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.features?.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesType = selectedType === "ALL" || offer.type === selectedType;

      const matchesPrice =
        offer.startingPrice >= priceRange[0] &&
        offer.startingPrice <= priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [offers, searchQuery, selectedType, priceRange]);

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? (
      <Icon className="w-6 h-6" />
    ) : (
      <LucideIcons.Code className="w-6 h-6" />
    );
  };

  const handleAddFeature = (isNew: boolean) => {
    if (!newFeature.trim()) return;
    if (isNew) {
      setNewOffer((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
    } else if (selectedOffer) {
      setSelectedOffer((prev) =>
        prev
          ? {
              ...prev,
              features: [...(prev.features || []), newFeature.trim()],
            }
          : null
      );
    }
    setNewFeature("");
  };

  const handleRemoveFeature = (feature: string, isNew: boolean) => {
    if (isNew) {
      setNewOffer((prev) => ({
        ...prev,
        features: (prev.features || []).filter((f) => f !== feature),
      }));
    } else if (selectedOffer) {
      setSelectedOffer((prev) =>
        prev
          ? {
              ...prev,
              features: (prev.features || []).filter((f) => f !== feature),
            }
          : null
      );
    }
  };

  const handleCreateOffer = async () => {
    try {
      const created = await offersService.createOffer(newOffer);
      setOffers((prev) => [...prev, created]);
      setNewOffer({
        name: "",
        description: "",
        type: OfferType.IT_SOLUTIONS,
        startingPrice: 0,
        icon: "Code",
        features: [],
      });
      setIsNewOpen(false);
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleEditOffer = async () => {
    if (!selectedOffer) return;
    try {
      const updated = await offersService.updateOffer(selectedOffer.id, {
        name: selectedOffer.name,
        description: selectedOffer.description,
        type: selectedOffer.type,
        startingPrice: selectedOffer.startingPrice,
        icon: selectedOffer.icon,
        features: selectedOffer.features || [],
      });
      setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating offer:", error);
    }
  };

  const handleDeleteOffer = async () => {
    if (!selectedOffer) return;
    try {
      await offersService.deleteOffer(selectedOffer.id);
      setOffers((prev) => prev.filter((o) => o.id !== selectedOffer.id));
      setSelectedOffer(null);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  const getTypeColor = (type: OfferType) => {
    switch (type) {
      case OfferType.IT_SOLUTIONS:
        return "from-blue-500/20 to-blue-600/20 text-blue-500";
      case OfferType.DIGITAL_MARKETING:
        return "from-emerald-500/20 to-emerald-600/20 text-emerald-500";
      default:
        return "from-blue-500/20 to-blue-600/20 text-blue-500";
    }
  };

  const renderForm = (isNew: boolean) => {
    const offer = isNew ? newOffer : selectedOffer;
    if (!offer) return null;

    return (
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Name
          </label>
          <input
            type="text"
            value={offer.name}
            onChange={(e) =>
              isNew
                ? setNewOffer({ ...newOffer, name: e.target.value })
                : setSelectedOffer((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
            }
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
            placeholder="Enter name..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Description
          </label>
          <textarea
            value={offer.description || ""}
            onChange={(e) =>
              isNew
                ? setNewOffer({ ...newOffer, description: e.target.value })
                : setSelectedOffer((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
            }
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
            rows={3}
            placeholder="Enter description..."
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Type
          </label>
          <select
            value={offer.type}
            onChange={(e) =>
              isNew
                ? setNewOffer({
                    ...newOffer,
                    type: e.target.value as OfferType,
                  })
                : setSelectedOffer((prev) =>
                    prev ? { ...prev, type: e.target.value as OfferType } : null
                  )
            }
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-900"
          >
            <option value={OfferType.IT_SOLUTIONS}>IT Solutions</option>
            <option value={OfferType.DIGITAL_MARKETING}>
              Digital Marketing
            </option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Starting Price ($)
          </label>
          <input
            type="number"
            value={offer.startingPrice}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNew) {
                setNewOffer({ ...newOffer, startingPrice: value });
              } else {
                setSelectedOffer((prev) =>
                  prev ? { ...prev, startingPrice: value } : null
                );
              }
            }}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
            min={0}
            step={0.01}
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Icon
          </label>
          <input
            type="text"
            value={offer.icon}
            onChange={(e) =>
              isNew
                ? setNewOffer({ ...newOffer, icon: e.target.value })
                : setSelectedOffer((prev) =>
                    prev ? { ...prev, icon: e.target.value } : null
                  )
            }
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
            placeholder="Enter icon name..."
          />
        </div>

        {/* Features */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white">Features</label>
            <span className="text-xs text-white/60">
              {(offer.features || []).length} features
            </span>
          </div>

          <div className="space-y-2 mb-2">
            {(offer.features || []).map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
              >
                <div className="flex items-center space-x-3">
                  <LucideIcons.Check className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-white">{feature}</span>
                </div>
                <button
                  onClick={() => handleRemoveFeature(feature, isNew)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white/60 transition-all"
                >
                  <LucideIcons.X className="w-4 h-4" />
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
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature(isNew);
                }
              }}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
              placeholder="Add a feature..."
            />
            <button
              onClick={() => handleAddFeature(isNew)}
              className="px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-xl hover:bg-yellow-500/30 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => (isNew ? setIsNewOpen(false) : setIsEditOpen(false))}
            className="px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={isNew ? handleCreateOffer : handleEditOffer}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-colors font-medium"
          >
            {isNew ? "Create Offer" : "Save Changes"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <button
            onClick={() => setIsNewOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors font-medium"
          >
            <LucideIcons.Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as OfferType | "ALL")
            }
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-900 focus:outline-none focus:border-yellow-500/50"
          >
            <option value="ALL">All Types</option>
            <option value={OfferType.IT_SOLUTIONS}>IT Solutions</option>
            <option value={OfferType.DIGITAL_MARKETING}>
              Digital Marketing
            </option>
          </select>

          {/* Price Range */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Min"
            />
            <span className="text-white/60">to</span>
            <input
              type="text"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-white/60">
        Showing {filteredOffers.length} of {offers.length} services
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOffers.map((offer) => {
              const typeColor = offer.gradient || getTypeColor(offer.type);
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                  className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${typeColor} backdrop-blur-xl shadow-lg`}
                        >
                          {getIconComponent(offer.icon)}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors">
                            {offer.name}
                          </h3>
                          <p className="text-sm text-white/60 mt-1">
                            {offer.description}
                          </p>
                          <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-white/80">
                            {offer.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            setIsEditOpen(true);
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                          <LucideIcons.Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                        >
                          <LucideIcons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {offer.features && offer.features.length > 0 && (
                      <div className="space-y-2">
                        {offer.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group/feature"
                          >
                            <LucideIcons.Check className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-white/80 group-hover/feature:text-white transition-colors">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-white/60">
                          Starting from
                        </span>
                        <span className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                          ${offer.startingPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Modals remain unchanged */}
      <Modal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        title="Add New Service"
      >
        {renderForm(true)}
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Service"
      >
        {renderForm(false)}
      </Modal>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteOffer}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedOffer?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ServiceSection;
