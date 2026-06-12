// ---------------------------------------------------------------------------
// User types
// ---------------------------------------------------------------------------
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  name?: string;
  job?: string;
}

export interface UpdateUserResponse {
  name: string;
  job: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  token: string;
}

// ---------------------------------------------------------------------------
// Paginated list
// ---------------------------------------------------------------------------
export interface ListResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}

export interface SingleResponse<T> {
  data: T;
}

// ---------------------------------------------------------------------------
// API error
// ---------------------------------------------------------------------------
export interface ApiError {
  error: string;
}
