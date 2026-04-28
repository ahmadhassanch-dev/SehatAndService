"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Save, X } from "lucide-react";
import * as api from "@/lib/api_extensions";

export default function ServiceManagementPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: 0, description: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await api.getProviderServices(1); // Provider ID 1 for MVP
      setServices(data);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    try {
      await api.createProviderService(newService);
      setIsAdding(false);
      setNewService({ name: "", price: 0, description: "" });
      fetchServices();
    } catch (err) {
      console.error("Error adding service", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await api.deleteProviderService(id);
      fetchServices();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Service Management</h1>
      
      <button 
        onClick={() => setIsAdding(!isAdding)}
        className="bg-secondary text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 mb-6"
      >
        <Plus className="w-5 h-5" /> Add New Service
      </button>

      {isAdding && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 mb-8 space-y-4">
          <input 
            placeholder="Service Name"
            className="w-full p-3 bg-white/5 rounded-lg text-white"
            value={newService.name}
            onChange={(e) => setNewService({...newService, name: e.target.value})}
          />
          <input 
            type="number"
            placeholder="Price"
            className="w-full p-3 bg-white/5 rounded-lg text-white"
            value={newService.price}
            onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
          />
          <textarea 
            placeholder="Description"
            className="w-full p-3 bg-white/5 rounded-lg text-white"
            value={newService.description}
            onChange={(e) => setNewService({...newService, description: e.target.value})}
          />
          <div className="flex gap-4">
            <button onClick={handleAddService} className="bg-green-600 px-4 py-2 rounded-lg text-white">Save</button>
            <button onClick={() => setIsAdding(false)} className="bg-red-600 px-4 py-2 rounded-lg text-white">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-slate-900 p-6 rounded-2xl flex justify-between items-center border border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                <p className="text-white/60">Rs. {service.price}</p>
              </div>
              <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-400">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
