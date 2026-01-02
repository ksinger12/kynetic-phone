const API_BASE_URL = "http://localhost:8080";

/**
 * Generic GET helper
 * Replace mock logic later with real backend calls
 */
export async function get<T>(endpoint: string): Promise<T> {
  // 🔧 MOCK MODE (temporary)
  console.warn("API call mocked:", endpoint);
  return Promise.reject("Mock mode enabled");

  // REAL VERSION (later)
  // const response = await fetch(`${API_BASE_URL}${endpoint}`);
  // if (!response.ok) {
  //   throw new Error("API request failed");
  // }
  // return response.json();
}
