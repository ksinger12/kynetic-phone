// const API_BASE_URL = "http://localhost:8484";
const API_BASE_URL = "http://10.88.111.9:8484";


export async function get<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("GET:", url);

  const response = await fetch(url);

  const text = await response.text(); // <-- critical

  console.log("RAW RESPONSE:", text);

  if (!response.ok) {
    throw new Error(`API failed: ${response.status} ${text}`);
  }

  if (!text) {
    throw new Error("Empty response body");
  }

  return JSON.parse(text) as T;
}

export async function post<TResponse, TBody = unknown>(
  endpoint: string,
  body?: TBody
): Promise<TResponse | void> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("POST:", url);
  console.log("BODY:", body);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();

  console.log("RAW RESPONSE:", text);

  if (!response.ok) {
    throw new Error(`API failed: ${response.status} ${text}`);
  }

  // ✅ Handle 204 or empty body
  if (!text) {
    return;
  }

  return JSON.parse(text) as TResponse;
}


export async function mockGet<T>(endpoint: string): Promise<T> {
  // 🔧 MOCK MODE (temporary)
  console.warn("API call mocked:", endpoint);
  return Promise.reject("Mock mode enabled");
}
