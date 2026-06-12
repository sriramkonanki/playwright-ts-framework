import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  timeout?: number;
}

/**
 * BaseApiClient wraps Playwright's APIRequestContext with typed helpers,
 * automatic auth headers, and built-in response validation.
 */
export class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;
  private authToken?: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  private buildHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...extra,
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  // -------------------------------------------------------------------------
  // HTTP verbs
  // -------------------------------------------------------------------------
  async get<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const response = await this.request.get(this.url(path), {
      headers: this.buildHeaders(opts.headers),
      params: opts.params as Record<string, string>,
      timeout: opts.timeout,
    });
    return this.parseResponse<T>(response);
  }

  async post<T>(path: string, body: unknown, opts: RequestOptions = {}): Promise<T> {
    const response = await this.request.post(this.url(path), {
      headers: this.buildHeaders(opts.headers),
      data: body,
      timeout: opts.timeout,
    });
    return this.parseResponse<T>(response);
  }

  async put<T>(path: string, body: unknown, opts: RequestOptions = {}): Promise<T> {
    const response = await this.request.put(this.url(path), {
      headers: this.buildHeaders(opts.headers),
      data: body,
      timeout: opts.timeout,
    });
    return this.parseResponse<T>(response);
  }

  async patch<T>(path: string, body: unknown, opts: RequestOptions = {}): Promise<T> {
    const response = await this.request.patch(this.url(path), {
      headers: this.buildHeaders(opts.headers),
      data: body,
      timeout: opts.timeout,
    });
    return this.parseResponse<T>(response);
  }

  async delete(path: string, opts: RequestOptions = {}): Promise<void> {
    const response = await this.request.delete(this.url(path), {
      headers: this.buildHeaders(opts.headers),
      timeout: opts.timeout,
    });
    expect(response.status()).toBe(204);
  }

  // -------------------------------------------------------------------------
  // Raw response (when you need the status code too)
  // -------------------------------------------------------------------------
  async getRaw(path: string, opts: RequestOptions = {}): Promise<APIResponse> {
    return this.request.get(this.url(path), {
      headers: this.buildHeaders(opts.headers),
      params: opts.params as Record<string, string>,
      timeout: opts.timeout,
    });
  }

  async postRaw(path: string, body: unknown, opts: RequestOptions = {}): Promise<APIResponse> {
    return this.request.post(this.url(path), {
      headers: this.buildHeaders(opts.headers),
      data: body,
      timeout: opts.timeout,
    });
  }

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------
  private async parseResponse<T>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `API request failed: ${response.status()} ${response.statusText()}\nBody: ${body}`
      );
    }
    return response.json() as Promise<T>;
  }
}
