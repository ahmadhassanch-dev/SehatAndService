import api from "@/lib/api";

// Existing functions...

export const getProviderServices = (providerId: number) => 
  api.get(`/provider/services?provider_id=${providerId}`);

export const createProviderService = (data: any) => 
  api.post("/provider/services", data);

export const updateProviderService = (id: number, data: any) => 
  api.put(`/provider/services/${id}`, data);

export const deleteProviderService = (id: number) => 
  api.delete(`/provider/services/${id}`);
