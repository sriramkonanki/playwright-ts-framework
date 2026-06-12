import { test, expect } from "../../fixtures";
import { buildCreateUserPayload, assertIsoDateString, assertPositiveInt } from "../../src/utils/helpers";

/**
 * Users API tests — targeting the public reqres.in mock API.
 * Replace baseURL in playwright.config.ts / .env.local for your real API.
 */
test.describe("Users API", () => {
  // ---- GET /api/users -------------------------------------------------------
  test.describe("GET /api/users", () => {
    test("returns paginated user list", async ({ usersApi }) => {
      const response = await usersApi.getUsers(1);

      expect(response.page).toBe(1);
      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.total).toBeGreaterThan(0);
      expect(response.per_page).toBeGreaterThan(0);
    });

    test("each user has required fields", async ({ usersApi }) => {
      const { data } = await usersApi.getUsers(1);

      for (const user of data) {
        expect(user).toMatchObject({
          id: expect.any(Number),
          email: expect.stringMatching(/@/),
          first_name: expect.any(String),
          last_name: expect.any(String),
          avatar: expect.stringMatching(/^https?:\/\//),
        });
        assertPositiveInt(user.id);
      }
    });

    test("supports pagination to page 2", async ({ usersApi }) => {
      const page1 = await usersApi.getUsers(1);
      const page2 = await usersApi.getUsers(2);

      expect(page2.page).toBe(2);
      const ids1 = page1.data.map((u) => u.id);
      const ids2 = page2.data.map((u) => u.id);
      expect(ids1).not.toEqual(expect.arrayContaining(ids2));
    });
  });

  // ---- GET /api/users/:id ---------------------------------------------------
  test.describe("GET /api/users/:id", () => {
    test("returns a single user", async ({ usersApi }) => {
      const { data: user } = await usersApi.getUser(2);

      expect(user.id).toBe(2);
      expect(user.email).toBeTruthy();
      expect(user.first_name).toBeTruthy();
    });

    test("returns 404 for non-existent user", async ({ usersApi }) => {
      const response = await usersApi.getUserRaw(9999);
      expect(response.status()).toBe(404);
    });
  });

  // ---- POST /api/users ------------------------------------------------------
  test.describe("POST /api/users", () => {
    test("creates a user and returns 201 payload", async ({ usersApi }) => {
      const payload = buildCreateUserPayload({ name: "Jane Doe", job: "QA Engineer" });
      const created = await usersApi.createUser(payload);

      expect(created.name).toBe(payload.name);
      expect(created.job).toBe(payload.job);
      expect(created.id).toBeTruthy();
      assertIsoDateString(created.createdAt);
    });

    test("generated id is a string", async ({ usersApi }) => {
      const created = await usersApi.createUser(buildCreateUserPayload());
      expect(typeof created.id).toBe("string");
    });
  });

  // ---- PUT /api/users/:id ---------------------------------------------------
  test.describe("PUT /api/users/:id", () => {
    test("fully replaces user fields", async ({ usersApi }) => {
      const updated = await usersApi.updateUser(2, { name: "Updated Name", job: "CTO" });

      expect(updated.name).toBe("Updated Name");
      expect(updated.job).toBe("CTO");
      assertIsoDateString(updated.updatedAt);
    });
  });

  // ---- PATCH /api/users/:id -------------------------------------------------
  test.describe("PATCH /api/users/:id", () => {
    test("partially updates a user", async ({ usersApi }) => {
      const updated = await usersApi.patchUser(2, { job: "Architect" });

      expect(updated.job).toBe("Architect");
      assertIsoDateString(updated.updatedAt);
    });
  });

  // ---- DELETE /api/users/:id ------------------------------------------------
  test.describe("DELETE /api/users/:id", () => {
    test("deletes a user and returns 204", async ({ usersApi }) => {
      // No assertion needed — the helper asserts status 204 internally
      await usersApi.deleteUser(2);
    });
  });
});
