import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApiClient } from "./base.api";
import type {
  User,
  CreateUserPayload,
  CreateUserResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  ListResponse,
  SingleResponse,
} from "../types/api.types";

export class UsersApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  // GET /api/users?page=N
  async getUsers(page = 1): Promise<ListResponse<User>> {
    return this.get<ListResponse<User>>("/api/users", { params: { page } });
  }

  // GET /api/users/:id
  async getUser(id: number): Promise<SingleResponse<User>> {
    return this.get<SingleResponse<User>>(`/api/users/${id}`);
  }

  // GET /api/users/:id  — raw response for negative tests
  async getUserRaw(id: number): Promise<APIResponse> {
    return this.getRaw(`/api/users/${id}`);
  }

  // POST /api/users
  async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    return this.post<CreateUserResponse>("/api/users", payload);
  }

  // PUT /api/users/:id
  async updateUser(id: number, payload: UpdateUserPayload): Promise<UpdateUserResponse> {
    return this.put<UpdateUserResponse>(`/api/users/${id}`, payload);
  }

  // PATCH /api/users/:id
  async patchUser(id: number, payload: UpdateUserPayload): Promise<UpdateUserResponse> {
    return this.patch<UpdateUserResponse>(`/api/users/${id}`, payload);
  }

  // DELETE /api/users/:id
  async deleteUser(id: number): Promise<void> {
    return this.delete(`/api/users/${id}`);
  }
}
