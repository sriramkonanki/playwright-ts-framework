import { test, expect } from "../../fixtures";

test.describe("Auth API", () => {
  // ---- POST /api/login ------------------------------------------------------
  test.describe("POST /api/login", () => {
    test("returns a token for valid credentials", async ({ authApi }) => {
      const { token } = await authApi.login({
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      });

      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");
    });

    test("returns 400 when password is missing", async ({ authApi }) => {
      const response = await authApi.loginRaw({
        email: "eve.holt@reqres.in",
        password: "",
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBeTruthy();
    });

    test("returns 400 for unknown email", async ({ authApi }) => {
      const response = await authApi.loginRaw({
        email: "nobody@unknown.com",
        password: "password",
      });

      expect(response.status()).toBe(400);
    });
  });

  // ---- POST /api/register ---------------------------------------------------
  test.describe("POST /api/register", () => {
    test("returns id and token for valid registration", async ({ authApi }) => {
      const { id, token } = await authApi.register({
        email: "eve.holt@reqres.in",
        password: "pistol",
      });

      expect(id).toBeGreaterThan(0);
      expect(token).toBeTruthy();
    });

    test("returns 400 when password is omitted", async ({ authApi }) => {
      const response = await authApi.registerRaw({
        email: "test@example.com",
        password: "",
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBeTruthy();
    });
  });
});
