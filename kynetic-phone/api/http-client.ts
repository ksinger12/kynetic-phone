// const API_BASE_URL = "http://localhost:8484";
const API_BASE_URL = "http://172.20.10.3:8484";// (apartment) //"http://192.168.1.13:8484" (nic's home)
// nic: const API_BASE_URL = "http://192.168.1.33:8484";

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<TResponse>(
  endpoint: string,
  init?: RequestInit
): Promise<TResponse | void> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = init?.method ?? "GET";

  console.log(`${method}:`, url);
  if (init?.body) {
    console.log("BODY:", init.body);
  }

  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  console.log("RAW RESPONSE:", text);

  const parsedBody = parseBody(text);
  const errorBody = toApiErrorBody(parsedBody);

  if (!response.ok) {
    const message =
      errorBody?.message ??
      (text ? `API failed: ${response.status} ${text}` : `API failed: ${response.status}`);
    throw new ApiError(response.status, message, errorBody);
  }

  if (!text) {
    return;
  }

  return parsedBody as TResponse;
}

function parseBody(text: string): unknown | null {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function toApiErrorBody(value: unknown): ApiErrorBody | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const maybeError = value as Record<string, unknown>;
  const body: ApiErrorBody = {};

  if (typeof maybeError.message === "string") {
    body.message = maybeError.message;
  }

  if (maybeError.errors && typeof maybeError.errors === "object") {
    body.errors = maybeError.errors as Record<string, string[]>;
  }

  return Object.keys(body).length > 0 ? body : null;
}

export async function get<T>(endpoint: string): Promise<T> {
  const response = await request<T>(endpoint);
  if (response === undefined) {
    throw new Error("Empty response body");
  }
  return response;
}

export function post<TResponse, TBody = unknown>(
  endpoint: string,
  body?: TBody
): Promise<TResponse | void> {
  return request<TResponse>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
