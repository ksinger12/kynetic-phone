// const API_BASE_URL = "http://localhost:8484";
const API_BASE_URL = "http://10.88.111.9:8484";


/**
 * Generic GET helper
 * Replace mock logic later with real backend calls
 */
export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  // console.log(response);
  if (!response.ok) {
    throw new Error("API request failed");
  }
  return response.json();
}

export async function mockGet<T>(endpoint: string): Promise<T> {
  // 🔧 MOCK MODE (temporary)
  console.warn("API call mocked:", endpoint);
  return Promise.reject("Mock mode enabled");
}
