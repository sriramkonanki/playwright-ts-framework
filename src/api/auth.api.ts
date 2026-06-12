import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApiClient } from "./base.api";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../types/api.types";

export class AuthApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  // POST /api/login
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return this.post<LoginResponse>("/api/login", payload);
  }

  async loginRaw(payload: LoginPayload): Promise<APIResponse> {
    return this.postRaw("/api/login", payload);
  }

  // POST /api/register
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return this.post<RegisterResponse>("/api/register", payload);
  }

  async registerRaw(payload: RegisterPayload): Promise<APIResponse> {
    return this.postRaw("/api/register", payload);
  }
}
