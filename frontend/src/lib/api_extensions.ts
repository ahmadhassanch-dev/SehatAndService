import api from "@/lib/api";

// Assuming ApiClient has a request method
const client = api as any;

export const getProviderServices = (providerId?: number) => 
  providerId 
    ? client.request(`/providers/${providerId}/services`)
    : client.request("/provider/services");

export const createProviderService = (data: any) => 
  client.request("/provider/services", { method: "POST", body: JSON.stringify(data) });

export const updateProviderService = (id: number, data: any) => 
  client.request(`/provider/services/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteProviderService = (id: number) => 
  client.request(`/provider/services/${id}`, { method: "DELETE" });

export const becomeProvider = (data: any) => 
  client.request("/auth/become-provider", { method: "POST", body: JSON.stringify(data) });

export const updateProviderProfile = (data: any) => 
  client.request("/provider/profile", { method: "PUT", body: JSON.stringify(data) });
