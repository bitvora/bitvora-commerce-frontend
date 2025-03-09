import { NextRouter } from "next/router";

// API utility for authenticated requests
const api = {
  fetch: async (url: string, options: RequestInit = {}, router: NextRouter | null = null) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
    const sessionId = localStorage.getItem("session_id");
    
    if (!sessionId && router) {
      router.push("/login");
      return null;
    }
    
    const headers = {
      ...options.headers,
      "Session-ID": sessionId || "",
    };
    
    try {
      const response = await fetch(`${apiUrl}${url}`, {
        ...options,
        headers,
      });
      
      // Handle authentication errors
      if (response.status === 401 && router) {
        localStorage.removeItem("session_id");
        router.push("/login");
        return null;
      }
      
      return response;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
};

export default api; 