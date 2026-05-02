const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;

    // Add query params
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "An error occurred" }));
      throw new Error(error.detail || "An error occurred");
    }

    return response.json();
  }

  // Categories
  async getCategories() {
    return this.request<any[]>("/categories");
  }

  async getCategoryBySlug(slug: string) {
    return this.request<any>(`/categories/${slug}`);
  }

  // Providers
  async getProviders(filters?: {
    category?: string;
    city?: string;
    min_rating?: number;
    verified_only?: boolean;
    sort_by?: string;
    page?: number;
    limit?: number;
  }) {
    return this.request<any>("/providers", { params: filters });
  }

  async getProviderById(id: number) {
    return this.request<any>(`/providers/${id}`);
  }

  async getProviderReviews(providerId: number) {
    return this.request<any[]>(`/providers/${providerId}/reviews`);
  }

  // Search
  async searchProviders(filters: {
    query: string;
    category?: string;
    city?: string;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    verified_only?: boolean;
    page?: number;
    limit?: number;
  }) {
    return this.request<any>("/search", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  // Bookings
  async createBooking(data: {
    provider_id: number;
    service_id?: number;
    service: string;
    description?: string;
    scheduled_date?: string;
    scheduled_time?: string;
    address: string;
    city?: string;
    notes?: string;
  }) {
    return this.request<any>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getBookings(userId?: number, role?: string) {
    return this.request<any[]>("/bookings", {
      params: { user_id: userId, role },
    });
  }

  async updateBooking(bookingId: number, status: string) {
    return this.request<any>(`/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Reviews
  async createReview(data: {
    booking_id: number;
    provider_id: number;
    rating: number;
    comment?: string;
    photos?: string;
  }) {
    return this.request<any>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Chat
  async sendChat(bookingId: number, message: string, messageType?: string) {
    return this.request<any>("/chats", {
      method: "POST",
      body: JSON.stringify({
        booking_id: bookingId,
        message,
        message_type: messageType || "text",
      }),
    });
  }

  async getChats(bookingId: number) {
    return this.request<any[]>(`/chats/${bookingId}`);
  }

  // Auth
  async sendOTP(phone: string) {
    return this.request<{ message: string; otp?: string }>("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, otp: string) {
    return this.request<any>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
  }

  // Dashboard
  async getCustomerDashboard() {
    return this.request<any>("/dashboard/customer");
  }

  async getProviderDashboard() {
    return this.request<any>("/dashboard/provider");
  }

  async getAdminDashboard() {
    return this.request<any>("/dashboard/admin");
  }

  // Health
  async healthCheck() {
    return this.request<{ status: string; service: string }>("/health");
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;